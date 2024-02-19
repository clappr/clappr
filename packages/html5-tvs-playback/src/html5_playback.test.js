/**
 * @jest-environment jsdom
 */
/* eslint-disable no-console */
import mockConsole from 'jest-mock-console'

import { Events, Core, Container, Playback, UIObject, version } from '@clappr/core'
import HTML5TVsPlayback from './html5_playback'
import DRMHandler from './drm/drm_handler'
import { READY_STATE_STAGES, DEFAULT_MINIMUM_DVR_SIZE } from './utils/constants'

const LOG_WARN_HEAD_MESSAGE = '%c[warn][html5_tvs_playback]'
const LOG_INFO_HEAD_MESSAGE = '%c[info][html5_tvs_playback]'
const LOG_WARN_STYLE = 'color: #ff8000;font-weight: bold; font-size: 13px;'
const LOG_INFO_STYLE = 'color: #006600;font-weight: bold; font-size: 13px;'

const URL_VIDEO_EXAMPLE = 'http://example.com/awesome_video'
const URL_VIDEO_MP4_EXAMPLE = `${URL_VIDEO_EXAMPLE}.mp4`
const URL_VIDEO_M3U8_EXAMPLE = `${URL_VIDEO_EXAMPLE}.m3u8`
const URL_VIDEO_UNSUPPORTED_FORMAT_EXAMPLE = `${URL_VIDEO_EXAMPLE}.xpto`

const setupTest = (options = {}) => {
  const playbackPlugin = new HTML5TVsPlayback(options)
  const core = new Core(options)
  const container = new Container({ playerId: 1, playback: playbackPlugin })

  return { core, container }
}

// See MDN docs for more information about the behavior of the AudioTrackList object
// https://developer.mozilla.org/en-US/docs/Web/API/AudioTrackList
const createAudioTrackListStub = () => {
  const tracks = {}

  Object.defineProperties(tracks, {
    addEventListener: { value: jest.fn() },
    removeEventListener: { value: jest.fn() },
    getTrackById: { value: id => tracks[id] },
    0: {
      value: {
        id: '0',
        language: 'en',
        kind: 'description',
        label: 'English (describes video)',
        enabled: true,
      },
      enumerable: true,
    },
    1: {
      value: {
        id: '1',
        language: 'en',
        kind: 'main',
        label: 'English',
        enabled: false,
      },
      enumerable: true,
    },
    length: { value: 2 },
  })

  return {
    value: tracks,
    configurable: true,
  }
}

const setHTMLMediaElementStubs = () => {
  window.HTMLMediaElement.prototype.play = () => { /* do nothing */ }
  window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ }
  window.HTMLMediaElement.prototype.load = () => { /* do nothing */ }
  Object.defineProperty(window.HTMLMediaElement.prototype, 'audioTracks', createAudioTrackListStub())
}

