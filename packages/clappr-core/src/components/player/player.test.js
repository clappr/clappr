import Player from '../player/player'
import Events from '../../base/events/events'

const CONTAINER_ARGS = {
  play: [{ reason: 'test' }],
  pause: [{ reason: 'test' }],
  stop: [{ reason: 'test' }],
  seek: [10],
  seekPercentage: [50],
  setVolume: [50]
}

const CONTROL_ARGS = {
  ...CONTAINER_ARGS,
  mute: [],
  unmute: [],
  resize: [{ width: 640, height: 360 }],
  load: ['/other.mp4'],
  configure: [{ autoPlay: true }]
}

const expectEveryControlToReturnPlayer = player =>
  Object.entries(CONTROL_ARGS).forEach(([name, args]) =>
    expect(player[name](...args), name).toBe(player)
  )

const expectConsentToCallBackOnce = player => {
  const callback = vi.fn()

  expect(player.consent(callback)).toBeUndefined()

  expect(callback).toHaveBeenCalledTimes(1)
  expect(() => player.consent()).not.toThrow()
  expect(() => player.consent('not a function')).not.toThrow()
}

describe('Player', function () {
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
      const onError = vi.fn()
      player.on(Events.PLAYER_ERROR, onError)
      player.attachTo(element)
      player.trigger(Events.PLAYER_ERROR)
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })

  describe('register options event listeners', () => {
    let player
    beforeEach(() => {
      player = new Player({ source: '/video.mp4' })
      const element = document.createElement('div')
      player.attachTo(element)
      vi.spyOn(player, '_registerOptionEventListeners')
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
        callbackA: vi.fn(),
        callbackB: vi.fn()
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
        callbackC: vi.fn()
      }
      player.configure({
        events: {}
      })

      player.configure({
        events: {
          onPause: callbacks.callbackC
        }
      })

      player._onPause()

      expect(callbacks.callbackC).toHaveBeenCalledTimes(1)
    })

    test('should remove previous event callbacks', () => {
      const callbacks = {
        callbackA: vi.fn(),
        callbackB: vi.fn()
      }
      player.configure({
        events: {
          onPlay: callbacks.callbackA
        }
      })

      player.configure({
        events: {
          onPause: callbacks.callbackB
        }
      })

      player._onPlay()
      player._onPause()

      expect(callbacks.callbackA).not.toHaveBeenCalled()
      expect(callbacks.callbackB).toHaveBeenCalledTimes(1)
    })

    test('does not override events on configure if there are no events', () => {
      const callbacks = {
        callbackA: vi.fn()
      }
      player.configure({
        events: {
          onPause: callbacks.callbackA
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
        callbackA: vi.fn(),
        callbackB: vi.fn()
      }

      player.on(Events.PLAYER_PAUSE, callbacks.callbackB)

      player.configure({
        events: {
          onPause: callbacks.callbackA
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
      onResizeSpy = vi.fn()

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

  describe('queries', () => {
    test('returns empty values when constructed without a parent', () => {
      const player = new Player({ source: '/video.mp4' })

      expect(player.isPlaying()).toBe(false)
      expect(player.ended).toBe(false)
      expect(player.getCurrentTime()).toBe(0)
      expect(player.getPlugin('missing')).toBeUndefined()
    })

    test('gets plugins from core when there is no activeContainer', () => {
      const player = new Player({ source: '/video.mp4' })
      const plugin = { name: 'fake' }
      player.core = { plugins: [plugin] }

      expect(player.isPlaying()).toBe(false)
      expect(player.getPlugin('fake')).toEqual(plugin)
    })

    test('delegates isPlaying to the active container', () => {
      const player = new Player({ source: '/video.mp4' })
      player.core = { activeContainer: { isPlaying: () => true } }

      expect(player.isPlaying()).toBe(true)
    })
  })

  describe('destroy', () => {
    let player
    let callbacks

    beforeEach(() => {
      callbacks = {
        onPlay: vi.fn(),
        onPause: vi.fn(),
        onError: vi.fn()
      }
      player = new Player({
        source: '/video.mp4',
        events: callbacks
      })
      const element = document.createElement('div')
      player.attachTo(element)
    })

    test('should remove event listeners registered via options.events', () => {
      player.destroy()
      player.trigger(Events.PLAYER_PLAY)
      player.trigger(Events.PLAYER_PAUSE)
      player.trigger(Events.PLAYER_ERROR)

      expect(callbacks.onPlay).not.toHaveBeenCalled()
      expect(callbacks.onPause).not.toHaveBeenCalled()
      expect(callbacks.onError).not.toHaveBeenCalled()
    })

    test('should handle destroy when no options.events are present', () => {
      const playerWithoutEvents = new Player({ source: '/video.mp4' })
      const element = document.createElement('div')
      playerWithoutEvents.attachTo(element)

      expect(() => playerWithoutEvents.destroy()).not.toThrow()
    })

    test('should remove listeners added through configure', () => {
      const configureCallback = vi.fn()
      player.configure({
        events: {
          onStop: configureCallback
        }
      })
      player.destroy()
      player.trigger(Events.PLAYER_STOP)

      expect(configureCallback).not.toHaveBeenCalled()
    })
  })

  describe('after destroy', () => {
    let player
    let core
    let container
    let playback

    const throwWhenReached = (target, names) =>
      names.forEach(name =>
        vi.spyOn(target, name).mockImplementation(() => {
          throw new Error(`${name} reached a destroyed instance`)
        })
      )

    beforeEach(() => {
      player = new Player({ source: '/video.mp4' })
      player.attachTo(document.createElement('div'))
      core = player.core
      container = core.activeContainer
      playback = core.activePlayback
    })

    test('returns the player without throwing from every control method', () => {
      throwWhenReached(container, Object.keys(CONTAINER_ARGS))
      throwWhenReached(playback, ['mute', 'unmute'])
      throwWhenReached(core, ['resize', 'load', 'configure'])
      player.destroy()

      expectEveryControlToReturnPlayer(player)
    })

    test('does not reach the destroyed container', () => {
      const spies = Object.keys(CONTAINER_ARGS).map(name =>
        vi.spyOn(container, name).mockImplementation(() => {})
      )

      player.destroy()
      Object.entries(CONTAINER_ARGS).forEach(([name, args]) => player[name](...args))

      spies.forEach(spy => expect(spy).not.toHaveBeenCalled())
    })

    test('consent calls the callback once', () => {
      throwWhenReached(playback, ['consent'])
      player.destroy()

      expectConsentToCallBackOnce(player)
    })

    test('clears the core reference', () => {
      player.destroy()

      expect(player.core).toBeNull()
    })

    test('destroys the core only once when called twice', () => {
      const destroySpy = vi.spyOn(core, 'destroy')

      expect(player.destroy()).toBe(player)
      expect(player.destroy()).toBe(player)

      expect(destroySpy).toHaveBeenCalledTimes(1)
    })

    test('queries return empty values', () => {
      vi.spyOn(container, 'isPlaying').mockReturnValue(true)
      vi.spyOn(container, 'getCurrentTime').mockReturnValue(7)
      vi.spyOn(container, 'getDuration').mockReturnValue(9)
      core.plugins.push({ name: 'any', destroy: () => {} })
      expect(player.getPlugin('any')).toBeDefined()
      player.destroy()

      expect(player.isPlaying()).toBe(false)
      expect(player.getCurrentTime()).toBe(0)
      expect(player.getDuration()).toBe(0)
      expect(player.getPlugin('any')).toBeUndefined()
    })

    test('configure does not register option events', () => {
      const onPlay = vi.fn()
      player.destroy()

      player.configure({ events: { onPlay } })
      player.trigger(Events.PLAYER_PLAY)

      expect(onPlay).not.toHaveBeenCalled()
    })
  })

  describe('before attachTo', () => {
    let player

    beforeEach(() => {
      player = new Player({ source: '/video.mp4' })
    })

    test('returns the player without throwing from every control method', () => {
      expectEveryControlToReturnPlayer(player)
    })

    test('consent calls the callback once', () => {
      expectConsentToCallBackOnce(player)
    })

    test('destroy returns the player without throwing', () => {
      expect(player.destroy()).toBe(player)
    })

    test('configure does not register option events', () => {
      const onPlay = vi.fn()

      player.configure({ events: { onPlay } })
      player.trigger(Events.PLAYER_PLAY)

      expect(onPlay).not.toHaveBeenCalled()
    })
  })

  describe('while attaching', () => {
    test('a handler that destroys the player on ready does not make attachTo throw', () => {
      const player = new Player({ source: '/video.mp4' })
      const createCore = player._coreFactory.create.bind(player._coreFactory)
      vi.spyOn(player._coreFactory, 'create').mockImplementation(() => {
        const core = createCore()
        core.ready = true
        return core
      })
      player.on(Events.PLAYER_READY, () => player.destroy())

      expect(player.attachTo(document.createElement('div'))).toBe(player)

      expect(player.core).toBeNull()
    })
  })

  describe('while attached', () => {
    let player

    beforeEach(() => {
      player = new Player({ source: '/video.mp4' })
      player.attachTo(document.createElement('div'))
    })

    afterEach(() => {
      player.destroy()
    })

    test('delegates control methods to the active container', () => {
      const container = player.core.activeContainer

      Object.entries(CONTAINER_ARGS).forEach(([name, callArgs]) => {
        const spy = vi.spyOn(container, name).mockImplementation(() => {})

        expect(player[name](...callArgs), name).toBe(player)

        expect(spy, name).toHaveBeenCalledTimes(1)
        expect(spy, name).toHaveBeenCalledWith(...callArgs)
      })
    })

    test('delegates core and playback methods', () => {
      const { core } = player
      const playback = core.getCurrentPlayback()
      const callback = vi.fn()
      const muteSpy = vi.spyOn(playback, 'mute').mockImplementation(() => {})
      const unmuteSpy = vi.spyOn(playback, 'unmute').mockImplementation(() => {})
      const consentSpy = vi.spyOn(playback, 'consent').mockImplementation(() => {})
      const resizeSpy = vi.spyOn(core, 'resize').mockImplementation(() => {})
      const loadSpy = vi.spyOn(core, 'load').mockImplementation(() => {})
      const configureSpy = vi.spyOn(core, 'configure').mockImplementation(() => {})
      const size = { width: 640, height: 360 }

      expect(player.mute()).toBe(player)
      expect(player.unmute()).toBe(player)
      player.consent(callback)
      expect(player.resize(size)).toBe(player)
      expect(player.load('/other.mp4', 'video/mp4')).toBe(player)
      expect(player.configure({ autoPlay: true })).toBe(player)

      expect(muteSpy).toHaveBeenCalledTimes(1)
      expect(unmuteSpy).toHaveBeenCalledTimes(1)
      expect(consentSpy).toHaveBeenCalledTimes(1)
      expect(consentSpy).toHaveBeenCalledWith(callback)
      expect(resizeSpy).toHaveBeenCalledTimes(1)
      expect(resizeSpy).toHaveBeenCalledWith(size)
      expect(loadSpy).toHaveBeenCalledTimes(1)
      expect(loadSpy).toHaveBeenCalledWith('/other.mp4', 'video/mp4')
      expect(configureSpy).toHaveBeenCalledTimes(1)
      expect(configureSpy).toHaveBeenCalledWith({ autoPlay: true })
    })
  })
})
