/* eslint-disable no-console */

import mockConsole from 'jest-mock-console'

import { Events, Core, Container, Playback, UIObject, version } from '@clappr/core'
import HTML5TVsPlayback from './html5_playback'

const LOG_WARN_HEAD_MESSAGE = '%c[warn][html5_tvs_playback]'
const LOG_WARN_STYLE = 'color: #ff8000;font-weight: bold; font-size: 13px;'

const URL_VIDEO_MP4_EXAMPLE = 'http://example.com/awesome_video.mp4'

const setupTest = (options = {}) => {
  const playbackPlugin = new HTML5TVsPlayback(options)
  const core = new Core(options)
  const container = new Container({ playerId: 1, playback: playbackPlugin })

  return { core, container }
}

describe('HTML5TVsPlayback', function() {
  beforeEach(() => {
    window.HTMLMediaElement.prototype.play = () => { /* do nothing */ }
    window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ }
    window.HTMLMediaElement.prototype.load = () => { /* do nothing */ }

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
    test('always return truthy response', () => {
      expect(HTML5TVsPlayback.canPlay()).toBeTruthy()
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

  describe('constructor', () => {
    test('calls setPrivateFlags method', () => {
      jest.spyOn(HTML5TVsPlayback.prototype, 'setPrivateFlags')
      setupTest()

      expect(HTML5TVsPlayback.prototype.setPrivateFlags).toHaveBeenCalledTimes(1)
    })

    test('calls _setupSource with options.src', () => {
      jest.spyOn(HTML5TVsPlayback.prototype, '_setupSource')
      setupTest({ src: URL_VIDEO_MP4_EXAMPLE })

      expect(HTML5TVsPlayback.prototype._setupSource).toHaveBeenCalledWith(URL_VIDEO_MP4_EXAMPLE)
    })
  })

  describe('setPrivateFlags method', () => {
    test('sets _isStopped flag with false value', () => {
      expect(HTML5TVsPlayback.prototype._isStopped).toBeUndefined()
      expect(this.playback._isStopped).toBeFalsy()
    })

    test('sets _isDestroyed flag with false value', () => {
      expect(HTML5TVsPlayback.prototype._isStopped).toBeUndefined()
      expect(this.playback._isDestroyed).toBeFalsy()
    })
  })

  describe('_setupSource method', () => {
    test('avoids unnecessary video.src updates', () => {
      this.playback.el.src = URL_VIDEO_MP4_EXAMPLE
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(this._src).toBeUndefined()
    })

    test('sets received source URL as video.src attribute', () => {
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(this.playback.el.src).toEqual(URL_VIDEO_MP4_EXAMPLE)
    })

    test('saves current video.src value on internal reference', () => {
      this.playback._setupSource(URL_VIDEO_MP4_EXAMPLE)

      expect(this.playback._src).toEqual(URL_VIDEO_MP4_EXAMPLE)
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
      window.HTMLMediaElement.prototype.play = () => new Promise(() => { throw new Error('Uh-oh!') })

      this.playback.el.play().catch(() => expect(console.log).toHaveBeenCalledWith(
        LOG_WARN_HEAD_MESSAGE,
        LOG_WARN_STYLE,
        'The play promise throws one error: Uh-oh!',
      ))
    })
  })

  describe('pause method', () => {
    test('calls native video.pause method', () => {
      jest.spyOn(this.playback.el, 'pause')
      this.playback.pause()

      expect(this.playback.el.pause).toHaveBeenCalledTimes(1)
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
  })

  describe('_wipeUpMedia method', () => {
    test('removes src attribute from video element', () => {
      this.playback._src = URL_VIDEO_MP4_EXAMPLE
      this.playback.play()

      expect(this.playback.el.src).toEqual(URL_VIDEO_MP4_EXAMPLE)

      this.playback._wipeUpMedia()

      expect(this.playback.el.src).toEqual('')
    })

    test('calls native video.load method without arguments', () => {
      jest.spyOn(this.playback.el, 'load')
      this.playback._wipeUpMedia()

      expect(this.playback.el.load).toHaveBeenCalledTimes(1)
    })
  })
})
