import Player from '../player'
import Events from '../../base/events'

describe('Player', function() {
  describe('constructor', () => {

    test('has unique sequential id', () => {
      const player1 = new Player({ source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest' })
      const player2 = new Player({ source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest' })
      const player3 = new Player({ source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest' })

      const p1Id = parseInt(player1.options.playerId)
      const p2Id = parseInt(player2.options.playerId)
      const p3Id = parseInt(player3.options.playerId)

      expect(p2Id).toBeGreaterThan(p1Id)
      expect(p3Id).toBeGreaterThan(p2Id)
    })

    test('uses the baseUrl passed from initialization', () => {
      const player = new Player({ source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest' })
      expect(player.options.baseUrl).toEqual('http://cdn.clappr.io/latest')
    })

    test('persists config by default', () => {
      const player = new Player({ source: '/playlist.m3u8' })
      expect(player.options.persistConfig).toEqual(true)
    })

    test('can set persists config', () => {
      const player = new Player({ source: '/playlist.m3u8', persistConfig: false })
      expect(player.options.persistConfig).toEqual(false)
    })

    test('gets plugins by name', () => {
      const player = new Player({ source: '/playlist.m3u8', persistConfig: false })
      const plugin = { name: 'fake' }
      player.core = { plugins: [plugin], activeContainer: { plugins: [] } }
      expect(plugin).toEqual(player.getPlugin('fake'))
    })

    test('should normalize sources', () => {
      const player = new Player({ source: '/playlist.m3u8', persistConfig: false })
      let normalizedSources = player._normalizeSources({ sources: ['http://test.mp4'] })
      expect(normalizedSources.length).toEqual(1)
      expect(normalizedSources[0]).toEqual('http://test.mp4')

      normalizedSources = player._normalizeSources({ source: 'http://test.mp4' })
      expect(normalizedSources.length).toEqual(1)
      expect(normalizedSources[0]).toEqual('http://test.mp4')

      normalizedSources = player._normalizeSources({ sources: [] })
      expect(normalizedSources.length).toEqual(1)
      expect(JSON.stringify(normalizedSources[0])).toEqual(JSON.stringify({ source: '', mimeType: '' }))
    })

    test('should trigger error events', () => {
      const player = new Player({ source: 'http://video.mp4', persistConfig: false })
      const element = document.createElement('div')
      const onError = jest.fn()
      player.on(Events.PLAYER_ERROR, onError)
      player.attachTo(element)
      player.trigger(Events.PLAYER_ERROR)
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })

  describe('attachTo', () => {
    test('attaches the player to a given element', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      expect(player.options.parentElement).toBe(element)
    })
  })

  describe('resize', () => {
    test('resizes the player', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const newSize = { width: 800, height: 600 }
      jest.spyOn(player.core, 'resize')
      player.resize(newSize)
      expect(player.core.resize).toHaveBeenCalledTimes(1)
      expect(player.core.resize).toHaveBeenCalledWith(newSize)
    })
  })

  describe('load', () => {
    test('loads a new source', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const newSource = 'http://new-video.mp4'
      const loadSpy = jest.spyOn(player.core, 'load')
      player.load(newSource)
      expect(loadSpy).toHaveBeenCalledTimes(1)
      expect(loadSpy.mock.calls[0][0]).toBe(newSource)
    })
  })

  describe('destroy', () => {
    test('destroys the player and removes it from the DOM', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const destroySpy = jest.spyOn(player.core, 'destroy')
      player.destroy()
      expect(destroySpy).toHaveBeenCalledTimes(1)
      expect(element.children.length).toBe(0)
    })
  })

  describe('consent', () => {
    test('gives user consent to playback', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const consentCallback = jest.fn()
      const getCurrentPlaybackMock = {
        consent: jest.fn(),
      }
      player.core.getCurrentPlayback = jest.fn(() => getCurrentPlaybackMock)
      player.consent(consentCallback)
      expect(getCurrentPlaybackMock.consent).toHaveBeenCalledTimes(1)
      expect(getCurrentPlaybackMock.consent).toHaveBeenCalledWith(consentCallback)
    })
  })

  describe('play', () => {
    test('plays the current video', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const activeContainerMock = {
        play: jest.fn(),
      }
      player.core.activeContainer = activeContainerMock
      player.play()
      expect(activeContainerMock.play).toHaveBeenCalledTimes(1)
    })
  })

  describe('pause', () => {
    test('pauses the current video', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const activeContainerMock = {
        pause: jest.fn(),
      }
      player.core.activeContainer = activeContainerMock
      player.pause()
      expect(activeContainerMock.pause).toHaveBeenCalledTimes(1)
    })
  })

  describe('stop', () => {
    test('stops the current video', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const activeContainerMock = {
        stop: jest.fn(),
      }
      player.core.activeContainer = activeContainerMock
      player.stop()
      expect(activeContainerMock.stop).toHaveBeenCalledTimes(1)
    })
  })

  describe('seek', () => {
    test('seeks the current video', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const activeContainerMock = {
        seek: jest.fn(),
      }
      player.core.activeContainer = activeContainerMock
      const time = 10
      player.seek(time)
      expect(activeContainerMock.seek).toHaveBeenCalledTimes(1)
      expect(activeContainerMock.seek).toHaveBeenCalledWith(time)
    })
  })

  describe('seekPercentage', () => {
    test('seeks the current video by percentage', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const activeContainerMock = {
        seekPercentage: jest.fn(),
      }
      player.core.activeContainer = activeContainerMock
      const percentage = 50
      player.seekPercentage(percentage)
      expect(activeContainerMock.seekPercentage).toHaveBeenCalledTimes(1)
      expect(activeContainerMock.seekPercentage).toHaveBeenCalledWith(percentage)
    })
  })

  describe('mute', () => {
    test('mutes the current video', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const coreMock = {
        activePlayback: {
          mute: jest.fn(),
        },
      }
      player.core = coreMock
      player.mute()
      expect(coreMock.activePlayback.mute).toHaveBeenCalledTimes(1)
    })
  })

  describe('unmute', () => {
    test('unmutes the current video', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const coreMock = {
        activePlayback: {
          unmute: jest.fn(),
        },
      }
      player.core = coreMock
      player.unmute()
      expect(coreMock.activePlayback.unmute).toHaveBeenCalledTimes(1)
    })
  })

  describe('isPlaying', () => {
    test('returns true if the current video is playing', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      player.core.activeContainer.isPlaying = jest.fn(() => true)
      expect(player.isPlaying()).toBe(true)
    })

    test('returns false if the current video is not playing', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      player.core.activeContainer.isPlaying = jest.fn(() => false)
      expect(player.isPlaying()).toBe(false)
    })
  })

  describe('isDvrEnabled', () => {
    test('returns true if DVR is enabled', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      player.core.activeContainer.isDvrEnabled = jest.fn(() => true)
      expect(player.isDvrEnabled()).toBe(true)
    })

    test('returns false if DVR is not enabled', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      player.core.activeContainer.isDvrEnabled = jest.fn(() => false)
      expect(player.isDvrEnabled()).toBe(false)
    })
  })

  describe('isDvrInUse', () => {
    test('returns true if DVR is in use', () => {
      const player = new Player({ source: ' http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      player.core.activeContainer.isDvrInUse = jest.fn(() => true)
      expect(player.isDvrInUse()).toBe(true)
    })

    test('returns false if DVR is not in use', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      player.core.activeContainer.isDvrInUse = jest.fn(() => false)
      expect(player.isDvrInUse()).toBe(false)
    })
  })

  describe('configure', () => {
    test('updates the player options', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const coreMock = {
        configure: jest.fn(),
      }
      player.core = coreMock
      const newOptions = { autoPlay: true }
      player.configure(newOptions)
      expect(coreMock.configure).toHaveBeenCalledTimes(1)
      expect(coreMock.configure).toHaveBeenCalledWith(newOptions)
    })
  })

  describe('getPlugin', () => {
    test('returns a plugin instance', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      const plugin = { name: 'fake' }
      player.core.plugins = [plugin]
      expect(player.getPlugin('fake')).toBe(plugin)
    })

    test('returns undefined if plugin is not found', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      expect(player.getPlugin('non-existent')).toBeUndefined()
    })
  })

  describe('getCurrentTime', () => {
    test('returns the current time', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      player.core.activeContainer.getCurrentTime = jest.fn(() => 10)
      expect(player.getCurrentTime()).toBe(10)
    })
  })

  describe('getStartTimeOffset', () => {
    test('returns the start time offset', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      player.core.activeContainer.getStartTimeOffset = jest.fn(() => 10)
      expect(player.getStartTimeOffset()).toBe(10)
    })
  })

  describe('getDuration', () => {
    test('returns the duration', () => {
      const player = new Player({ source: 'http://video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      player.core.activeContainer.getDuration = jest.fn(() => 10)
      expect(player.getDuration()).toBe(10)
    })
  })

  describe('register options event listeners', () => {
    let player
    beforeEach(() => {
      player = new Player({ source: '/video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      jest.spyOn(player, '_registerOptionEventListeners')
    })

    test('should register on configure', () => {
      player.configure({
        events: {
          onPlay: () => {}
        }
      })

      expect(player._registerOptionEventListeners).toHaveBeenCalledTimes(1)
    })

    test('should call only last registered callback', () => {
      const callbacks = {
        callbackA: jest.fn(),
        callbackB: jest.fn(),
      }
      player.configure({
        events: {
          onPlay: callbacks.callbackA
        }
      })

      player.configure({
        events: {
          onPlay: callbacks.callbackB
        }
      })

      player._onPlay()

      expect(callbacks.callbackA).not.toHaveBeenCalled()
      expect(callbacks.callbackB).toHaveBeenCalledTimes(1)
    })

    test('should add a new event callback', () => {
      const callbacks = {
        callbackC: jest.fn()
      }
      player.configure({
        events: {}
      })

      player.configure({
        events: {
          onPause: callbacks.callbackC,
        }
      })

      player._onPause()

      expect(callbacks.callbackC).toHaveBeenCalledTimes(1)
    })

    test('should remove previous event callbacks', () => {
      const callbacks = {
        callbackA: jest.fn(),
        callbackB: jest.fn()
      }
      player.configure({
        events: {
          onPlay: callbacks.callbackA,
        }
      })

      player.configure({
        events: {
          onPause: callbacks.callbackB,
        }
      })

      player._onPlay()
      player._onPause()

      expect(callbacks.callbackA).not.toHaveBeenCalled()
      expect(callbacks.callbackB).toHaveBeenCalledTimes(1)
    })

    test('does not override events on configure if there are no events', () => {
      const callbacks = {
        callbackA: jest.fn()
      }
      player.configure({
        events: {
          onPause: callbacks.callbackA,
        }
      })

      player.configure({
        someOtherOption: true
      })

      player._onPause()

      expect(callbacks.callbackA).toHaveBeenCalledTimes(1)
    })

    test('does not interfere with event listeners added through Player.on', () => {
      const callbacks = {
        callbackA: jest.fn(),
        callbackB: jest.fn(),
      }

      player.on(Events.PLAYER_PAUSE, callbacks.callbackB)

      player.configure({
        events: {
          onPause: callbacks.callbackA,
        }
      })

      player._onPause()

      expect(callbacks.callbackA).toHaveBeenCalledTimes(1)
      expect(callbacks.callbackB).toHaveBeenCalledTimes(1)
    })
  })

  describe('when a core event is fired', () => {
    let onResizeSpy, player

    beforeEach(() => {
      onResizeSpy = jest.fn()

      player = new Player({
        source: 'http://video.mp4',
        events: {
          onResize: onResizeSpy
        }
      })

      const element = document.createElement('div')
      player.attachTo(element)
    })

    describe('on Events.CORE_RESIZE', () => {
      test('calls onResize callback with width and height', () => {
        const newSize = { width: '50%', height: '50%' }
        player.core.trigger(Events.CORE_RESIZE, newSize)
        expect(onResizeSpy).toHaveBeenCalledWith(newSize)
      })
    })
  })
})
