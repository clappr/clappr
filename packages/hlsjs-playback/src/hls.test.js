import { Core, Events, Log, Playback, PlayerError } from '@clappr/core'
import HlsjsPlayback from './hls.js'
import HLSJS from 'hls.js'

const DEFAULT_SRC = 'http://clappr.io/video.m3u8'

const createPlayback = (options = {}, playerError) =>
  new HlsjsPlayback({ src: DEFAULT_SRC, mute: true, ...options }, null, playerError)

const makeLevelData = ({
  targetduration = 6,
  type = null,
  totalduration = 120,
  fragmentStart = 0,
  rawProgramDateTime = 1556663040000,
  fragments
} = {}) => ({
  details: {
    targetduration,
    type,
    totalduration,
    fragments: fragments ?? [{ start: fragmentStart, rawProgramDateTime }]
  }
})

const stubHls = playback => {
  playback._hls = {
    startLoad: vi.fn(),
    stopLoad: vi.fn(),
    recoverMediaError: vi.fn(),
    swapAudioCodec: vi.fn(),
    destroy: vi.fn()
  }
  return playback._hls
}

const freezeNow = (playback, initialMs = 1000000) => {
  let current = initialMs
  vi.spyOn(playback, '_now', 'get').mockImplementation(() => current)
  return {
    advance(ms) {
      current += ms
    }
  }
}

