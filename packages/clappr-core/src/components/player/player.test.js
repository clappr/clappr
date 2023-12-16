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

  describe('register options event listeners', () => {
    beforeEach(() => {
      this.player = new Player({ source: '/video.mp4' })
      const element = document.createElement('div')
      this.player.attachTo(element)
      jest.spyOn(this.player, '_registerOptionEventListeners')
    })

    test('should register on configure', () => {
      this.player.configure({
        events: {
          onPlay: () => {}
        }
      })

      expect(this.player._registerOptionEventListeners).toHaveBeenCalledTimes(1)
    })

    test('should call only last registered callback', () => {
      const callbacks = {
        callbackA: jest.fn(),
        callbackB: jest.fn(),
      }
      this.player.configure({
        events: {
          onPlay: callbacks.callbackA
        }
      })

      this.player.configure({
        events: {
          onPlay: callbacks.callbackB
        }
      })

      this.player._onPlay()

      expect(callbacks.callbackA).not.toHaveBeenCalled()
      expect(callbacks.callbackB).toHaveBeenCalledTimes(1)
    })

    test('should add a new event callback', () => {
      const callbacks = {
        callbackC: jest.fn()
      }
      this.player.configure({
        events: {}
      })

      this.player.configure({
        events: {
          onPause: callbacks.callbackC,
        }
      })

      this.player._onPause()

      expect(callbacks.callbackC).toHaveBeenCalledTimes(1)
    })

    test('should remove previous event callbacks', () => {
      const callbacks = {
        callbackA: jest.fn(),
        callbackB: jest.fn()
      }
      this.player.configure({
        events: {
          onPlay: callbacks.callbackA,
        }
      })

      this.player.configure({
        events: {
          onPause: callbacks.callbackB,
        }
      })

      this.player._onPlay()
      this.player._onPause()

      expect(callbacks.callbackA).not.toHaveBeenCalled()
      expect(callbacks.callbackB).toHaveBeenCalledTimes(1)
    })

    test('does not override events on configure if there are no events', () => {
      const callbacks = {
        callbackA: jest.fn()
      }
      this.player.configure({
        events: {
          onPause: callbacks.callbackA,
        }
      })

      this.player.configure({
        someOtherOption: true
      })

      this.player._onPause()

      expect(callbacks.callbackA).toHaveBeenCalledTimes(1)
    })

    test('does not interfere with event listeners added through Player.on', () => {
      const callbacks = {
        callbackA: jest.fn(),
        callbackB: jest.fn(),
      }

      this.player.on(Events.PLAYER_PAUSE, callbacks.callbackB)

      this.player.configure({
        events: {
          onPause: callbacks.callbackA,
        }
      })

      this.player._onPause()

      expect(callbacks.callbackA).toHaveBeenCalledTimes(1)
      expect(callbacks.callbackB).toHaveBeenCalledTimes(1)
    })
  })

  describe('when a core event is fired', () => {
    let onResizeSpy

    beforeEach(() => {
      onResizeSpy = jest.fn()

      this.player = new Player({
        source: 'http://video.mp4',
        events: {
          onResize: onResizeSpy
        }
      })

      const element = document.createElement('div')
      this.player.attachTo(element)
    })

    describe('on Events.CORE_RESIZE', () => {
      test('calls onResize callback with width and height', () => {
        const newSize = { width: '50%', height: '50%' }
        this.player.core.trigger(Events.CORE_RESIZE, newSize)
        expect(onResizeSpy).toHaveBeenCalledWith(newSize)
      })
    })
  })
})
