import { Log, Events } from '@clappr/core'
import TelemetryPlugin from './telemetry_plugin'
import { NetworkAdapters } from './adapters'
import MockSamplerRegistryClass from './samplers/sampler_registry'
import MockObserverRegistryClass from './observers/observer_registry'

jest.mock('./adapters', () => ({
  NetworkAdapters: { find: jest.fn(), register: jest.fn(), unregister: jest.fn(), has: jest.fn(() => false), size: 0 }
}))

jest.mock('./samplers/sampler_registry', () => {
  const mock = jest.fn()
  mock.register = jest.fn()
  mock.unregister = jest.fn()
  mock.has = jest.fn(() => false)
  return { __esModule: true, default: mock }
})

jest.mock('./samplers', () => ({
  SamplerRegistry: jest.requireMock('./samplers/sampler_registry').default
}))

jest.mock('./observers/observer_registry', () => {
  const mock = jest.fn()
  mock.register = jest.fn()
  mock.unregister = jest.fn()
  mock.has = jest.fn(() => false)
  return { __esModule: true, default: mock }
})

let mockSamplerRegistry
let mockObserverRegistry

describe('TelemetryPlugin', () => {
  let plugin, mockContainer, mockPlayback

  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    NetworkAdapters.find.mockReturnValue(null)
    NetworkAdapters.size = 0
    mockSamplerRegistry = { bind: jest.fn(), destroy: jest.fn(), snapshot: jest.fn(() => ({})) }
    MockSamplerRegistryClass.mockImplementation(() => mockSamplerRegistry)
    mockObserverRegistry = { bind: jest.fn(), destroy: jest.fn() }
    MockObserverRegistryClass.mockImplementation(() => mockObserverRegistry)

    mockPlayback = { name: 'dash_shaka_playback' }
    mockContainer = {
      on: jest.fn(),
      off: jest.fn(),
      playback: null,
      options: { telemetry: {} }
    }
    plugin = new TelemetryPlugin(mockContainer)
  })

  it('should create TelemetryPlugin class', () => {
    expect(TelemetryPlugin).toBeDefined()
    expect(typeof TelemetryPlugin).toBe('function')
  })

  it('should instantiate with a container', () => {
    expect(plugin).toBeDefined()
    expect(plugin.container).toBe(mockContainer)
  })

  it('should have name property', () => {
    expect(plugin.name).toBe('telemetry')
  })

  it('exposes NetworkAdapters as a static getter', () => {
    expect(TelemetryPlugin.NetworkAdapters).toBe(NetworkAdapters)
  })

  it('should register listener on CONTAINER_READY event during bindEvents', () => {
    jest.spyOn(plugin, 'listenTo')
    plugin.bindEvents()

    expect(plugin.listenTo).toHaveBeenCalledWith(
      mockContainer,
      Events.CONTAINER_READY,
      expect.any(Function)
    )
  })

  it('should call onPlaybackRead with container.playback when CONTAINER_READY fires', () => {
    mockContainer.playback = mockPlayback
    jest.spyOn(plugin, 'onPlaybackRead').mockImplementation(() => {})
    jest.spyOn(plugin, 'listenTo').mockImplementation((_emitter, _event, cb) => cb('container-name'))

    plugin.bindEvents()

    expect(plugin.onPlaybackRead).toHaveBeenCalledWith(mockPlayback)
  })

  it('should not call onPlaybackRead when container.playback is null on CONTAINER_READY', () => {
    mockContainer.playback = null
    jest.spyOn(plugin, 'onPlaybackRead').mockImplementation(() => {})
    jest.spyOn(plugin, 'listenTo').mockImplementation((_emitter, _event, cb) => cb('container-name'))

    plugin.bindEvents()

    expect(plugin.onPlaybackRead).not.toHaveBeenCalled()
  })

  it('should call onPlaybackRead when CONTAINER_READY event fires', () => {
    jest.spyOn(plugin, 'listenTo')
    plugin.bindEvents()

    const [, event, callback] = plugin.listenTo.mock.calls[0]
    expect(event).toBe(Events.CONTAINER_READY)
    expect(callback).toBeDefined()
  })

  it('should instantiate and bind the adapter when playback is available', () => {
    const mockAdapter = { bind: jest.fn() }
    const MockAdapterClass = jest.fn(() => mockAdapter)
    NetworkAdapters.find.mockReturnValue(MockAdapterClass)

    plugin.onPlaybackRead(mockPlayback)

    expect(MockAdapterClass).toHaveBeenCalledWith(mockPlayback, mockContainer)
    expect(mockAdapter.bind).toHaveBeenCalled()
    expect(plugin.adapter).toBe(mockAdapter)
  })

  it('should not instantiate adapter when telemetry config is missing', () => {
    const noConfigContainer = {
      on: jest.fn(),
      off: jest.fn(),
      playback: null,
      options: {}
    }
    const p = new TelemetryPlugin(noConfigContainer)
    p.onPlaybackRead(mockPlayback)
    expect(p.adapter).toBeNull()
  })

  it('should not instantiate adapter when NetworkAdapters.find returns null', () => {
    NetworkAdapters.find.mockReturnValueOnce(null)

    plugin.onPlaybackRead(mockPlayback)

    expect(plugin.adapter).toBeNull()
  })

  it('passes telemetry config to NetworkAdapters.find', () => {
    plugin.onPlaybackRead(mockPlayback)

    expect(NetworkAdapters.find).toHaveBeenCalledWith(mockPlayback, mockContainer.options.telemetry)
  })

  it('should not throw on destroy when adapter is null', () => {
    plugin.adapter = null
    expect(() => plugin.destroy()).not.toThrow()
  })

  it('should clean up adapter on destroy', () => {
    const mockAdapter = { destroy: jest.fn(), bind: jest.fn() }
    plugin.adapter = mockAdapter

    plugin.destroy()

    expect(mockAdapter.destroy).toHaveBeenCalled()
    expect(plugin.adapter).toBeNull()
  })

  it('should call parent destroy method', () => {
    const parentDestroy = jest.spyOn(
      Object.getPrototypeOf(Object.getPrototypeOf(plugin)),
      'destroy'
    )
    plugin.destroy()
    expect(parentDestroy).toHaveBeenCalled()
  })

  it('should destroy previous adapter when onPlaybackRead is called again', () => {
    const oldAdapter = { bind: jest.fn(), destroy: jest.fn() }
    const newAdapter = { bind: jest.fn(), destroy: jest.fn() }
    const OldClass = jest.fn(() => oldAdapter)
    const NewClass = jest.fn(() => newAdapter)

    NetworkAdapters.find.mockReturnValueOnce(OldClass)
    plugin.onPlaybackRead(mockPlayback)
    expect(plugin.adapter).toBe(oldAdapter)

    NetworkAdapters.find.mockReturnValueOnce(NewClass)
    plugin.onPlaybackRead(mockPlayback)

    expect(oldAdapter.destroy).toHaveBeenCalled()
    expect(plugin.adapter).toBe(newAdapter)
  })

  it('should log warning when adapters are provided but none matches the playback engine', () => {
    jest.spyOn(Log, 'warn').mockImplementation(() => {})
    const MockAdapterClass = jest.fn()
    mockContainer.options.telemetry.adapters = [MockAdapterClass]
    NetworkAdapters.find.mockReturnValueOnce(null)

    plugin.onPlaybackRead(mockPlayback)

    expect(Log.warn).toHaveBeenCalledWith(
      '[TelemetryPlugin] No network adapter for playback: dash_shaka_playback'
    )
  })

  it('should not log warning when no adapters are provided', () => {
    jest.spyOn(Log, 'warn').mockImplementation(() => {})
    mockContainer.options.telemetry.adapters = []
    NetworkAdapters.find.mockReturnValueOnce(null)

    plugin.onPlaybackRead(mockPlayback)

    expect(Log.warn).not.toHaveBeenCalled()
  })

  it('registers adapters from telemetry.adapters config', () => {
    const AdapterA = jest.fn()
    const AdapterB = jest.fn()
    mockContainer.options.telemetry.adapters = [AdapterA, AdapterB]

    plugin.onPlaybackRead(mockPlayback)

    expect(NetworkAdapters.register).toHaveBeenCalledWith(AdapterA)
    expect(NetworkAdapters.register).toHaveBeenCalledWith(AdapterB)
  })

  it('does not call NetworkAdapters.register when adapters config is absent', () => {
    delete mockContainer.options.telemetry.adapters

    plugin.onPlaybackRead(mockPlayback)

    expect(NetworkAdapters.register).not.toHaveBeenCalled()
  })

  it.each([
    ['telemetry config is absent', undefined],
    ['enabled is false', { enabled: false }]
  ])('returns early and skips all setup when %s', (_, telemetry) => {
    mockContainer.options.telemetry = telemetry

    plugin.onPlaybackRead(mockPlayback)

    expect(NetworkAdapters.register).not.toHaveBeenCalled()
    expect(NetworkAdapters.find).not.toHaveBeenCalled()
    expect(MockSamplerRegistryClass).not.toHaveBeenCalled()
    expect(plugin.adapter).toBeNull()
    expect(plugin.samplerRegistry).toBeNull()
  })

  describe('snapshot getter', () => {
    it('delegates to samplerRegistry.snapshot()', () => {
      mockSamplerRegistry.snapshot = jest.fn(() => ({ buffer: { bufferAhead: 10 } }))
      plugin.onPlaybackRead(mockPlayback)
      expect(plugin.snapshot).toEqual({ buffer: { bufferAhead: 10 } })
      expect(mockSamplerRegistry.snapshot).toHaveBeenCalled()
    })

    it('returns empty object when samplerRegistry is null', () => {
      plugin.samplerRegistry = null
      expect(plugin.snapshot).toEqual({})
    })
  })

  describe('SamplerRegistry lifecycle', () => {
    it('should instantiate and bind samplerRegistry on onPlaybackRead', () => {
      plugin.onPlaybackRead(mockPlayback)

      expect(MockSamplerRegistryClass).toHaveBeenCalledWith(mockPlayback, mockContainer)
      expect(mockSamplerRegistry.bind).toHaveBeenCalled()
      expect(plugin.samplerRegistry).toBe(mockSamplerRegistry)
    })

    it('should destroy previous samplerRegistry on re-bind', () => {
      plugin.onPlaybackRead(mockPlayback)
      plugin.onPlaybackRead(mockPlayback)

      expect(mockSamplerRegistry.destroy).toHaveBeenCalledTimes(1)
    })

    it('should destroy samplerRegistry on plugin destroy', () => {
      plugin.onPlaybackRead(mockPlayback)
      plugin.destroy()

      expect(mockSamplerRegistry.destroy).toHaveBeenCalled()
      expect(plugin.samplerRegistry).toBeNull()
    })

    it('should not throw on destroy when samplerRegistry is null', () => {
      plugin.samplerRegistry = null
      expect(() => plugin.destroy()).not.toThrow()
    })

    it('should instantiate samplerRegistry even when no adapter matches', () => {
      NetworkAdapters.find.mockReturnValue(null)
      plugin.onPlaybackRead(mockPlayback)

      expect(plugin.samplerRegistry).toBe(mockSamplerRegistry)
      expect(plugin.adapter).toBeNull()
    })

    it('registers samplers from telemetry.samplers config before instantiating SamplerRegistry', () => {
      const SamplerRegistry = MockSamplerRegistryClass
      const registerSpy = jest.spyOn(SamplerRegistry, 'register').mockImplementation(() => {})
      const SamplerA = jest.fn()
      const SamplerB = jest.fn()
      mockContainer.options.telemetry.samplers = [SamplerA, SamplerB]

      plugin.onPlaybackRead(mockPlayback)

      expect(registerSpy).toHaveBeenCalledWith(SamplerA)
      expect(registerSpy).toHaveBeenCalledWith(SamplerB)
    })

    it('does not call SamplerRegistry.register when samplers config is absent', () => {
      const registerSpy = jest.spyOn(MockSamplerRegistryClass, 'register').mockImplementation(() => {})
      delete mockContainer.options.telemetry.samplers

      plugin.onPlaybackRead(mockPlayback)

      expect(registerSpy).not.toHaveBeenCalled()
    })

    it('calls unregister on destroy for samplers that were pre-registered in the global registry', () => {
      const SamplerA = jest.fn()
      MockSamplerRegistryClass.has.mockReturnValue(true)
      mockContainer.options.telemetry.samplers = [SamplerA]

      plugin.onPlaybackRead(mockPlayback)
      plugin.destroy()

      expect(MockSamplerRegistryClass.unregister).toHaveBeenCalledWith(SamplerA)
    })
  })

  describe('ObserverRegistry lifecycle', () => {
    it('should instantiate and bind observerRegistry on onPlaybackRead', () => {
      plugin.onPlaybackRead(mockPlayback)

      expect(MockObserverRegistryClass).toHaveBeenCalledWith(mockPlayback, mockContainer, mockSamplerRegistry)
      expect(mockObserverRegistry.bind).toHaveBeenCalled()
      expect(plugin.observerRegistry).toBe(mockObserverRegistry)
    })

    it('should destroy previous observerRegistry on re-bind', () => {
      plugin.onPlaybackRead(mockPlayback)
      plugin.onPlaybackRead(mockPlayback)

      expect(mockObserverRegistry.destroy).toHaveBeenCalledTimes(1)
    })

    it('should destroy observerRegistry on plugin destroy', () => {
      plugin.onPlaybackRead(mockPlayback)
      plugin.destroy()

      expect(mockObserverRegistry.destroy).toHaveBeenCalled()
      expect(plugin.observerRegistry).toBeNull()
    })

    it('should not throw on destroy when observerRegistry is null', () => {
      plugin.observerRegistry = null
      expect(() => plugin.destroy()).not.toThrow()
    })
  })
})