describe('HlsjsPlayback', () => {
  beforeEach(() => {
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => {})
    vi.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllTimers()
  })

  test('have a getter called defaultOptions', () => {
    const playback = createPlayback()
    expect(
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(playback), 'defaultOptions').get
    ).toBeTruthy()
  })

  test('defaultOptions getter returns all the default options values into one object', () => {
    const playback = createPlayback()
    expect(playback.defaultOptions).toEqual({ preload: true })
  })

  test('have a getter called customListeners', () => {
    const playback = createPlayback()
    expect(
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(playback), 'customListeners').get
    ).toBeTruthy()
  })

  test('customListeners getter returns all configured custom listeners for each hls.js event', () => {
    const cb = () => {}
    const playback = createPlayback({
      hlsPlayback: {
        customListeners: [{ eventName: 'hlsMediaAttaching', callback: cb }]
      }
    })
    expect(playback.customListeners).toEqual(playback.options.hlsPlayback.customListeners)
  })

  test.each([
    ['lowercase extension', '/relative/video.m3u8', undefined],
    ['uppercase extension', '/relative/VIDEO.M3U8', undefined],
    [
      'extension with query and fragment',
      '/relative/video.m3u8?foobarQuery=1234#somefragment',
      undefined
    ],
    [
      'no extension with mime',
      'whatever_no_extension?foobarQuery=1234#somefragment',
      'application/x-mpegURL'
    ],
    [
      'protocol-relative with mime',
      '//whatever_no_extension?foobarQuery=1234#somefragment',
      'application/x-mpegURL'
    ],
    ['uppercase mime', '/path/list', 'APPLICATION/VND.APPLE.MPEGURL'],
    [
      'lowercase mime',
      'whatever_no_extension?foobarQuery=1234#somefragment',
      'application/x-mpegurl'
    ]
  ])('can play %s case-insensitively: %s', (_label, src, mimeType) => {
    vi.spyOn(HLSJS, 'isSupported').mockImplementation(() => true)
    expect(HlsjsPlayback.canPlay(src, mimeType)).toBeTruthy()
  })

  test('should ensure it does not create an audio tag if audioOnly is not set', () => {
    let options = { src: 'http://clappr.io/video.m3u8' }
    let playback = new HlsjsPlayback(options)
    expect(playback.tagName).toEqual('video')
    options = { src: 'http://clappr.io/video.m3u8', mimeType: 'application/x-mpegurl' }
    playback = new HlsjsPlayback(options)
    expect(playback.tagName).toEqual('video')
  })

  test('should play on an audio tag if audioOnly is set', () => {
    const options = { src: 'http://clappr.io/video.m3u8', playback: { audioOnly: true } }
    const playback = new HlsjsPlayback(options)
    expect(playback.tagName).toEqual('audio')
  })

  test('should trigger a playback error if source load failed', () => {
    let resolveFn
    const promise = new Promise(resolve => {
      resolveFn = resolve
    })
    const options = {
      src: 'http://clappr.io/notfound.m3u8',
      hlsRecoverAttempts: 0,
      mute: true
    }

    const core = new Core({})
    const playback = new HlsjsPlayback(options, null, core.playerError)
    playback.on(Events.PLAYBACK_ERROR, e => resolveFn(e))
    playback.play()

    promise.then(e => {
      expect(e.raw.type).toEqual(HLSJS.ErrorTypes.NETWORK_ERROR)
      expect(e.raw.details).toEqual(HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR)
    })
  })

  test('registers PLAYBACK_FRAGMENT_CHANGED event', () => {
    expect(Events.Custom.PLAYBACK_FRAGMENT_CHANGED).toEqual('playbackFragmentChanged')
  })

  test('registers PLAYBACK_FRAGMENT_PARSING_METADATA event', () => {
    expect(Events.Custom.PLAYBACK_FRAGMENT_PARSING_METADATA).toEqual(
      'playbackFragmentParsingMetadata'
    )
  })

  test('levels supports specifying the level', () => {
    const playback = createPlayback({ src: 'http://clappr.io/foo.m3u8' })
    playback._setup()
    // NOTE: rather than trying to call playback.setupHls, we'll punch a new one in place
    playback._hls = { levels: [] }
    playback._fillLevels()

    // AUTO by default (-1)
    expect(playback.currentLevel).toEqual(-1)

    // Supports other level specification. Should keep track of it
    // on itself and by proxy on the HLS.js object.
    playback.currentLevel = 0
    expect(playback.currentLevel).toEqual(0)
    expect(playback._hls.currentLevel).toEqual(0)
    playback.currentLevel = 1
    expect(playback.currentLevel).toEqual(1)
    expect(playback._hls.currentLevel).toEqual(1)
  })

  describe('constructor', () => {
    test('should use hlsjsConfig from playback options', () => {
      const options = {
        src: 'http://clappr.io/video.m3u8',
        playback: {
          hlsMinimumDvrSize: 1,
          hlsjsConfig: {
            someHlsjsOption: 'value'
          }
        }
      }
      const playback = new HlsjsPlayback(options)
      playback._setup()
      expect(playback._hls.config.someHlsjsOption).toEqual('value')
    })

    test('should use hlsjsConfig from player options as fallback', () => {
      const options = {
        src: 'http://clappr.io/video.m3u8',
        hlsMinimumDvrSize: 1,
        hlsjsConfig: {
          someHlsjsOption: 'value'
        }
      }
      const playback = new HlsjsPlayback(options)
      playback._setup()
      expect(playback._hls.config.someHlsjsOption).toEqual('value')
    })

    test('merges defaultOptions with received options.hlsPlayback', () => {
      const options = {
        src: 'http://clappr.io/foo.m3u8',
        hlsPlayback: { foo: 'bar' }
      }
      const playback = new HlsjsPlayback(options)
      expect(playback.options.hlsPlayback).toEqual({
        ...options.hlsPlayback,
        ...playback.defaultOptions
      })
    })
  })

  describe('_setup method', () => {
    test('sets _manifestLoading flag to false', () => {
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/foo.m3u8' })
      expect(playback._manifestLoading).toBeUndefined()

      playback._setup()

      expect(playback._manifestLoading).toBeFalsy()
    })

    test('calls this._hls.loadSource when MEDIA_ATTACHED event is triggered and hlsPlayback.preload is true', () => {
      const playback = new HlsjsPlayback({
        src: 'http://clappr.io/foo.m3u8',
        hlsPlayback: { preload: false }
      })
      playback._setup()
      vi.spyOn(playback._hls, 'loadSource')
      playback._hls.trigger(HLSJS.Events.MEDIA_ATTACHED, { media: playback.el })

      expect(playback._hls.loadSource).not.toHaveBeenCalled()

      playback.options.hlsPlayback.preload = true
      playback._setup()
      vi.spyOn(playback._hls, 'loadSource')
      playback._hls.trigger(HLSJS.Events.MEDIA_ATTACHED, { media: playback.el })

      expect(playback._hls.loadSource).toHaveBeenCalledTimes(1)
    })

    test('updates _manifestLoading flag value to true if MANIFEST_LOADING event is triggered', () => {
      const src = 'http://clappr.io/foo.m3u8'
      const playback = new HlsjsPlayback({ src })

      expect(playback._manifestLoading).toBeUndefined()

      playback._setup()
      playback._hls.trigger(HLSJS.Events.MANIFEST_LOADING, { url: src })

      expect(playback._manifestLoading).toBeTruthy()
    })

    test('calls bindCustomListeners method', () => {
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/foo.m3u8' })
      vi.spyOn(playback, 'bindCustomListeners')
      playback._setup()

      expect(playback.bindCustomListeners).toHaveBeenCalledTimes(1)
    })
  })

  describe('_ready method', () => {
    test('avoid to run internal logic if _isReadyState flag is true', () => {
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/video.m3u8' })
      playback._isReadyState = true
      vi.spyOn(playback, '_setup')
      playback._ready()

      expect(playback._setup).not.toHaveBeenCalled()
    })

    test("call _setup method if HLS.JS internal don't exists", () => {
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/video.m3u8' })
      vi.spyOn(playback, '_setup')
      playback._ready()

      expect(playback._setup).toHaveBeenCalledTimes(1)

      playback._ready()
      expect(playback._setup).toHaveBeenCalledTimes(1)
    })

    test('update _isReadyState flag value to true', () => {
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/video.m3u8' })

      expect(playback._isReadyState).toBeFalsy()

      playback._ready()

      expect(playback._isReadyState).toBeTruthy()
    })

    test('triggers PLAYBACK_READY event', () => new Promise(done => {
      const cb = vi.fn()
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/video.m3u8' })

      playback.listenTo(playback, Events.PLAYBACK_READY, cb)
      playback.listenTo(playback, Events.PLAYBACK_READY, () => {
        expect(cb).toHaveBeenCalledTimes(1)
        done()
      })
      playback._ready()
    }))
  })

  describe('play method', () => {
    test('calls this._hls.loadSource once if _manifestLoading flag and options.hlsPlayback.preload are falsy', () => {
      vi.spyOn(HLSJS.prototype, 'loadSource').mockImplementation()
      const src = 'http://clappr.io/foo.m3u8'
      const playback = new HlsjsPlayback({ src, hlsPlayback: { preload: false } })
      playback._setup()
      playback._hls.trigger(HLSJS.Events.MEDIA_ATTACHED, { media: playback.el })

      expect(playback._hls.loadSource).not.toHaveBeenCalled()

      playback.play()
      playback._hls.trigger(HLSJS.Events.MANIFEST_LOADING, { url: src })

      expect(playback._hls.loadSource).toHaveBeenCalledTimes(1)

      // do not call loadSource again while loading a manifest
      playback.play()
      expect(playback._hls.loadSource).toHaveBeenCalledTimes(1)

      playback._manifestLoading = false
      playback.play()

      expect(playback._hls.loadSource).toHaveBeenCalledTimes(2)
      HLSJS.prototype.loadSource.mockRestore()
    })
  })

  describe('load method', () => {
    test('loads a new source when called', () => {
      const playback = new HlsjsPlayback({
        src: 'http://clappr.io/foo.m3u8',
        hlsPlayback: { preload: true }
      })
      const url = 'http://clappr.io/foo2.m3u8'
      playback.load(url)
      vi.spyOn(playback._hls, 'loadSource')
      playback._hls.trigger(HLSJS.Events.MEDIA_ATTACHED, { media: playback.el })
      expect(playback.options.src).toBe(url)
      expect(playback._hls.loadSource).toHaveBeenCalledWith(url)
    })
  })

  describe('bindCustomListeners method', () => {
    test('creates listeners for each item configured on customListeners array', () => {
      const cb = vi.fn()
      const playback = new HlsjsPlayback({
        src: 'http://clappr.io/foo.m3u8',
        hlsPlayback: {
          customListeners: [{ eventName: HLSJS.Events.MEDIA_ATTACHING, callback: cb }]
        }
      })
      playback._setup()

      expect(cb).toHaveBeenCalledTimes(1)

      playback._hls.trigger(HLSJS.Events.MEDIA_ATTACHING, { media: playback.el })

      expect(cb).toHaveBeenCalledTimes(2)
    })

    test("don't add one listener without a valid configuration", () => {
      const cb = vi.fn()
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/foo.m3u8' })
      playback._setup()

      expect(cb).not.toHaveBeenCalled()

      playback.options.hlsPlayback = {}

      expect(cb).not.toHaveBeenCalled()

      playback.options.hlsPlayback.customListeners = []

      expect(cb).not.toHaveBeenCalled()

      playback.options.hlsPlayback.customListeners.push([
        { eventName: 'invalid_name', callback: cb }
      ])

      expect(cb).not.toHaveBeenCalled()
    })

    test('adds a listener for one time when the customListeners array item is configured with the "once" param', () => {
      const cb = vi.fn()
      const playback = new HlsjsPlayback({
        src: 'http://clappr.io/foo.m3u8',
        hlsPlayback: {
          customListeners: [{ eventName: HLSJS.Events.MEDIA_ATTACHING, callback: cb, once: true }]
        }
      })
      playback._setup()

      expect(cb).toHaveBeenCalledTimes(1)

      playback._hls.trigger(HLSJS.Events.MEDIA_ATTACHING)

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('unbindCustomListeners method', () => {
    test('remove listeners for each item configured on customListeners array', () => {
      const cb = vi.fn()
      const playback = new HlsjsPlayback({
        src: 'http://clappr.io/foo.m3u8',
        hlsPlayback: {
          customListeners: [{ eventName: 'hlsFragLoaded', callback: cb }]
        }
      })
      playback._setup()
      playback.unbindCustomListeners()
      playback._hls.trigger(HLSJS.Events.FRAG_LOADED)

      expect(cb).not.toHaveBeenCalled()
    })
  })

  describe('currentTimestamp', () => {
    it('returns the fragment time plus the current playback time', () => {
      const fragmentMock = {
        frag: {
          programDateTime: 1556663040000, // 'Tue Apr 30 2019 19:24:00'
          start: 0
        }
      }
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/foo.m3u8' })
      playback.el.currentTime = 5
      playback._onFragmentChanged(HLSJS.Events.FRAG_CHANGED, fragmentMock)
      expect(playback.currentTimestamp).toBe(1556663045) // 'Tue Apr 30 2019 19:24:05'
    })

    it('returns null if the playback does not have a fragment', () => {
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/foo.m3u8' })
      playback._setup()
      expect(playback.currentTimestamp).toBe(null)
    })
  })

  describe('level and fragment events', () => {
    test('_onLevelSwitch fills levels and reports bitrate', () => {
      const playback = createPlayback()
      playback._hls = {
        levels: [{ height: 1080, width: 1920, bitrate: 4000000 }]
      }
      const onSwitch = vi.fn()
      const onHd = vi.fn()
      const onBitrate = vi.fn()
      playback.on(Events.PLAYBACK_LEVEL_SWITCH, onSwitch)
      playback.on(Events.PLAYBACK_HIGHDEFINITIONUPDATE, onHd)
      playback.on(Events.PLAYBACK_BITRATE, onBitrate)

      playback._onLevelSwitch(HLSJS.Events.LEVEL_SWITCHED, { level: 0 })

      expect(playback.levels).toHaveLength(1)
      expect(playback.highDefinition).toBe(true)
      expect(onSwitch).toHaveBeenCalled()
      expect(onHd).toHaveBeenCalledWith(true)
      expect(onBitrate).toHaveBeenCalledWith(
        expect.objectContaining({ height: 1080, bitrate: 4000000, level: 0 })
      )
    })

    test('_onFragmentLoaded and _onFragmentBuffered forward playback events', () => {
      const playback = createPlayback()
      const onLoaded = vi.fn()
      const onBuffered = vi.fn()
      playback.on(Events.PLAYBACK_FRAGMENT_LOADED, onLoaded)
      playback.on(Events.PLAYBACK_FRAGMENT_BUFFERED, onBuffered)
      const data = { frag: { sn: 1 } }

      playback._onFragmentLoaded(HLSJS.Events.FRAG_LOADED, data)
      playback._onFragmentBuffered(HLSJS.Events.FRAG_BUFFERED, data)

      expect(onLoaded).toHaveBeenCalledWith(data)
      expect(onBuffered).toHaveBeenCalledWith(data)
    })
  })

  describe('DVR time model', () => {
    test('without correlation duration equals playable region duration', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._playlistType = null
      playback._playableRegionStartTime = 10
      playback._playableRegionDuration = 100
      playback._segmentTargetDuration = 6

      expect(playback.getStartTimeOffset()).toBe(10)
      expect(playback.getDuration()).toBe(100)
    })

    test('extrapolated start advances with wall clock and caps at window end', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._playlistType = null
      playback._playableRegionStartTime = 0
      playback._playableRegionDuration = 120
      playback._segmentTargetDuration = 6
      playback._extrapolatedWindowNumSegments = 2
      playback._localStartTimeCorrelation = { local: 1000000, remote: 0 }
      playback._localEndTimeCorrelation = { local: 1000000, remote: 120000 }

      const clock = freezeNow(playback, 1000000)
      expect(playback.getStartTimeOffset()).toBe(0)

      clock.advance(5000)
      expect(playback.getStartTimeOffset()).toBe(5)

      clock.advance(20000)
      expect(playback.getStartTimeOffset()).toBe(12)
    })

    test('extrapolated end advances and is clamped to actual end', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._playlistType = null
      playback._playableRegionStartTime = 0
      playback._playableRegionDuration = 100
      playback._segmentTargetDuration = 6
      playback._extrapolatedWindowNumSegments = 2
      playback._localStartTimeCorrelation = null
      playback._localEndTimeCorrelation = { local: 1000000, remote: 88000 }

      const clock = freezeNow(playback, 1000000)
      expect(playback.getDuration()).toBe(88)

      clock.advance(5000)
      expect(playback.getDuration()).toBe(93)

      clock.advance(20000)
      expect(playback.getDuration()).toBe(100)
    })

    test('EVENT playlist uses raw playable start instead of extrapolated start', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._playlistType = 'EVENT'
      playback._playableRegionStartTime = 40
      playback._playableRegionDuration = 80
      playback._segmentTargetDuration = 6
      playback._localStartTimeCorrelation = { local: 1000000, remote: 0 }
      freezeNow(playback, 1010000)

      expect(playback.getStartTimeOffset()).toBe(40)
      expect(playback.getDuration()).toBe(80)
    })

    test('VOD uses raw playable start instead of extrapolated start', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionStartTime = 5
      playback._playableRegionDuration = 60
      playback._segmentTargetDuration = 6
      playback._localStartTimeCorrelation = { local: 1000000, remote: 0 }
      freezeNow(playback, 1010000)

      expect(playback.getStartTimeOffset()).toBe(5)
      expect(playback.getDuration()).toBe(60)
    })

    test('extrapolated window duration is zero when segment target duration is null', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._playlistType = null
      playback._playableRegionStartTime = 0
      playback._playableRegionDuration = 100
      playback._segmentTargetDuration = null
      playback._localStartTimeCorrelation = { local: 1000000, remote: 0 }
      const clock = freezeNow(playback, 1000000)

      clock.advance(5000)
      expect(playback.getStartTimeOffset()).toBe(0)
    })
  })

  describe('_onLevelUpdated', () => {
    test('returns early when fragments are empty without mutating start time', () => {
      const playback = createPlayback()
      playback._playableRegionStartTime = 15
      playback._onLevelUpdated('levelUpdated', makeLevelData({ fragments: [] }))

      expect(playback._playableRegionStartTime).toBe(15)
    })

    test('first update sets program date time, duration, and correlations', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      freezeNow(playback, 2000000)

      playback._onLevelUpdated(
        'levelUpdated',
        makeLevelData({
          targetduration: 6,
          totalduration: 120,
          fragmentStart: 10,
          rawProgramDateTime: 1556663040000
        })
      )

      expect(playback.getProgramDateTime()).toBe(1556663040000)
      expect(playback._playableRegionDuration).toBe(102)
      expect(playback._durationExcludesAfterLiveSyncPoint).toBe(true)
      expect(playback._playableRegionStartTime).toBe(10)
      expect(playback._localStartTimeCorrelation).toEqual({
        local: 2000000,
        remote: (10 + 6) * 1000
      })
      expect(playback._localEndTimeCorrelation).toEqual({
        local: 2000000,
        remote: 112000
      })
    })

    test('does not trim duration when live sync hidden area exceeds total duration', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      freezeNow(playback)

      playback._onLevelUpdated(
        'levelUpdated',
        makeLevelData({ targetduration: 10, totalduration: 20, fragmentStart: 0 })
      )

      expect(playback._playableRegionDuration).toBe(20)
      expect(playback._durationExcludesAfterLiveSyncPoint).toBe(false)
    })

    test('VOD update does not apply live sync trim', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      freezeNow(playback)

      playback._onLevelUpdated(
        'levelUpdated',
        makeLevelData({ targetduration: 6, totalduration: 120, fragmentStart: 0 })
      )

      expect(playback._playableRegionDuration).toBe(120)
      expect(playback._durationExcludesAfterLiveSyncPoint).toBe(false)
    })

    test('resets start correlation when extrapolated start falls before first chunk', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._segmentTargetDuration = 6
      playback._playableRegionStartTime = 0
      playback._playableRegionDuration = 102
      playback._localStartTimeCorrelation = { local: 1000000, remote: 0 }
      playback._localEndTimeCorrelation = { local: 1000000, remote: 102000 }
      freezeNow(playback, 1000000)

      playback._onLevelUpdated(
        'levelUpdated',
        makeLevelData({
          targetduration: 6,
          totalduration: 120,
          fragmentStart: 30,
          rawProgramDateTime: null
        })
      )

      expect(playback._localStartTimeCorrelation.remote).toBe(30000)
    })

    test('resets start correlation when extrapolated start was past the old window cap', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._segmentTargetDuration = 6
      playback._extrapolatedWindowNumSegments = 2
      playback._playableRegionStartTime = 0
      playback._playableRegionDuration = 102
      playback._localStartTimeCorrelation = { local: 1000000, remote: 0 }
      playback._localEndTimeCorrelation = { local: 1000000, remote: 102000 }
      freezeNow(playback, 1020000)

      playback._onLevelUpdated(
        'levelUpdated',
        makeLevelData({
          targetduration: 6,
          totalduration: 120,
          fragmentStart: 5,
          rawProgramDateTime: null
        })
      )

      expect(playback._localStartTimeCorrelation.remote).toBe(12000)
    })

    test('resets end correlation when extrapolated end exceeds new end time', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._segmentTargetDuration = 6
      playback._playableRegionStartTime = 0
      playback._playableRegionDuration = 200
      playback._localStartTimeCorrelation = { local: 1000000, remote: 0 }
      playback._localEndTimeCorrelation = { local: 1000000, remote: 200000 }
      freezeNow(playback, 1000000)

      playback._onLevelUpdated(
        'levelUpdated',
        makeLevelData({
          targetduration: 6,
          totalduration: 60,
          fragmentStart: 0,
          rawProgramDateTime: null
        })
      )

      expect(playback._localEndTimeCorrelation.remote).toBe(42000)
    })

    test('resets end correlation when extrapolated end was capped past the previous end', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._segmentTargetDuration = 6
      playback._extrapolatedWindowNumSegments = 2
      playback._playableRegionStartTime = 0
      playback._playableRegionDuration = 100
      playback._localStartTimeCorrelation = { local: 1000000, remote: 0 }
      playback._localEndTimeCorrelation = { local: 1000000, remote: 100000 }
      freezeNow(playback, 1005000)

      playback._onLevelUpdated(
        'levelUpdated',
        makeLevelData({
          targetduration: 6,
          totalduration: 128,
          fragmentStart: 0,
          rawProgramDateTime: null
        })
      )

      expect(playback._localEndTimeCorrelation.remote).toBe(100000)
    })

    test('resets end correlation when extrapolated end falls behind the window from the end', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._segmentTargetDuration = 6
      playback._extrapolatedWindowNumSegments = 2
      playback._playableRegionStartTime = 0
      playback._playableRegionDuration = 100
      playback._localStartTimeCorrelation = { local: 1000000, remote: 0 }
      playback._localEndTimeCorrelation = { local: 1000000, remote: 100000 }
      freezeNow(playback, 1000000)

      playback._onLevelUpdated(
        'levelUpdated',
        makeLevelData({
          targetduration: 6,
          totalduration: 200,
          fragmentStart: 0,
          rawProgramDateTime: null
        })
      )

      expect(playback._localEndTimeCorrelation.remote).toBe((182 - 12) * 1000)
    })

    test('calls duration and progress handlers when start and duration change', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      freezeNow(playback)
      vi.spyOn(playback, '_onDurationChange').mockImplementation(() => {})
      vi.spyOn(playback, '_onProgress').mockImplementation(() => {})

      playback._onLevelUpdated(
        'levelUpdated',
        makeLevelData({ targetduration: 6, totalduration: 120, fragmentStart: 10 })
      )

      expect(playback._onDurationChange).toHaveBeenCalled()
      expect(playback._onProgress).toHaveBeenCalled()
    })

    test('respects custom liveSyncDurationCount from hlsjsConfig', () => {
      const playback = createPlayback({
        playback: { hlsjsConfig: { liveSyncDurationCount: 2 } }
      })
      playback._playbackType = Playback.LIVE
      freezeNow(playback)

      playback._onLevelUpdated(
        'levelUpdated',
        makeLevelData({ targetduration: 10, totalduration: 100, fragmentStart: 0 })
      )

      expect(playback._playableRegionDuration).toBe(80)
      expect(playback._durationExcludesAfterLiveSyncPoint).toBe(true)
    })
  })

  describe('time API', () => {
    test('getCurrentTime offsets by start time and never goes below zero', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionStartTime = 20
      playback._playableRegionDuration = 100
      playback.el.currentTime = 45

      expect(playback.getCurrentTime()).toBe(25)

      playback.el.currentTime = 10
      expect(playback.getCurrentTime()).toBe(0)
    })

    test('seek writes element currentTime including start offset', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionStartTime = 20
      playback._playableRegionDuration = 100

      playback.seek(30)
      expect(playback.el.currentTime).toBe(50)
    })

    test('seek of negative time warns and seeks to duration', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionStartTime = 0
      playback._playableRegionDuration = 80
      vi.spyOn(Log, 'warn').mockImplementation(() => {})

      playback.seek(-1)

      expect(Log.warn).toHaveBeenCalled()
      expect(playback.el.currentTime).toBe(80)
    })

    test('seekPercentage maps percent of duration then seeks', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionStartTime = 10
      playback._playableRegionDuration = 100

      playback.seekPercentage(50)
      expect(playback.el.currentTime).toBe(60)
    })

    test('seekPercentage of zero seeks to the start', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionStartTime = 10
      playback._playableRegionDuration = 90
      playback.el.currentTime = 50

      playback.seekPercentage(0)
      expect(playback.el.currentTime).toBe(10)
    })

    test('seekToLivePoint seeks to duration', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.LIVE
      playback._playlistType = 'EVENT'
      playback._playableRegionStartTime = 5
      playback._playableRegionDuration = 70

      playback.seekToLivePoint()
      expect(playback.el.currentTime).toBe(75)
    })
  })

  describe('_onTimeUpdate throttling', () => {
    test('first time update fires PLAYBACK_TIMEUPDATE', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionDuration = 100
      playback.el.currentTime = 1
      freezeNow(playback, 1000000)
      const onTimeUpdate = vi.fn()
      playback.on(Events.PLAYBACK_TIMEUPDATE, onTimeUpdate)

      playback._onTimeUpdate()

      expect(onTimeUpdate).toHaveBeenCalledTimes(1)
      expect(onTimeUpdate.mock.calls[0][0]).toMatchObject({ current: 1, total: 100 })
    })

    test('identical payload within throttle delay is suppressed', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionDuration = 100
      playback.el.currentTime = 1
      const clock = freezeNow(playback, 1000000)
      const onTimeUpdate = vi.fn()
      playback.on(Events.PLAYBACK_TIMEUPDATE, onTimeUpdate)

      playback._onTimeUpdate()
      clock.advance(50)
      playback._onTimeUpdate()

      expect(onTimeUpdate).toHaveBeenCalledTimes(1)
    })

    test('fires again after throttle delay even with same payload', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionDuration = 100
      playback.el.currentTime = 1
      const clock = freezeNow(playback, 1000000)
      const onTimeUpdate = vi.fn()
      playback.on(Events.PLAYBACK_TIMEUPDATE, onTimeUpdate)

      playback._onTimeUpdate()
      clock.advance(250)
      playback._onTimeUpdate()

      expect(onTimeUpdate).toHaveBeenCalledTimes(2)
    })

    test('changed current time fires despite throttle window', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionDuration = 100
      playback.el.currentTime = 1
      const clock = freezeNow(playback, 1000000)
      const onTimeUpdate = vi.fn()
      playback.on(Events.PLAYBACK_TIMEUPDATE, onTimeUpdate)

      playback._onTimeUpdate()
      clock.advance(50)
      playback.el.currentTime = 2
      playback._onTimeUpdate()

      expect(onTimeUpdate).toHaveBeenCalledTimes(2)
    })

    test('changed program date time fires despite throttle window', () => {
      const playback = createPlayback()
      playback._playbackType = Playback.VOD
      playback._playableRegionDuration = 100
      playback._programDateTime = 1000
      playback.el.currentTime = 1
      const clock = freezeNow(playback, 1000000)
      const onTimeUpdate = vi.fn()
      playback.on(Events.PLAYBACK_TIMEUPDATE, onTimeUpdate)

      playback._onTimeUpdate()
      clock.advance(50)
      playback._programDateTime = 2000
      playback._onTimeUpdate()

      expect(onTimeUpdate).toHaveBeenCalledTimes(2)
    })
  })

  describe('_onHLSJSError', () => {
    const cores = []

    afterEach(() => {
      cores.splice(0).forEach(core => core.destroy())
    })

    const createErrorPlayback = (options = {}) => {
      const core = new Core({})
      cores.push(core)
      const playback = createPlayback(options, core.playerError)
      stubHls(playback)
      vi.spyOn(playback, 'play').mockImplementation(() => {})
      vi.spyOn(playback, 'stop').mockImplementation(() => {})
      return playback
    }

    test('recoverable network fatal error calls startLoad', () => {
      const playback = createErrorPlayback()
      vi.spyOn(Log, 'warn').mockImplementation(() => {})

      playback._onHLSJSError('hlsError', {
        fatal: true,
        type: HLSJS.ErrorTypes.NETWORK_ERROR,
        details: HLSJS.ErrorDetails.FRAG_LOAD_ERROR
      })

      expect(playback._hls.startLoad).toHaveBeenCalled()
      expect(playback.stop).not.toHaveBeenCalled()
      expect(playback._recoverAttemptsRemaining).toBe(15)
    })

    test('media fatal error recovers via recoverMediaError then swapAudioCodec then fails', async () => {
      const playback = createErrorPlayback()
      vi.spyOn(Log, 'warn').mockImplementation(() => {})
      vi.spyOn(Log, 'error').mockImplementation(() => {})
      const onError = vi.fn()
      playback.on(Events.PLAYBACK_ERROR, onError)
      const mediaError = {
        fatal: true,
        type: HLSJS.ErrorTypes.MEDIA_ERROR,
        details: HLSJS.ErrorDetails.BUFFER_STALLED_ERROR
      }

      playback._onHLSJSError('hlsError', mediaError)
      expect(playback._hls.recoverMediaError).toHaveBeenCalledTimes(1)
      expect(playback._hls.swapAudioCodec).not.toHaveBeenCalled()
      expect(playback.play).toHaveBeenCalledTimes(1)

      playback._onHLSJSError('hlsError', mediaError)
      expect(playback._hls.swapAudioCodec).toHaveBeenCalledTimes(1)
      expect(playback._hls.recoverMediaError).toHaveBeenCalledTimes(2)
      expect(playback.play).toHaveBeenCalledTimes(2)
      expect(onError).not.toHaveBeenCalled()

      playback._onHLSJSError('hlsError', mediaError)
      await Promise.resolve()

      expect(onError).toHaveBeenCalledTimes(1)
      expect(playback.stop).toHaveBeenCalled()
    })

    test('exhausted recover attempts trigger error and stop', async () => {
      const playback = createErrorPlayback({ hlsRecoverAttempts: 0 })
      vi.spyOn(Log, 'error').mockImplementation(() => {})
      const onError = vi.fn()
      playback.on(Events.PLAYBACK_ERROR, onError)

      playback._onHLSJSError('hlsError', {
        fatal: true,
        type: HLSJS.ErrorTypes.MEDIA_ERROR,
        details: HLSJS.ErrorDetails.BUFFER_STALLED_ERROR
      })

      await Promise.resolve()

      expect(onError).toHaveBeenCalledTimes(1)
      expect(playback.stop).toHaveBeenCalled()
      expect(playback._hls.recoverMediaError).not.toHaveBeenCalled()
    })

    test('non-fatal key denial without option only warns', () => {
      const playback = createErrorPlayback()
      vi.spyOn(Log, 'warn').mockImplementation(() => {})
      const onError = vi.fn()
      const onWarning = vi.fn()
      playback.on(Events.PLAYBACK_ERROR, onError)
      playback.on(Events.PLAYBACK_WARNING, onWarning)

      playback._onHLSJSError('hlsError', {
        fatal: false,
        type: HLSJS.ErrorTypes.NETWORK_ERROR,
        details: HLSJS.ErrorDetails.KEY_LOAD_ERROR,
        response: { code: 403 }
      })

      expect(onError).not.toHaveBeenCalled()
      expect(playback.stop).not.toHaveBeenCalled()
      expect(Log.warn).toHaveBeenCalled()
      expect(onWarning).toHaveBeenCalledTimes(1)
      expect(onWarning.mock.calls[0][0].level).toBe(PlayerError.Levels.WARN)
    })

    test('non-fatal key load with response below 400 only warns', () => {
      const playback = createErrorPlayback({
        playback: { triggerFatalErrorOnResourceDenied: true }
      })
      vi.spyOn(Log, 'warn').mockImplementation(() => {})
      const onError = vi.fn()
      playback.on(Events.PLAYBACK_ERROR, onError)

      playback._onHLSJSError('hlsError', {
        fatal: false,
        type: HLSJS.ErrorTypes.NETWORK_ERROR,
        details: HLSJS.ErrorDetails.KEY_LOAD_ERROR,
        response: { code: 200 }
      })

      expect(onError).not.toHaveBeenCalled()
      expect(Log.warn).toHaveBeenCalled()
    })

    test('includes response in error description when present', async () => {
      const playback = createErrorPlayback()
      vi.spyOn(Log, 'error').mockImplementation(() => {})
      const onError = vi.fn()
      playback.on(Events.PLAYBACK_ERROR, onError)

      playback._onHLSJSError('hlsError', {
        fatal: true,
        type: HLSJS.ErrorTypes.NETWORK_ERROR,
        details: HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR,
        response: { code: 404, text: 'missing' }
      })

      await Promise.resolve()

      expect(onError.mock.calls[0][0].description).toContain('response:')
    })

    test('triggers PLAYBACK_WARNING for a non-fatal error', () => {
      const playback = createErrorPlayback()
      vi.spyOn(Log, 'warn').mockImplementation(() => {})
      const onWarning = vi.fn()
      playback.on(Events.PLAYBACK_WARNING, onWarning)

      playback._onHLSJSError('hlsError', {
        fatal: false,
        type: HLSJS.ErrorTypes.NETWORK_ERROR,
        details: HLSJS.ErrorDetails.FRAG_LOAD_ERROR,
        response: { code: 500 }
      })

      expect(onWarning).toHaveBeenCalledTimes(1)
      expect(onWarning.mock.calls[0][0]).toMatchObject({
        code: `${HLSJS.ErrorTypes.NETWORK_ERROR}_${HLSJS.ErrorDetails.FRAG_LOAD_ERROR}`,
        level: PlayerError.Levels.WARN,
        raw: { response: { code: 500 } }
      })
    })

    test('does not trigger PLAYBACK_WARNING for a fatal error', async () => {
      const playback = createErrorPlayback()
      vi.spyOn(Log, 'error').mockImplementation(() => {})
      const onWarning = vi.fn()
      const onError = vi.fn()
      playback.on(Events.PLAYBACK_WARNING, onWarning)
      playback.on(Events.PLAYBACK_ERROR, onError)

      playback._onHLSJSError('hlsError', {
        fatal: true,
        type: HLSJS.ErrorTypes.NETWORK_ERROR,
        details: HLSJS.ErrorDetails.MANIFEST_LOAD_TIMEOUT,
        response: { code: 504 }
      })

      await Promise.resolve()

      expect(onWarning).not.toHaveBeenCalled()
      expect(onError).toHaveBeenCalledTimes(1)
      expect(playback.stop).toHaveBeenCalled()
    })

    test('does not trigger PLAYBACK_WARNING when non-fatal key denial escalates to fatal', async () => {
      const playback = createErrorPlayback({
        playback: { triggerFatalErrorOnResourceDenied: true }
      })
      vi.spyOn(Log, 'error').mockImplementation(() => {})
      const onWarning = vi.fn()
      const onError = vi.fn()
      playback.on(Events.PLAYBACK_WARNING, onWarning)
      playback.on(Events.PLAYBACK_ERROR, onError)

      playback._onHLSJSError('hlsError', {
        fatal: false,
        type: HLSJS.ErrorTypes.NETWORK_ERROR,
        details: HLSJS.ErrorDetails.KEY_LOAD_ERROR,
        response: { code: 403 }
      })

      await Promise.resolve()

      expect(onWarning).not.toHaveBeenCalled()
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })

  describe('deferred fatal error', () => {
    const NEW_SRC = 'http://clappr.io/other.m3u8'
    const players = []

    const networkError = details => ({
      fatal: true,
      type: HLSJS.ErrorTypes.NETWORK_ERROR,
      details
    })
    const mediaError = {
      fatal: true,
      type: HLSJS.ErrorTypes.MEDIA_ERROR,
      details: HLSJS.ErrorDetails.BUFFER_STALLED_ERROR
    }
    const keyDenied = {
      fatal: false,
      type: HLSJS.ErrorTypes.NETWORK_ERROR,
      details: HLSJS.ErrorDetails.KEY_LOAD_ERROR,
      response: { code: 403 }
    }

    const unrecoveredErrors = [
      ['manifestLoadError', {}, networkError(HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR)],
      ['manifestLoadTimeOut', {}, networkError(HLSJS.ErrorDetails.MANIFEST_LOAD_TIMEOUT)],
      ['manifestParsingError', {}, networkError(HLSJS.ErrorDetails.MANIFEST_PARSING_ERROR)],
      ['levelLoadError', {}, networkError(HLSJS.ErrorDetails.LEVEL_LOAD_ERROR)],
      ['levelLoadTimeOut', {}, networkError(HLSJS.ErrorDetails.LEVEL_LOAD_TIMEOUT)],
      [
        'otherError with attempts left',
        {},
        { fatal: true, type: HLSJS.ErrorTypes.OTHER_ERROR, details: 'whatever' }
      ],
      ['fatal error with hlsRecoverAttempts 0', { hlsRecoverAttempts: 0 }, mediaError],
      [
        'media error after both recoveries',
        {},
        mediaError,
        playback => {
          playback._onHLSJSError('hlsError', mediaError)
          playback._onHLSJSError('hlsError', mediaError)
        }
      ],
      [
        'key denied with triggerFatalErrorOnResourceDenied',
        { playback: { triggerFatalErrorOnResourceDenied: true } },
        keyDenied
      ]
    ]

    const createRealPlayback = (options = {}) => {
      const core = new Core({})
      const playback = createPlayback(options, core.playerError)
      playback._setup()
      vi.spyOn(playback, 'play').mockImplementation(() => {})
      players.push({ core, playback })
      return playback
    }

    const spyOnHls = hls => {
      vi.spyOn(hls, 'stopLoad')
      vi.spyOn(hls, 'destroy')
      vi.spyOn(hls, 'startLoad').mockImplementation(() => {})
      vi.spyOn(hls, 'recoverMediaError').mockImplementation(() => {})
      return hls
    }

    const raise = (playback, data) => playback._onHLSJSError('hlsError', data)

    beforeEach(() => {
      vi.spyOn(Log, 'error').mockImplementation(() => {})
      vi.spyOn(Log, 'warn').mockImplementation(() => {})
      vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    })

    afterEach(() => {
      players.splice(0).forEach(({ core, playback }) => {
        playback.destroy()
        core.destroy()
      })
    })

    test.each(unrecoveredErrors)(
      '%s stops loading now and delivers PLAYBACK_ERROR then destroy after a microtask',
      async (_label, options, data, prepare) => {
        const playback = createRealPlayback(options)
        const hls = spyOnHls(playback._hls)
        const onError = vi.fn()
        playback.on(Events.PLAYBACK_ERROR, onError)
        prepare?.(playback)

        raise(playback, data)

        expect(hls.stopLoad).toHaveBeenCalledTimes(1)
        expect(hls.destroy).not.toHaveBeenCalled()
        expect(onError).not.toHaveBeenCalled()
        expect(playback._hls).toBe(hls)

        await Promise.resolve()

        expect(onError).toHaveBeenCalledTimes(1)
        expect(onError.mock.calls[0][0].code).toBe(`${playback.name}:${data.type}_${data.details}`)
        expect(onError.mock.calls[0][0].level).toBe(PlayerError.Levels.FATAL)
        expect(hls.destroy).toHaveBeenCalledTimes(1)
        expect(onError.mock.invocationCallOrder[0]).toBeLessThan(
          hls.destroy.mock.invocationCallOrder[0]
        )
        expect(hls.startLoad).not.toHaveBeenCalled()
        expect(playback._hls).toBeNull()
      }
    )

    test('triggers a single PLAYBACK_ERROR for consecutive fatal errors', async () => {
      const playback = createRealPlayback()
      const hls = spyOnHls(playback._hls)
      const onError = vi.fn()
      playback.on(Events.PLAYBACK_ERROR, onError)

      raise(playback, networkError(HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR))
      raise(playback, networkError(HLSJS.ErrorDetails.LEVEL_LOAD_ERROR))
      await Promise.resolve()

      expect(onError).toHaveBeenCalledTimes(1)
      expect(hls.destroy).toHaveBeenCalledTimes(1)
    })

    test('ignores recoverable errors from the instance pending stop', async () => {
      const playback = createRealPlayback()
      const hls = spyOnHls(playback._hls)

      raise(playback, { fatal: true, type: HLSJS.ErrorTypes.OTHER_ERROR, details: 'whatever' })
      const attemptsRemaining = playback._recoverAttemptsRemaining
      raise(playback, mediaError)
      raise(playback, networkError(HLSJS.ErrorDetails.FRAG_LOAD_ERROR))

      expect(hls.recoverMediaError).not.toHaveBeenCalled()
      expect(hls.startLoad).not.toHaveBeenCalled()
      expect(playback._recoverAttemptsRemaining).toBe(attemptsRemaining)
      await Promise.resolve()
    })

    test('ignores non-fatal errors from the instance pending stop', async () => {
      const playback = createRealPlayback()
      spyOnHls(playback._hls)
      const onWarning = vi.fn()
      playback.on(Events.PLAYBACK_WARNING, onWarning)

      raise(playback, networkError(HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR))
      raise(playback, { ...networkError(HLSJS.ErrorDetails.FRAG_LOAD_ERROR), fatal: false })

      expect(onWarning).not.toHaveBeenCalled()
      await Promise.resolve()
    })

    test('drops the error and keeps the new instance when load replaced it before the microtask', async () => {
      const playback = createRealPlayback()
      const onError = vi.fn()
      playback.on(Events.PLAYBACK_ERROR, onError)

      raise(playback, networkError(HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR))
      playback.load(NEW_SRC)
      const newHls = spyOnHls(playback._hls)
      Log.warn.mockClear()
      await Promise.resolve()

      expect(onError).not.toHaveBeenCalled()
      expect(newHls.destroy).not.toHaveBeenCalled()
      expect(playback._hls).toBe(newHls)
      expect(Log.warn).toHaveBeenCalledTimes(1)
    })

    test('handles fatal errors of the instance created after a pending stop', async () => {
      const playback = createRealPlayback()
      const onError = vi.fn()
      playback.on(Events.PLAYBACK_ERROR, onError)

      raise(playback, networkError(HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR))
      playback.load(NEW_SRC)
      const newHls = spyOnHls(playback._hls)
      await Promise.resolve()
      raise(playback, { fatal: true, type: HLSJS.ErrorTypes.OTHER_ERROR, details: 'whatever' })

      expect(onError).not.toHaveBeenCalled()
      await Promise.resolve()

      expect(onError).toHaveBeenCalledTimes(1)
      expect(newHls.destroy).toHaveBeenCalledTimes(1)
    })

    test('drops the error without throwing when destroyed before the microtask', async () => {
      const playback = createRealPlayback()
      const onError = vi.fn()
      playback.on(Events.PLAYBACK_ERROR, onError)

      raise(playback, networkError(HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR))
      playback.destroy()
      Log.warn.mockClear()
      await Promise.resolve()

      expect(onError).not.toHaveBeenCalled()
      expect(Log.warn).toHaveBeenCalledTimes(1)
    })

    test('keeps the instance created by a PLAYBACK_ERROR listener calling load', async () => {
      const playback = createRealPlayback()
      let createdHls
      playback.on(Events.PLAYBACK_ERROR, () => {
        playback.load(NEW_SRC)
        createdHls = spyOnHls(playback._hls)
      })

      raise(playback, networkError(HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR))
      await Promise.resolve()

      expect(createdHls.destroy).not.toHaveBeenCalled()
      expect(playback._hls).toBe(createdHls)
    })

    test('does not break the hls.js BUFFER_APPENDING loop when a track append fails fatally', async () => {
      const playback = createRealPlayback()
      const hls = playback._hls
      const { streamController } = hls
      const onError = vi.fn(() => playback.load(NEW_SRC))
      playback.on(Events.PLAYBACK_ERROR, onError)
      // hls.js's own buffer listener throws on this synthetic payload, so only ours runs
      hls.removeAllListeners(HLSJS.Events.BUFFER_APPENDING)
      hls.once(HLSJS.Events.BUFFER_APPENDING, () =>
        raise(playback, {
          fatal: true,
          type: HLSJS.ErrorTypes.MEDIA_ERROR,
          details: HLSJS.ErrorDetails.BUFFER_APPEND_ERROR
        })
      )
      const appendTrack = () => streamController.hls.trigger(HLSJS.Events.BUFFER_APPENDING, {})
      playback._recoverAttemptsRemaining = 0

      expect(() => {
        appendTrack()
        appendTrack()
      }).not.toThrow()
      await Promise.resolve()

      expect(onError).toHaveBeenCalledTimes(1)
      expect(playback._hls).not.toBe(hls)
    })

    test('public stop destroys the hls.js instance synchronously', () => {
      const playback = createRealPlayback()
      const hls = spyOnHls(playback._hls)

      playback.stop()

      expect(hls.destroy).toHaveBeenCalledTimes(1)
      expect(playback._hls).toBeNull()
    })
  })

  describe('dvrEnabled and settings', () => {
    test('dvrEnabled requires live sync trim, min duration, and LIVE type', () => {
      const playback = createPlayback({ hlsMinimumDvrSize: 60 })
      playback._playbackType = Playback.LIVE
      playback._playlistType = 'EVENT'
      playback._playableRegionStartTime = 0
      playback._playableRegionDuration = 120
      playback._durationExcludesAfterLiveSyncPoint = true

      expect(playback.dvrEnabled).toBe(true)

      playback._durationExcludesAfterLiveSyncPoint = false
      expect(playback.dvrEnabled).toBe(false)

      playback._durationExcludesAfterLiveSyncPoint = true
      playback._playableRegionDuration = 30
      expect(playback.dvrEnabled).toBe(false)

      playback._playableRegionDuration = 120
      playback._playbackType = Playback.VOD
      expect(playback.dvrEnabled).toBe(false)
    })

    test('isSeekEnabled is true for VOD or when dvr is enabled', () => {
      const playback = createPlayback({ hlsMinimumDvrSize: 60 })
      playback._playbackType = Playback.VOD
      expect(playback.isSeekEnabled()).toBe(true)

      playback._playbackType = Playback.LIVE
      playback._playlistType = 'EVENT'
      playback._playableRegionDuration = 120
      playback._durationExcludesAfterLiveSyncPoint = false
      expect(playback.isSeekEnabled()).toBe(false)

      playback._durationExcludesAfterLiveSyncPoint = true
      expect(playback.isSeekEnabled()).toBe(true)
    })

    test('_updateSettings chooses left controls from playback type and dvr', () => {
      const playback = createPlayback({ hlsMinimumDvrSize: 60 })
      const onSettings = vi.fn()
      playback.on(Events.PLAYBACK_SETTINGSUPDATE, onSettings)

      playback._playbackType = Playback.VOD
      playback._updateSettings()
      expect(playback.settings.left).toEqual(['playpause', 'position', 'duration'])
      expect(playback.settings.seekEnabled).toBe(true)

      playback._playbackType = Playback.LIVE
      playback._playlistType = 'EVENT'
      playback._playableRegionDuration = 120
      playback._durationExcludesAfterLiveSyncPoint = true
      playback._updateSettings()
      expect(playback.settings.left).toEqual(['playpause'])
      expect(playback.settings.seekEnabled).toBe(true)

      playback._durationExcludesAfterLiveSyncPoint = false
      playback._updateSettings()
      expect(playback.settings.left).toEqual(['playstop'])
      expect(playback.settings.seekEnabled).toBe(false)

      expect(onSettings).toHaveBeenCalledTimes(3)
    })
  })
})
