import { Core, Events } from '@clappr/core'
import HlsjsPlayback from './hls.js'
import HLSJS from 'hls.js'

const simplePlaybackMock = new HlsjsPlayback({ src: 'http://clappr.io/video.m3u8' })

describe('HlsjsPlayback', () => {
  test('have a getter called defaultOptions', () => {
    expect(
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(simplePlaybackMock), 'defaultOptions')
        .get
    ).toBeTruthy()
  })

  test('defaultOptions getter returns all the default options values into one object', () => {
    expect(simplePlaybackMock.defaultOptions).toEqual({ preload: true })
  })

  test('have a getter called customListeners', () => {
    expect(
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(simplePlaybackMock), 'customListeners')
        .get
    ).toBeTruthy()
  })

  test('customListeners getter returns all configured custom listeners for each hls.js event', () => {
    const cb = () => {}
    const playback = new HlsjsPlayback({
      src: 'http://clappr.io/foo.m3u8',
      hlsPlayback: {
        customListeners: [{ eventName: 'hlsMediaAttaching', callback: cb }]
      }
    })
    expect(playback.customListeners).toEqual(playback.options.hlsPlayback.customListeners)
  })

  test('should be able to identify it can play resources independently of the file extension case', () => {
    jest.spyOn(HLSJS, 'isSupported').mockImplementation(() => true)
    expect(HlsjsPlayback.canPlay('/relative/video.m3u8')).toBeTruthy()
    expect(HlsjsPlayback.canPlay('/relative/VIDEO.M3U8')).toBeTruthy()
    expect(HlsjsPlayback.canPlay('/relative/video.m3u8?foobarQuery=1234#somefragment')).toBeTruthy()
    expect(
      HlsjsPlayback.canPlay(
        'whatever_no_extension?foobarQuery=1234#somefragment',
        'application/x-mpegURL'
      )
    ).toBeTruthy()
    expect(
      HlsjsPlayback.canPlay(
        '//whatever_no_extension?foobarQuery=1234#somefragment',
        'application/x-mpegURL'
      )
    ).toBeTruthy()
  })

  test('can play regardless of any mime type letter case', () => {
    jest.spyOn(HLSJS, 'isSupported').mockImplementation(() => true)
    expect(HlsjsPlayback.canPlay('/path/list.m3u8', 'APPLICATION/VND.APPLE.MPEGURL')).toBeTruthy()
    expect(
      HlsjsPlayback.canPlay(
        'whatever_no_extension?foobarQuery=1234#somefragment',
        'application/x-mpegurl'
      )
    ).toBeTruthy()
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
    jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => {})
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
    const options = { src: 'http://clappr.io/foo.m3u8' }
    const playback = new HlsjsPlayback(options)
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
      jest.spyOn(playback._hls, 'loadSource')
      playback._hls.trigger(HLSJS.Events.MEDIA_ATTACHED, { media: playback.el })

      expect(playback._hls.loadSource).not.toHaveBeenCalled()

      playback.options.hlsPlayback.preload = true
      playback._setup()
      jest.spyOn(playback._hls, 'loadSource')
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
      jest.spyOn(playback, 'bindCustomListeners')
      playback._setup()

      expect(playback.bindCustomListeners).toHaveBeenCalledTimes(1)
    })
  })

  describe('_ready method', () => {
    test('avoid to run internal logic if _isReadyState flag is true', () => {
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/video.m3u8' })
      playback._isReadyState = true
      jest.spyOn(playback, '_setup')
      playback._ready()

      expect(playback._setup).not.toHaveBeenCalled()
    })

    test("call _setup method if HLS.JS internal don't exists", () => {
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/video.m3u8' })
      jest.spyOn(playback, '_setup')
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

    test('triggers PLAYBACK_READY event', done => {
      const cb = jest.fn()
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/video.m3u8' })

      playback.listenTo(playback, Events.PLAYBACK_READY, cb)
      playback.listenTo(playback, Events.PLAYBACK_READY, () => {
        expect(cb).toHaveBeenCalledTimes(1)
        done()
      })
      playback._ready()
    })
  })

  describe('play method', () => {
    test('calls this._hls.loadSource once if _manifestLoading flag and options.hlsPlayback.preload are falsy', () => {
      jest.spyOn(HLSJS.prototype, 'loadSource').mockImplementation()
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
      jest.spyOn(playback._hls, 'loadSource')
      playback._hls.trigger(HLSJS.Events.MEDIA_ATTACHED, { media: playback.el })
      expect(playback.options.src).toBe(url)
      expect(playback._hls.loadSource).toHaveBeenCalledWith(url)
    })
  })

  describe('bindCustomListeners method', () => {
    test('creates listeners for each item configured on customListeners array', () => {
      const cb = jest.fn()
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
      const cb = jest.fn()
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
      const cb = jest.fn()
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
      const cb = jest.fn()
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
      playback._setup()
      playback.unbindCustomListeners()
      playback._hls.trigger(HLSJS.Events.FRAG_CHANGED, fragmentMock)
      expect(playback.currentTimestamp).toBe(1556663045) // 'Tue Apr 30 2019 19:24:05'
    })

    it('returns null if the playback does not have a fragment', () => {
      const playback = new HlsjsPlayback({ src: 'http://clappr.io/foo.m3u8' })
      playback._setup()
      expect(playback.currentTimestamp).toBe(null)
    })
  })
})
