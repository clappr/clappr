import ObserverRegistry from './observer_registry'
import { Log } from '@clappr/core'

const makeContainer = (cfg = {}) => ({
  options: { telemetry: { ...cfg } },
  trigger: jest.fn()
})

const makeObserverClass = (name = 'MockObserver', overrides = {}) => {
  const instance = { bind: jest.fn(), destroy: jest.fn(), ...overrides }
  const Cls = jest.fn(() => instance)
  Cls.prototype.bind = instance.bind
  Cls.prototype.destroy = instance.destroy
  Object.defineProperty(Cls, 'name', { get: () => name, configurable: true })
  return { Cls, instance }
}

describe('ObserverRegistry', () => {
  afterEach(() => {
    while (ObserverRegistry.has({ name: 'MockObserver' })) {
      ObserverRegistry.unregister({ name: 'MockObserver' })
    }
  })

  describe('register()', () => {
    it('skips and warns when bind() is missing', () => {
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {})
      const Bad = jest.fn()
      Bad.prototype.destroy = jest.fn()
      Object.defineProperty(Bad, 'name', { get: () => 'Bad', configurable: true })
      expect(ObserverRegistry.register(Bad)).toBe(false)
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('skips and warns when destroy() is missing', () => {
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {})
      const Bad = jest.fn()
      Bad.prototype.bind = jest.fn()
      Object.defineProperty(Bad, 'name', { get: () => 'Bad', configurable: true })
      expect(ObserverRegistry.register(Bad)).toBe(false)
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('skips and warns when the class relies on the auto-assigned name (no static get name())', () => {
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {})
      class NoNameGetter {
        bind() {}
        destroy() {}
      }
      expect(ObserverRegistry.register(NoNameGetter)).toBe(false)
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('registers a valid observer class and returns true', () => {
      const { Cls, instance } = makeObserverClass()
      expect(ObserverRegistry.register(Cls)).toBe(true)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls] }), null)
      registry.bind()
      expect(instance.bind).toHaveBeenCalledTimes(1)
    })

    it('deduplicates — registering the same class twice only instantiates once', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls] }), null)
      registry.bind()
      expect(Cls).toHaveBeenCalledTimes(1)
    })
  })

  describe('unregister()', () => {
    it('removes a previously registered observer', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      ObserverRegistry.unregister(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls] }), null)
      registry.destroy()
      expect(Cls).not.toHaveBeenCalled()
    })
  })

  describe('bind()', () => {
    it('calls bind() on all registered observers listed in cfg.observers', () => {
      const { Cls, instance } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls] }), null)
      registry.bind()
      expect(instance.bind).toHaveBeenCalledTimes(1)
    })
  })

  describe('destroy()', () => {
    it('calls destroy() on all observers', () => {
      const { Cls, instance } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls] }), null)
      registry.destroy()
      expect(instance.destroy).toHaveBeenCalledTimes(1)
    })

    it('is safe to call multiple times', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls] }), null)
      expect(() => { registry.destroy(); registry.destroy() }).not.toThrow()
    })

    it('is safe to call without bind', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls] }), null)
      expect(() => registry.destroy()).not.toThrow()
    })
  })

  describe('isEnabled filtering', () => {
    it('does not instantiate when cfg[name].enabled is false', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls], MockObserver: { enabled: false } }), null)
      expect(Cls).not.toHaveBeenCalled()
      registry.destroy()
    })

    it('instantiates when no enabled flag is set', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls] }), null)
      expect(Cls).toHaveBeenCalledTimes(1)
      registry.destroy()
    })

    it('instantiates when cfg[name].enabled is true', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls], MockObserver: { enabled: true } }), null)
      expect(Cls).toHaveBeenCalledTimes(1)
      registry.destroy()
    })

    it('defers to static isEnabled(cfg) when defined on the class', () => {
      const { Cls } = makeObserverClass()
      Cls.isEnabled = jest.fn(() => false)
      ObserverRegistry.register(Cls)
      new ObserverRegistry({}, makeContainer({ observers: [Cls] }), null) // eslint-disable-line no-new
      expect(Cls.isEnabled).toHaveBeenCalled()
      expect(Cls).not.toHaveBeenCalled()
    })

    it('does not instantiate when isEnabled returns true but cfg[name].enabled is false', () => {
      const { Cls } = makeObserverClass()
      Cls.isEnabled = jest.fn(() => true)
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls], MockObserver: { enabled: false } }), null)
      expect(Cls.isEnabled).toHaveBeenCalled()
      expect(Cls).not.toHaveBeenCalled()
      registry.destroy()
    })
  })

  describe('ref counting', () => {
    it('is reference-counted — class removed only after all registrations are released', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls) // refCount → 1
      ObserverRegistry.register(Cls) // refCount → 2
      ObserverRegistry.unregister(Cls) // refCount → 1 — still registered
      expect(ObserverRegistry.has(Cls)).toBe(true)
      ObserverRegistry.unregister(Cls) // refCount → 0 — removed
      expect(ObserverRegistry.has(Cls)).toBe(false)
    })
  })

  describe('isolation between instances', () => {
    it('only instantiates observers listed in this container own cfg.observers, even if others are globally registered', () => {
      const { Cls: OwnObserver, instance: ownInstance } = makeObserverClass('own')
      const { Cls: OtherObserver, instance: otherInstance } = makeObserverClass('other')
      ObserverRegistry.register(OwnObserver)
      ObserverRegistry.register(OtherObserver) // registered globally, e.g. by another player instance

      const registry = new ObserverRegistry({}, makeContainer({ observers: [OwnObserver] }), null)
      registry.bind()

      expect(ownInstance.bind).toHaveBeenCalledTimes(1)
      expect(otherInstance.bind).not.toHaveBeenCalled()

      registry.destroy()
      ObserverRegistry.unregister(OtherObserver)
    })

    it('does not instantiate an observer present in cfg.observers but never registered', () => {
      const { Cls } = makeObserverClass('unregistered')
      const registry = new ObserverRegistry({}, makeContainer({ observers: [Cls] }), null)
      expect(Cls).not.toHaveBeenCalled()
      registry.destroy()
    })
  })

  describe('constructor', () => {
    it('passes samplerRegistry to each observer', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const fakeSamplerRegistry = { snapshot: jest.fn() }
      new ObserverRegistry({}, makeContainer({ observers: [Cls] }), fakeSamplerRegistry) // eslint-disable-line no-new
      expect(Cls).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        fakeSamplerRegistry
      )
    })

    it('starts with an empty registry — no observers instantiated by default', () => {
      const registry = new ObserverRegistry({}, makeContainer(), null)
      expect(registry._observers).toHaveLength(0)
    })
  })
})