describe('HTML5TVsPlayback', function() {
  beforeEach(() => {
    setHTMLMediaElementStubs()

    this.restoreConsole = mockConsole()

    jest.clearAllMocks()
    const response = setupTest()
    this.core = response.core
    this.container = response.container
    this.core.activeContainer = this.container
    this.playback = this.container.playback
  })
  afterEach(() => this.restoreConsole())

  describe('canPlay static method', () => {
    test('checks if one video URL has supported format', () => {
      expect(HTML5TVsPlayback.canPlay(URL_VIDEO_MP4_EXAMPLE)).toBe(true)
      expect(HTML5TVsPlayback.canPlay(URL_VIDEO_M3U8_EXAMPLE)).toBe(true)
      expect(HTML5TVsPlayback.canPlay(URL_VIDEO_UNSUPPORTED_FORMAT_EXAMPLE)).toBe(false)
    })

    test('checks if one video is supported via mime type', () => {
      expect(HTML5TVsPlayback.canPlay(URL_VIDEO_EXAMPLE, 'video/mp4')).toBe(true)
      expect(HTML5TVsPlayback.canPlay(URL_VIDEO_EXAMPLE, 'application/vnd.apple.mpegurl')).toBe(true)
      expect(HTML5TVsPlayback.canPlay(URL_VIDEO_EXAMPLE, 'mock/xpto')).toBe(false)
    })
  })

  test('is loaded on playback plugins array', () => {
    expect(this.playback.name).toEqual('html5_tvs_playback')
  })

  test('is compatible with the latest Clappr core version', () => {
    expect(this.playback.supportedVersion).toEqual({ min: version })
  })

  test('overrides UIObject tagName getter to define DOM playback element as a video tag ', () => {
    expect(this.playback.tagName).not.toEqual(Playback.prototype.tagName)
    expect(this.playback.tagName).not.toEqual(UIObject.prototype.tagName)
    expect(this.playback.el.tagName).toEqual('VIDEO')
  })

  test('attributes getter returns the width attribute that will be added on the plugin DOM element', () => {
    expect(`${this.playback.el.width}%`).toEqual(this.playback.attributes.width)
  })

  test('attributes getter returns the height attribute that will be added on the plugin DOM element', () => {
    expect(`${this.playback.el.height}%`).toEqual(this.playback.attributes.height)
  })

  describe('mediaType getter', () => {
    test('returns Playback.LIVE if video.duration property is Infinity', () => {
      this.playback.el = { duration: Infinity }

      expect(this.playback.mediaType).toEqual(Playback.LIVE)
    })

    test('returns Playback.VOD if video.duration property is not Infinity', () => {
      this.playback.el = { duration: 0 }

      expect(this.playback.mediaType).toEqual(Playback.VOD)
    })
  })

  test('isReady getter returns the check if video.readyState is greater than or equal HAVE_FUTURE_DATA value', () => {
    jest.spyOn(this.playback.el, 'readyState', 'get').mockReturnValueOnce(READY_STATE_STAGES.HAVE_NOTHING)

    expect(this.playback.isReady).toBeFalsy()

    jest.spyOn(this.playback.el, 'readyState', 'get').mockReturnValueOnce(READY_STATE_STAGES.HAVE_FUTURE_DATA)

    expect(this.playback.isReady).toBeTruthy()
  })

  test('playing getter returns if video it\'s not paused and it\'s not ended', () => {
    jest.spyOn(this.playback.el, 'paused', 'get').mockReturnValueOnce(false)
    jest.spyOn(this.playback.el, 'ended', 'get').mockReturnValueOnce(true)

    expect(this.playback.playing).toBeFalsy()

    jest.spyOn(this.playback.el, 'paused', 'get').mockReturnValueOnce(true)
    jest.spyOn(this.playback.el, 'ended', 'get').mockReturnValueOnce(false)

    expect(this.playback.playing).toBeFalsy()

    jest.spyOn(this.playback.el, 'paused', 'get').mockReturnValueOnce(false)
    jest.spyOn(this.playback.el, 'ended', 'get').mockReturnValueOnce(false)

    expect(this.playback.playing).toBeTruthy()
  })

  test('currentTime getter returns video.currentTime property', () => {
    expect(this.playback.currentTime).toEqual(this.playback.el.currentTime)
  })

  describe('duration getter', () => {
    test('returns video.duration property for VoD content', () => {
      expect(this.playback.duration).toEqual(this.playback.el.duration)
    })

    test('returns the difference between the last and first seekable range values for live content', () => {
      const startTimeChunks = [0, 11, 101]
      const endTimeChunks = [10, 100, 1000]

      jest.spyOn(this.playback, 'isLive', 'get').mockImplementation(() => true)

      this.playback.el = {
        seekable: {
          start: index => startTimeChunks[index],
          end: index => endTimeChunks[index],
          length: 3,
        },
      }

      expect(this.playback.duration).toEqual(1000)
    })

    test('handle exception if TimeRange access throws error', () => {
      const startTimeChunks = [0, 11, 101]
      const endTimeChunks = [10, 100, 1000]

      jest.spyOn(this.playback, 'isLive', 'get').mockImplementation(() => true)

      this.playback.el = {
        seekable: {
          start: index => startTimeChunks[index],
          end: index => { throw new Error('IndexSizeError') },
          length: 3,
        },
        duration: Infinity
      }

      expect(this.playback.duration).toEqual(Infinity)
    })
  })

  test('ended getter returns video.ended property', () => {
    expect(this.playback.ended).toEqual(this.playback.el.ended)
  })

  test('buffering getter returns _isBuffering flag value', () => {
    expect(this.playback.buffering).toEqual(this.playback._isBuffering)
  })

  test('playbackType getter returns mediaType property when is not changed', () => {
    this.playback.el = { duration: 0 }

    expect(this.playback.playbackType).toEqual(this.playback.mediaType)
  })

  test('playbackType setter updates playbackType with new value', () => {
    this.playback.playbackType = 'new value'

    expect(this.playback.playbackType).toEqual('new value')
  })

  test('sourceMedia getter returns returns src property', () => {
    expect(this.playback.sourceMedia).toBe(this.playback._src)
  })

  test('adds event listeners to the audioTrack object of the media element', () => {
    expect(this.playback.el.audioTracks.addEventListener).toHaveBeenCalledWith('addtrack', this.playback._onAudioTracksUpdated)
    expect(this.playback.el.audioTracks.addEventListener).toHaveBeenCalledWith('removetrack', this.playback._onAudioTracksUpdated)
  })

  describe('get audioTracks', () => {
    test('returns empty array if audioTracks property doesn\'t exist on media element', () => {
      delete window.HTMLMediaElement.prototype.audioTracks

      expect(this.playback.audioTracks).toEqual([])
    })

    test('returns the media element audio tracks mapped to the public interface', () => {
      const tracks = this.playback.audioTracks

      expect(tracks.length).toBe(2)
      expect(tracks).toContainEqual({
        id: '0',
        language: 'en',
        kind: 'description',
        label: 'English (describes video)',
      })
      expect(tracks).toContainEqual({
        id: '1',
        language: 'en',
        kind: 'main',
        label: 'English',
      })
    })
  })

  describe('get currentAudioTrack', () => {
    test('returns the media element audio track with the enabled flag on mapped to the public interface', () => {
      expect(this.playback.currentAudioTrack).toEqual({
        id: '0',
        language: 'en',
        kind: 'description',
        label: 'English (describes video)',
      })
    })

    test('does not return anything if no audio track is enabled', () => {
      Object.values(this.playback.el.audioTracks).forEach(t => {
        t.enabled = false
      })

      expect(this.playback.currentAudioTrack).toBeFalsy()
    })

    test('does not return anything if audioTracks property doesn\'t exist on media element', () => {
      delete window.HTMLMediaElement.prototype.audioTracks

      expect(this.playback.currentAudioTrack).toBeFalsy()
    })
  })

  describe('switchAudioTrack', () => {
    test('does not change current audio track if id is unknown', () => {
      const { currentAudioTrack } = this.playback

      this.playback.switchAudioTrack('invalid-id')

      expect(this.playback.currentAudioTrack.id).toBe(currentAudioTrack.id)
    })

    test('changes current audio track to the one owning the provided id', () => {
      const newerAudioTrack = this.playback.audioTracks.find(track => track.id !== this.playback.currentAudioTrack.id)

      this.playback.switchAudioTrack(newerAudioTrack.id)

      expect(this.playback.currentAudioTrack.id).toBe(newerAudioTrack.id)
    })

    test('triggers PLAYBACK_AUDIO_CHANGED event with newer audio track as payload when updated', () => {
      const newerAudioTrack = this.playback.audioTracks.find(track => track.id !== this.playback.currentAudioTrack.id)
      jest.spyOn(this.playback, 'trigger')

      this.playback.switchAudioTrack(newerAudioTrack.id)

      expect(this.playback.trigger).toHaveBeenCalledWith(Events.PLAYBACK_AUDIO_CHANGED, newerAudioTrack)
    })

    test('does not trigger PLAYBACK_AUDIO_CHANGED event if current audio track has not changed', () => {
      jest.spyOn(this.playback, 'trigger')

      this.playback.switchAudioTrack(this.playback.currentAudioTrack.id)

      expect(this.playback.trigger).not.toHaveBeenCalledWith(Events.PLAYBACK_AUDIO_CHANGED, expect.anything())
    })
  })

  test('triggers PLAYBACK_AUDIO_AVAILABLE event with current audio tracks when audio tracks are updated', () => {
    jest.spyOn(this.playback, 'trigger')

    this.playback._onAudioTracksUpdated()

    expect(this.playback.trigger).toHaveBeenCalledWith(Events.PLAYBACK_AUDIO_AVAILABLE, this.playback.audioTracks)
  })

  test('isLive getter returns the check if the mediaType getter returns the Playback.LIVE value', () => {
    jest.spyOn(this.playback, 'mediaType', 'get').mockReturnValueOnce(Playback.VOD)

    expect(this.playback.isLive).toBeFalsy()

    jest.spyOn(this.playback, 'mediaType', 'get').mockReturnValueOnce(Playback.LIVE)

    expect(this.playback.isLive).toBeTruthy()
  })

  test('minimumDvrSizeConfig getter returns the value of a valid options.playback.minimumDvrSize config', () => {
    this.playback.options.playback = { minimumDvrSize: 'invalid_config' }

    expect(this.playback.minimumDvrSizeConfig).toBeFalsy()

    this.playback.options.playback.minimumDvrSize = null

    expect(this.playback.minimumDvrSizeConfig).toBeFalsy()

    this.playback.options.playback.minimumDvrSize = 120

    expect(this.playback.minimumDvrSizeConfig).toEqual(120)
  })

  describe('dvrSize getter', () => {
    test('returns the minimumDvrSizeConfig getter value if options.playback.minimumDvrSize is valid', () => {
      this.playback.options.playback = { minimumDvrSize: 120 }

      expect(this.playback.dvrSize).toEqual(120)
    })

    test('returns the DEFAULT_MINIMUM_DVR_SIZE value if options.playback.minimumDvrSize is invalid', () => {
      this.playback.options.playback = { minimumDvrSize: 'invalid_config' }

      expect(this.playback.dvrSize).toEqual(DEFAULT_MINIMUM_DVR_SIZE)
    })
  })

  test('dvrEnabled getter returns the check of the isLive is truthy and if the duration is greater or equal the dvrSize value', () => {
    jest.spyOn(this.playback, 'isLive', 'get').mockReturnValueOnce(false)
    jest.spyOn(this.playback, 'duration', 'get').mockReturnValueOnce(100)
    jest.spyOn(this.playback, 'dvrSize', 'get').mockReturnValueOnce(60)

    expect(this.playback.dvrEnabled).toBeFalsy()

    jest.spyOn(this.playback, 'isLive', 'get').mockReturnValueOnce(true)
    jest.spyOn(this.playback, 'duration', 'get').mockReturnValueOnce(10)
    jest.spyOn(this.playback, 'dvrSize', 'get').mockReturnValueOnce(60)

    expect(this.playback.dvrEnabled).toBeFalsy()

    jest.spyOn(this.playback, 'isLive', 'get').mockReturnValueOnce(true)
    jest.spyOn(this.playback, 'duration', 'get').mockReturnValueOnce(120)
    jest.spyOn(this.playback, 'dvrSize', 'get').mockReturnValueOnce(60)

    expect(this.playback.dvrEnabled).toBeTruthy()
  })

  describe('events getter', () => {
    test('maps _onCanPlay method as canplay event callback', () => {
      const canPlayEvent = new Event('canplay')
      this.playback.el.dispatchEvent(canPlayEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement canplay event is triggered: ',
        canPlayEvent,
      )
    })

    test('maps _onCanPlayThrough method as canplaythrough event callback', () => {
      const canPlayThroughEvent = new Event('canplaythrough')
      this.playback.el.dispatchEvent(canPlayThroughEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement canplaythrough event is triggered: ',
        canPlayThroughEvent,
      )
    })

    test('maps _onLoadStart method as loadstart event callback', () => {
      const loadStartEvent = new Event('loadstart')
      this.playback.el.dispatchEvent(loadStartEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement loadstart event is triggered: ',
        loadStartEvent,
      )
    })

    test('maps _onLoadedMetadata method as loadedmetadata event callback', () => {
      const loadedMetadataEvent = new Event('loadedmetadata')
      this.playback.el.dispatchEvent(loadedMetadataEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement loadedmetadata event is triggered: ',
        loadedMetadataEvent,
      )
    })

    test('maps _onLoadedData method as loadeddata event callback', () => {
      const loadDataEvent = new Event('loadeddata')
      this.playback.el.dispatchEvent(loadDataEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement loadeddata event is triggered: ',
        loadDataEvent,
      )
    })

    test('maps _onWaiting method as waiting event callback', () => {
      const waitingEvent = new Event('waiting')
      this.playback.el.dispatchEvent(waitingEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement waiting event is triggered: ',
        waitingEvent,
      )
    })

    test('maps _onStalled method as stalled event callback', () => {
      const stalledEvent = new Event('stalled')
      this.playback.el.dispatchEvent(stalledEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement stalled event is triggered: ',
        stalledEvent,
      )
    })

    test('maps _onEmptied method as emptied event callback', () => {
      const emptiedEvent = new Event('emptied')
      this.playback.el.dispatchEvent(emptiedEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement emptied event is triggered: ',
        emptiedEvent,
      )
    })

    test('maps _onPlay method as play event callback', () => {
      const playEvent = new Event('play')
      this.playback.el.dispatchEvent(playEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement play event is triggered: ',
        playEvent,
      )
    })

    test('maps _onPlaying method as playing event callback', () => {
      const playingEvent = new Event('playing')
      this.playback.el.dispatchEvent(playingEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement playing event is triggered: ',
        playingEvent,
      )
    })

    test('maps _onPause method as pause event callback', () => {
      const pauseEvent = new Event('pause')
      this.playback.el.dispatchEvent(pauseEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement pause event is triggered: ',
        pauseEvent,
      )
    })

    test('maps _onRateChange method as ratechange event callback', () => {
      const rateChangeEvent = new Event('ratechange')
      this.playback.el.dispatchEvent(rateChangeEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement ratechange event is triggered: ',
        rateChangeEvent,
      )
    })

    test('maps _onVolumeChange method as volumechange event callback', () => {
      const volumeChangeEvent = new Event('volumechange')
      this.playback.el.dispatchEvent(volumeChangeEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement volumechange event is triggered: ',
        volumeChangeEvent,
      )
    })

    test('maps _onSeeking method as seeking event callback', () => {
      const seekingEvent = new Event('seeking')
      this.playback.el.dispatchEvent(seekingEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement seeking event is triggered: ',
        seekingEvent,
      )
    })

    test('maps _onSeeked method as seeked event callback', () => {
      const seekedEvent = new Event('seeked')
      this.playback.el.dispatchEvent(seekedEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement seeked event is triggered: ',
        seekedEvent,
      )
    })

    test('maps _onDurationChange method as durationchange event callback', () => {
      const durationChangeEvent = new Event('durationchange')
      this.playback.el.dispatchEvent(durationChangeEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement durationchange event is triggered: ',
        durationChangeEvent,
      )
    })

    test('maps _onAbort method as abort event callback', () => {
      const abortEvent = new Event('abort')
      this.playback.el.dispatchEvent(abortEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement abort event is triggered: ',
        abortEvent,
      )
    })

    test('maps _onSuspend method as suspend event callback', () => {
      const suspendEvent = new Event('suspend')
      this.playback.el.dispatchEvent(suspendEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement suspend event is triggered: ',
        suspendEvent,
      )
    })

    test('maps _onEnded method as ended event callback', () => {
      const endedEvent = new Event('ended')
      this.playback.el.dispatchEvent(endedEvent)

      expect(console.log).toHaveBeenCalledWith(
        LOG_INFO_HEAD_MESSAGE,
        LOG_INFO_STYLE,
        'The HTMLMediaElement ended event is triggered: ',
        endedEvent,
      )
    })

    test('maps _onError method as error event callback', () => {
      const errorEvent = new Event('error')
      this.playback.el.dispatchEvent(errorEvent)

      expect(console.log).toHaveBeenNthCalledWith(
        1,
        LOG_WARN_HEAD_MESSAGE,
        LOG_WARN_STYLE,
        'The HTMLMediaElement error event is triggered: ',
        errorEvent,
      )
    })

    test('maps _onError method as error event callback on source element', () => {
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)
      const errorEvent = new Event('error')
      this.playback.$sourceElement.dispatchEvent(errorEvent)

      expect(console.log).toHaveBeenNthCalledWith(
        1,
        LOG_WARN_HEAD_MESSAGE,
        LOG_WARN_STYLE,
        'The HTMLMediaElement error event is triggered: ',
        errorEvent,
      )
    })
  })

  test('config getter returns the options.html5TvsPlayback value', () => {
    const { core, container } = setupTest({ src: URL_VIDEO_MP4_EXAMPLE })
    core.activeContainer = container

    expect(container.playback.config).toEqual(core.options.html5TvsPlayback)
  })

  describe('constructor', () => {
    test('sets the initial state for internal flags', () => {
      expect(HTML5TVsPlayback.prototype._isReady).toBeUndefined()
      expect(HTML5TVsPlayback.prototype._drmConfigured).toBeUndefined()
      expect(HTML5TVsPlayback.prototype._isBuffering).toBeUndefined()
      expect(HTML5TVsPlayback.prototype._isStopped).toBeUndefined()
      expect(HTML5TVsPlayback.prototype._isDestroyed).toBeUndefined()

      setupTest()

      expect(this.playback._isReady).toBeFalsy()
      expect(this.playback._drmConfigured).toBeFalsy()
      expect(this.playback._isBuffering).toBeFalsy()
      expect(this.playback._isStopped).toBeFalsy()
      expect(this.playback._isDestroyed).toBeFalsy()
    })

    test('calls _setupSource with options.src', () => {
      jest.spyOn(HTML5TVsPlayback.prototype, '_setupSource')
      setupTest({ src: URL_VIDEO_MP4_EXAMPLE })

      expect(HTML5TVsPlayback.prototype._setupSource).toHaveBeenCalledWith(URL_VIDEO_MP4_EXAMPLE)
    })
  })

  describe('_setupSource method', () => {
    test('avoids unnecessary video.src updates', () => {
      jest.spyOn(DRMHandler, 'sendLicenseRequest')

      this.playback.$sourceElement = document.createElement('source')
      this.playback.$sourceElement.src = URL_VIDEO_MP4_EXAMPLE
      this.playback.el.appendChild(this.playback.$sourceElement)
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(DRMHandler.sendLicenseRequest).not.toHaveBeenCalled()
    })

    test('creates the $sourceElement reference', () => {
      expect(this.playback.$sourceElement).toBeUndefined()

      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(this.playback.$sourceElement).toBeDefined()
    })

    test('sets received source URL extension as $sourceElement.type attribute', () => {
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(this.playback.$sourceElement.type).toEqual('video/mp4')
    })

    test('sets received source URL as $sourceElement.src attribute', () => {
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(this.playback.$sourceElement.src).toEqual(URL_VIDEO_MP4_EXAMPLE)
    })

    test('saves current $sourceElement.src value on internal reference', () => {
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(this.playback._src).toEqual(URL_VIDEO_MP4_EXAMPLE)
    })

    test('sets license server if config.drm exists and _drmConfigured flag is false', () => {
      const { core, container } = setupTest({ src: URL_VIDEO_MP4_EXAMPLE, html5TvsPlayback: { drm: { licenseServerURL: 'http://fake-domain.com/license_server/playready' } } })
      core.activeContainer = container

      jest.spyOn(DRMHandler, 'sendLicenseRequest')
      container.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(DRMHandler.sendLicenseRequest).toHaveBeenCalledWith(
        container.playback.config.drm,
        container.playback._onDrmConfigured,
        container.playback._onDrmError,
      )
    })

    test('does not setup license server if config.disableDRMSetup is set', () => {
      const { core, container } = setupTest({ src: URL_VIDEO_MP4_EXAMPLE, html5TvsPlayback: { disableDRMSetup: true, drm: { licenseServerURL: 'http://fake-domain.com/license_server/playready' } } })
      core.activeContainer = container

      jest.spyOn(DRMHandler, 'sendLicenseRequest')
      container.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(DRMHandler.sendLicenseRequest).not.toHaveBeenCalled()
    })

    test('appends $sourceElement into the playback.el if no one license server URL is configured or _drmConfigured flag is true', () => {
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(this.playback.el.firstChild).toEqual(this.playback.$sourceElement)
    })

    test('calls load on playback.el after setting up source', () => {
      jest.spyOn(this.playback.el, 'load')
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(this.playback.el.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onDrmConfigured callback', () => {
    test('sets _drmConfigured flag with true value', () => {
      const { core, container } = setupTest({ src: URL_VIDEO_MP4_EXAMPLE })
      core.activeContainer = container
      expect(container.playback._drmConfigured).toBeFalsy()

      container.playback._onDrmConfigured()

      expect(container.playback._drmConfigured).toBeTruthy()
    })

    test('appends $sourceElement into the playback.el', () => {
      const { core, container } = setupTest({ src: URL_VIDEO_MP4_EXAMPLE })
      core.activeContainer = container
      container.playback._onDrmConfigured()

      expect(container.playback.el.firstChild).toEqual(container.playback.$sourceElement)
    })
  })

  describe('_onDrmCleared callback', () => {
    test('sets _drmConfigured flag with false value', () => {
      this.playback._drmConfigured = true
      this.playback._onDrmCleared()

      expect(this.playback._drmConfigured).toBeFalsy()
    })
  })

  describe('_onDrmError callback', () => {
    test('sets _drmConfigured flag with false value', () => {
      this.playback._drmConfigured = true
      this.playback._onDrmError()

      expect(this.playback._drmConfigured).toBeFalsy()
    })

    test('triggers PLAYBACK_ERROR event with formatted error object', () => {
      const cb = jest.fn()

      this.playback.listenToOnce(this.playback, Events.PLAYBACK_ERROR, cb)
      this.playback._onDrmError('fake error message')

      expect(cb).toHaveBeenCalledWith(
        {
          code: 'html5_tvs_playback:DRM',
          description: 'fake error message',
          level: 'FATAL',
          origin: 'html5_tvs_playback',
          raw: {},
          scope: 'playback',
        },
      )
    })
  })

  describe('_updateDvr method', () => {
    test('triggers PLAYBACK_DVR event with received status', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_DVR, cb)
      this.playback._updateDvr(true)

      expect(cb).toHaveBeenCalledTimes(1)
      expect(cb).toHaveBeenCalledWith(true)

      this.playback.listenToOnce(this.playback, Events.PLAYBACK_DVR, cb)
      this.playback._updateDvr(false)

      expect(cb).toHaveBeenCalledTimes(2)
      expect(cb).toHaveBeenCalledWith(false)
    })
  })

  describe('_onCanPlay callback', () => {
    test('sets _isBuffering flag with false value if the current value is true', () => {
      this.playback._isBuffering = true
      this.playback._onCanPlay()

      expect(this.playback._isBuffering).toBeFalsy()
    })

    test('triggers PLAYBACK_BUFFERFULL event if _isBuffering flag value is true', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_BUFFERFULL, cb)
      this.playback._isBuffering = true
      this.playback._onCanPlay()

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onLoadedMetadata callback', () => {
    test('triggers PLAYBACK_LOADEDMETADATA event', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_LOADEDMETADATA, cb)
      this.playback._onLoadedMetadata({ target: { duration: 0 } })

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onCanPlay callback', () => {
    test('calls _signalizeReadyState method if _isReady flag has a falsy value', () => {
      jest.spyOn(this.playback, '_signalizeReadyState')
      this.playback._isReady = true
      this.playback._onCanPlay()
      this.playback._isReady = false
      this.playback._onCanPlay()

      expect(this.playback._signalizeReadyState).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onWaiting callback', () => {
    test('sets _isBuffering flag with true value', () => {
      this.playback._isBuffering = false
      this.playback._onWaiting()

      expect(this.playback._isBuffering).toBeTruthy()
    })

    test('triggers PLAYBACK_BUFFERING event', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_BUFFERING, cb)
      this.playback._onWaiting()

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onPlay callback', () => {
    test('triggers PLAYBACK_PLAY_INTENT event', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_PLAY_INTENT, cb)
      this.playback._onPlay()

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onPlaying callback', () => {
    test('triggers PLAYBACK_PLAY event', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_PLAY, cb)
      this.playback._onPlaying()

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onPause callback', () => {
    test('triggers PLAYBACK_PAUSE event', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_PAUSE, cb)
      this.playback._onPause()

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onSeeking callback', () => {
    test('triggers PLAYBACK_SEEK event', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_SEEK, cb)
      this.playback._onSeeking()

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onSeeked callback', () => {
    test('triggers PLAYBACK_SEEKED event', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_SEEKED, cb)
      this.playback._onSeeked()

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onTimeUpdate callback', () => {
    test('triggers PLAYBACK_TIMEUPDATE event', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_TIMEUPDATE, cb)
      this.playback._onTimeUpdate()

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onEnded callback', () => {
    test('triggers PLAYBACK_ENDED event', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_ENDED, cb)
      this.playback._onEnded()

      expect(cb).toHaveBeenCalledTimes(1)
    })

    test('calls _wipeUpMedia method before notifying PLAYBACK_ENDED event', done => {
      jest.spyOn(this.playback, '_wipeUpMedia')
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_ENDED, () => {
        expect(this.playback._wipeUpMedia).toHaveBeenCalledTimes(1)
        done()
      })
      this.playback._onEnded()
    })

    test('calls _wipeUpMedia method', () => {
      jest.spyOn(this.playback, '_wipeUpMedia')
      this.playback._onEnded()

      expect(this.playback._wipeUpMedia).toHaveBeenCalledTimes(1)
    })
  })

  describe('_onError callback', () => {
    test('triggers PLAYBACK_ERROR event with formatted error object', () => {
      const cb = jest.fn()

      this.playback.listenToOnce(this.playback, Events.PLAYBACK_ERROR, cb)
      this.playback.el.error = { code: 171, message: 'É mentirinha!' }
      this.playback._onError()

      expect(cb).toHaveBeenCalledWith(
        {
          code: 'html5_tvs_playback:171',
          description: 'É mentirinha!',
          level: 'FATAL',
          origin: 'html5_tvs_playback',
          raw: { code: 171, message: 'É mentirinha!' },
          scope: 'playback',
        },
      )
    })
  })

  describe('load method', () => {
    test('calls _wipeUpMedia method', () => {
      jest.spyOn(this.playback, '_wipeUpMedia')
      this.playback.load(URL_VIDEO_MP4_EXAMPLE)

      expect(this.playback._wipeUpMedia).toHaveBeenCalledTimes(1)
    })

    test('calls _setupSource method with received source URL', () => {
      jest.spyOn(this.playback, '_setupSource')
      this.playback.load(URL_VIDEO_MP4_EXAMPLE)

      expect(this.playback._setupSource).toHaveBeenCalledWith(URL_VIDEO_MP4_EXAMPLE)
    })
  })

  describe('play method', () => {
    test('sets _isStopped flag with false value', () => {
      expect(HTML5TVsPlayback.prototype._isStopped).toBeUndefined()

      this.playback.play()

      expect(this.playback._isStopped).toBeFalsy()
    })

    test('calls _setupSource method with video.src internal reference', () => {
      jest.spyOn(this.playback, '_setupSource')
      this.playback.play()

      expect(this.playback._setupSource).toHaveBeenCalledWith(this.playback._src)
    })

    test('calls native video.play method', () => {
      jest.spyOn(this.playback.el, 'play')
      this.playback.play()

      expect(this.playback.el.play).toHaveBeenCalledTimes(1)
    })

    test('logs video.play promise problems', () => {
      const error = new Error('Uh-oh!')
      window.HTMLMediaElement.prototype.play = () => new Promise(() => { throw error })

      this.playback.play()
      this.playback.el.play().catch(() => expect(console.log).toHaveBeenCalledWith(
        LOG_WARN_HEAD_MESSAGE,
        LOG_WARN_STYLE,
        'The play promise throws one error: ',
        error,
      ))
    })
  })

  describe('pause method', () => {
    test('calls native video.pause method', () => {
      jest.spyOn(this.playback.el, 'pause')
      this.playback.pause()

      expect(this.playback.el.pause).toHaveBeenCalledTimes(1)
    })

    test('calls _updateDvr with true value if dvrEnabled getter is truthy', () => {
      jest.spyOn(this.playback, 'dvrEnabled', 'get').mockReturnValueOnce(true)
      jest.spyOn(this.playback, '_updateDvr')
      this.playback.pause()

      expect(this.playback._updateDvr).toHaveBeenCalledTimes(1)
      expect(this.playback._updateDvr).toHaveBeenCalledWith(true)
    })
  })

  describe('seek method', () => {
    test('returns warning message if receives a negative value', () => {
      this.playback.seek(-1)

      expect(console.log).toHaveBeenCalledWith(
        LOG_WARN_HEAD_MESSAGE,
        LOG_WARN_STYLE,
        'Attempting to seek to a negative time. Ignoring this operation.',
      )
    })

    test('calls _updateDvr method with current DVR status if dvrEnabled getter returns true', () => {
      jest.spyOn(this.playback, 'duration', 'get').mockReturnValue(100)
      jest.spyOn(this.playback, 'dvrEnabled', 'get').mockReturnValueOnce(false)
      jest.spyOn(this.playback, '_updateDvr')
      this.playback.seek(10)

      expect(this.playback._updateDvr).not.toHaveBeenCalled()

      jest.spyOn(this.playback, 'dvrEnabled', 'get').mockReturnValueOnce(true)
      this.playback.seek(10)

      expect(this.playback._updateDvr).toHaveBeenCalledTimes(1)
      expect(this.playback._updateDvr).toHaveBeenCalledWith(true)

      jest.spyOn(this.playback, 'dvrEnabled', 'get').mockReturnValueOnce(true)
      this.playback.seek(99)

      expect(this.playback._updateDvr).toHaveBeenCalledTimes(2)
      expect(this.playback._updateDvr).toHaveBeenCalledWith(false)
    })

    test('use video.seekable.start(0) as basis to update current time', () => {
      const startTimeChunks = [10, 50]

      jest.spyOn(this.playback, 'duration', 'get').mockReturnValueOnce(100)
      this.playback.el = { seekable: { start: index => startTimeChunks[index] } }
      this.playback.seek(30)

      expect(this.playback.el.currentTime).toEqual(40)
    })

    test('sets received value on video.currentTime attribute', () => {
      this.playback.seek(10)

      expect(this.playback.el.currentTime).toEqual(10)
    })
  })

  describe('stop method', () => {
    test('calls pause method', () => {
      jest.spyOn(this.playback, 'pause')
      this.playback.stop()

      expect(this.playback.pause).toHaveBeenCalledTimes(1)
    })

    test('sets _isStopped flag with true value', () => {
      this.playback.play()

      expect(this.playback._isStopped).toBeFalsy()

      this.playback.stop()

      expect(this.playback._isStopped).toBeTruthy()
    })

    test('calls _wipeUpMedia method', () => {
      jest.spyOn(this.playback, '_wipeUpMedia')
      this.playback.stop()

      expect(this.playback._wipeUpMedia).toHaveBeenCalledTimes(1)
    })

    test('triggers PLAYBACK_STOP event', () => {
      const cb = jest.fn()
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_STOP, cb)
      this.playback.stop()

      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('destroy method', () => {
    test('sets _isDestroyed flag with true value', () => {
      expect(this.playback._isDestroyed).toBeFalsy()

      this.playback.destroy()

      expect(this.playback._isDestroyed).toBeTruthy()
    })

    test('calls _wipeUpMedia method', () => {
      jest.spyOn(this.playback, '_wipeUpMedia')
      this.playback.destroy()

      expect(this.playback._wipeUpMedia).toHaveBeenCalledTimes(1)
    })

    test('updates video.src internal reference with null value', () => {
      this.playback._src = URL_VIDEO_MP4_EXAMPLE
      this.playback.destroy()

      expect(this.playback._src).toBeNull()
    })

    test('removes event listeners from audio tracks', () => {
      this.playback._src = URL_VIDEO_MP4_EXAMPLE
      this.playback.destroy()

      expect(this.playback.el.audioTracks.removeEventListener).toHaveBeenCalledTimes(2)
      expect(this.playback.el.audioTracks.removeEventListener).toHaveBeenCalledWith('addtrack', this.playback._onAudioTracksUpdated)
      expect(this.playback.el.audioTracks.removeEventListener).toHaveBeenCalledWith('removetrack', this.playback._onAudioTracksUpdated)
    })
  })

  describe('_wipeUpMedia method', () => {
    beforeEach(() => {
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)
    })

    test('sets _isReady flag with false value', () => {
      this.playback._isReady = true
      this.playback._wipeUpMedia()

      expect(this.playback._isReady).toBeFalsy()
    })

    test('removes license server if _drmConfigured flag is true', () => {
      jest.spyOn(DRMHandler, 'clearLicenseRequest').mockImplementation(() => {})
      this.playback._drmConfigured = true
      this.playback._wipeUpMedia()

      expect(DRMHandler.clearLicenseRequest).toHaveBeenCalledTimes(1)
      expect(DRMHandler.clearLicenseRequest).toHaveBeenCalledWith(this.playback._onDrmCleared, this.playback._onDrmError)
    })

    test('sets $sourceElement to null', () => {
      this.playback._wipeUpMedia()
      expect(this.playback.$sourceElement).toBe(null)
    })

    test('removes $sourceElement the DOM', () => {
      this.playback._wipeUpMedia()

      expect(this.playback.el.getElementsByTagName('source').length).toEqual(0)
    })

    test('calls native video.load method without arguments', () => {
      jest.spyOn(this.playback.el, 'load')
      this.playback._wipeUpMedia()

      expect(this.playback.el.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('_signalizeReadyState method', () => {
    test('only trigger PLAYBACK_READY event if isReady getter returns true', () => {
      const cb = jest.fn()
      jest.spyOn(this.playback, '_signalizeReadyState')
      jest.useFakeTimers()

      this.playback.listenToOnce(this.playback, Events.PLAYBACK_READY, cb)
      this.playback._signalizeReadyState()

      jest.advanceTimersByTime(1000)

      expect(cb).not.toHaveBeenCalled()
      expect(this.playback._signalizeReadyState).toHaveBeenCalledTimes(4)

      jest.spyOn(this.playback, 'isReady', 'get').mockReturnValueOnce(true)
      jest.advanceTimersByTime(500)

      expect(cb).toHaveBeenCalledTimes(1)
      expect(this.playback._signalizeReadyState).toHaveBeenCalledTimes(5)
    })

    test('sets _isReady flag with true value before triggering PLAYBACK_READY', done => {
      jest.spyOn(this.playback, 'isReady', 'get').mockReturnValueOnce(true)
      this.playback._isReady = false
      this.playback.listenToOnce(this.playback, Events.PLAYBACK_READY, () => {
        expect(this.playback._isReady).toBeTruthy()
        done()
      })

      this.playback._signalizeReadyState()
    })

    test('sets _isReady flag with true value', () => {
      jest.spyOn(this.playback, 'isReady', 'get').mockReturnValueOnce(true)
      this.playback._isReady = false
      this.playback._signalizeReadyState()

      expect(this.playback._isReady).toBeTruthy()
    })
  })

  test('getCurrentTime method returns currentTime getter', () => {
    expect(this.playback.getCurrentTime()).toEqual(this.playback.el.currentTime)
  })

  test('getDuration method returns duration getter', () => {
    expect(this.playback.getDuration()).toEqual(this.playback.el.duration)
  })

  test('isPlaying method returns playing getter', () => {
    expect(this.playback.isPlaying()).toEqual(this.playback.playing)
  })

  test('getPlaybackType method returns mediaType getter', () => {
    expect(this.playback.getPlaybackType()).toEqual(this.playback.mediaType)
  })
})
