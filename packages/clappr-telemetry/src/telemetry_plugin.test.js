import { Log, Events } from '@clappr/core'
import TelemetryPlugin from './telemetry_plugin'
import { NetworkAdapters } from './adapters'
import MockSamplerRegistryClass from './samplers/sampler_registry'
import MockObserverRegistryClass from './observers/observer_registry'

vi.mock('./adapters', () => ({
  NetworkAdapters: { find: vi.fn(), register: vi.fn(() => true), unregister: vi.fn(), has: vi.fn(() => false), size: 0 }
}))

vi.mock('./samplers/sampler_registry', () => {
  const mock = vi.fn()
  mock.register = vi.fn(() => true)
  mock.unregister = vi.fn()
  mock.has = vi.fn(() => false)
  return { __esModule: true, default: mock }
})

vi.mock('./samplers', async () => {
  const { default: SamplerRegistry } = await vi.importMock('./samplers/sampler_registry')
  return { SamplerRegistry }
})

vi.mock('./observers/observer_registry', () => {
  const mock = vi.fn()
  mock.register = vi.fn(() => true)
  mock.unregister = vi.fn()
  mock.has = vi.fn(() => false)
  return { __esModule: true, default: mock }
})

let mockSamplerRegistry
let mockObserverRegistry

describe('TelemetryPlugin', () => {
  let plugin, mockContainer, mockPlayback

  afterEach(() => {
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    NetworkAdapters.find.mockReturnValue(null)
    NetworkAdapters.size = 0
    mockSamplerRegistry = { bind: vi.fn(), destroy: vi.fn(), snapshot: vi.fn(() => ({})) }
    MockSamplerRegistryClass.mockImplementation(function () { return mockSamplerRegistry })
    mockObserverRegistry = { bind: vi.fn(), destroy: vi.fn() }
    MockObserverRegistryClass.mockImplementation(function () { return mockObserverRegistry })

    mockPlayback = { name: 'dash_shaka_playback' }
    mockContainer = {
      on: vi.fn(),
      off: vi.fn(),
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
    vi.spyOn(plugin, 'listenTo')
    plugin.bindEvents()

    expect(plugin.listenTo).toHaveBeenCalledWith(
      mockContainer,
      Events.CONTAINER_READY,
      expect.any(Function)
    )
  })

  it('should call onPlaybackRead with container.playback when CONTAINER_READY fires', () => {
    mockContainer.playback = mockPlayback
    vi.spyOn(plugin, 'onPlaybackRead').mockImplementation(() => {})
    vi.spyOn(plugin, 'listenTo').mockImplementation((_emitter, _event, cb) => cb('container-name'))

    plugin.bindEvents()

    expect(plugin.onPlaybackRead).toHaveBeenCalledWith(mockPlayback)
  })

  it('should not call onPlaybackRead when container.playback is null on CONTAINER_READY', () => {
    mockContainer.playback = null
    vi.spyOn(plugin, 'onPlaybackRead').mockImplementation(() => {})
    vi.spyOn(plugin, 'listenTo').mockImplementation((_emitter, _event, cb) => cb('container-name'))

    plugin.bindEvents()

    expect(plugin.onPlaybackRead).not.toHaveBeenCalled()
  })

  it('should call onPlaybackRead when CONTAINER_READY event fires', () => {
    vi.spyOn(plugin, 'listenTo')
    plugin.bindEvents()

    const [, event, callback] = plugin.listenTo.mock.calls[0]
    expect(event).toBe(Events.CONTAINER_READY)
    expect(callback).toBeDefined()
  })

  it('should instantiate and bind the adapter when playback is available', () => {
    const mockAdapter = { bind: vi.fn() }
    const MockAdapterClass = vi.fn(function () { return mockAdapter })
    NetworkAdapters.find.mockReturnValue(MockAdapterClass)

    plugin.onPlaybackRead(mockPlayback)

    expect(MockAdapterClass).toHaveBeenCalledWith(mockPlayback, mockContainer)
    expect(mockAdapter.bind).toHaveBeenCalled()
    expect(plugin.adapter).toBe(mockAdapter)
  })

  it('should not instantiate adapter when telemetry config is missing', () => {
    const noConfigContainer = {
      on: vi.fn(),
      off: vi.fn(),
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
    const mockAdapter = { destroy: vi.fn(), bind: vi.fn() }
    plugin.adapter = mockAdapter

    plugin.destroy()

    expect(mockAdapter.destroy).toHaveBeenCalled()
    expect(plugin.adapter).toBeNull()
  })

  it('should call parent destroy method', () => {
    const parentDestroy = vi.spyOn(
      Object.getPrototypeOf(Object.getPrototypeOf(plugin)),
      'destroy'
    )
    plugin.destroy()
    expect(parentDestroy).toHaveBeenCalled()
  })

  it('should destroy previous adapter when onPlaybackRead is called again', () => {
    const oldAdapter = { bind: vi.fn(), destroy: vi.fn() }
    const newAdapter = { bind: vi.fn(), destroy: vi.fn() }
    const OldClass = vi.fn(function () { return oldAdapter })
    const NewClass = vi.fn(function () { return newAdapter })

    NetworkAdapters.find.mockReturnValueOnce(OldClass)
    plugin.onPlaybackRead(mockPlayback)
    expect(plugin.adapter).toBe(oldAdapter)

    NetworkAdapters.find.mockReturnValueOnce(NewClass)
    plugin.onPlaybackRead(mockPlayback)

    expect(oldAdapter.destroy).toHaveBeenCalled()
    expect(plugin.adapter).toBe(newAdapter)
  })

  it('should destroy previous adapter when a subsequent onPlaybackRead finds no matching adapter', () => {
    const oldAdapter = { bind: vi.fn(), destroy: vi.fn() }
    const OldClass = vi.fn(function () { return oldAdapter })

    NetworkAdapters.find.mockReturnValueOnce(OldClass)
    plugin.onPlaybackRead(mockPlayback)
    expect(plugin.adapter).toBe(oldAdapter)

    NetworkAdapters.find.mockReturnValueOnce(null)
    plugin.onPlaybackRead(mockPlayback)

    expect(oldAdapter.destroy).toHaveBeenCalled()
    expect(plugin.adapter).toBeNull()
  })

  it('should log warning when adapters are provided but none matches the playback engine', () => {
    vi.spyOn(Log, 'warn').mockImplementation(() => {})
    const MockAdapterClass = vi.fn()
    mockContainer.options.telemetry.adapters = [MockAdapterClass]
    NetworkAdapters.find.mockReturnValueOnce(null)

    plugin.onPlaybackRead(mockPlayback)

    expect(Log.warn).toHaveBeenCalledWith(
      '[TelemetryPlugin] No network adapter for playback: dash_shaka_playback'
    )
  })

  it('should not log warning when no adapters are provided', () => {
    vi.spyOn(Log, 'warn').mockImplementation(() => {})
    mockContainer.options.telemetry.adapters = []
    NetworkAdapters.find.mockReturnValueOnce(null)

    plugin.onPlaybackRead(mockPlayback)

    expect(Log.warn).not.toHaveBeenCalled()
  })

  it('registers adapters from telemetry.adapters config', () => {
    const AdapterA = vi.fn()
    const AdapterB = vi.fn()
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

  it('does not unregister an adapter that failed registration (avoids removing an unrelated class on destroy)', () => {
    const InvalidAdapter = vi.fn()
    NetworkAdapters.register.mockReturnValueOnce(false)
    mockContainer.options.telemetry.adapters = [InvalidAdapter]

    plugin.onPlaybackRead(mockPlayback)
    plugin.destroy()

    expect(NetworkAdapters.unregister).not.toHaveBeenCalledWith(InvalidAdapter)
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
      mockSamplerRegistry.snapshot = vi.fn(() => ({ buffer: { bufferAhead: 10 } }))
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
      const SamplerA = vi.fn()
      const SamplerB = vi.fn()
      mockContainer.options.telemetry.samplers = [SamplerA, SamplerB]

      plugin.onPlaybackRead(mockPlayback)

      expect(MockSamplerRegistryClass.register).toHaveBeenCalledWith(SamplerA)
      expect(MockSamplerRegistryClass.register).toHaveBeenCalledWith(SamplerB)
    })

    it('does not call SamplerRegistry.register when samplers config is absent', () => {
      delete mockContainer.options.telemetry.samplers

      plugin.onPlaybackRead(mockPlayback)

      expect(MockSamplerRegistryClass.register).not.toHaveBeenCalled()
    })

    it('calls unregister on destroy for samplers that were pre-registered in the global registry', () => {
      const SamplerA = vi.fn()
      MockSamplerRegistryClass.has.mockReturnValue(true)
      mockContainer.options.telemetry.samplers = [SamplerA]

      plugin.onPlaybackRead(mockPlayback)
      plugin.destroy()

      expect(MockSamplerRegistryClass.unregister).toHaveBeenCalledWith(SamplerA)
    })

    it('does not unregister a sampler that failed registration (avoids removing an unrelated class sharing its name)', () => {
      const InvalidSampler = vi.fn()
      MockSamplerRegistryClass.register.mockReturnValueOnce(false)
      mockContainer.options.telemetry.samplers = [InvalidSampler]

      plugin.onPlaybackRead(mockPlayback)
      plugin.destroy()

      expect(MockSamplerRegistryClass.unregister).not.toHaveBeenCalledWith(InvalidSampler)
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

    it('does not unregister an observer that failed registration (avoids removing an unrelated class sharing its name)', () => {
      const InvalidObserver = vi.fn()
      MockObserverRegistryClass.register.mockReturnValueOnce(false)
      mockContainer.options.telemetry.observers = [InvalidObserver]

      plugin.onPlaybackRead(mockPlayback)
      plugin.destroy()

      expect(MockObserverRegistryClass.unregister).not.toHaveBeenCalledWith(InvalidObserver)
    })
  })
})
