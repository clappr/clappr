import ObserverRegistry from './observer_registry'
import { Log } from '@clappr/core'

const makeContainer = (cfg = {}) => ({
  options: { telemetry: { ...cfg } },
  trigger: jest.fn()
})

const makeObserverClass = (overrides = {}) => {
  const instance = { bind: jest.fn(), destroy: jest.fn(), ...overrides }
  const Cls = jest.fn(() => instance)
  Cls.prototype.bind = instance.bind
  Cls.prototype.destroy = instance.destroy
  Object.defineProperty(Cls, 'name', { value: 'MockObserver', configurable: true })
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
      Object.defineProperty(Bad, 'name', { value: 'Bad', configurable: true })
      ObserverRegistry.register(Bad)
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('skips and warns when destroy() is missing', () => {
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {})
      const Bad = jest.fn()
      Bad.prototype.bind = jest.fn()
      Object.defineProperty(Bad, 'name', { value: 'Bad', configurable: true })
      ObserverRegistry.register(Bad)
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('registers a valid observer class', () => {
      const { Cls, instance } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.bind()
      expect(instance.bind).toHaveBeenCalledTimes(1)
    })

    it('deduplicates — registering the same class twice only instantiates once', () => {
      const { Cls, instance } = makeObserverClass()
      ObserverRegistry.register(Cls)
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.bind()
      expect(Cls).toHaveBeenCalledTimes(1)
    })
  })

  describe('unregister()', () => {
    it('removes a previously registered observer', () => {
      const { Cls, instance } = makeObserverClass()
      ObserverRegistry.register(Cls)
      ObserverRegistry.unregister(Cls)
      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.destroy()
      expect(Cls).not.toHaveBeenCalled()
    })
  })

  describe('bind()', () => {
    it('calls bind() on all registered observers', () => {
      const { Cls, instance } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.bind()
      expect(instance.bind).toHaveBeenCalledTimes(1)
    })
  })

  describe('destroy()', () => {
    it('calls destroy() on all observers', () => {
      const { Cls, instance } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.destroy()
      expect(instance.destroy).toHaveBeenCalledTimes(1)
    })

    it('is safe to call multiple times', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer(), null)
      expect(() => { registry.destroy(); registry.destroy() }).not.toThrow()
    })

    it('is safe to call without bind', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer(), null)
      expect(() => registry.destroy()).not.toThrow()
    })
  })

  describe('isEnabled filtering', () => {
    it('does not instantiate when cfg[name].enabled is false', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ MockObserver: { enabled: false } }), null)
      expect(Cls).not.toHaveBeenCalled()
      registry.destroy()
    })

    it('instantiates when no enabled flag is set', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer(), null)
      expect(Cls).toHaveBeenCalledTimes(1)
      registry.destroy()
    })

    it('instantiates when cfg[name].enabled is true', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ MockObserver: { enabled: true } }), null)
      expect(Cls).toHaveBeenCalledTimes(1)
      registry.destroy()
    })

    it('defers to static isEnabled(cfg) when defined on the class', () => {
      const { Cls } = makeObserverClass()
      Cls.isEnabled = jest.fn(() => false)
      ObserverRegistry.register(Cls)
      new ObserverRegistry({}, makeContainer(), null) // eslint-disable-line no-new
      expect(Cls.isEnabled).toHaveBeenCalled()
      expect(Cls).not.toHaveBeenCalled()
    })

    it('does not instantiate when isEnabled returns true but cfg[name].enabled is false', () => {
      const { Cls } = makeObserverClass()
      Cls.isEnabled = jest.fn(() => true)
      ObserverRegistry.register(Cls)
      const registry = new ObserverRegistry({}, makeContainer({ MockObserver: { enabled: false } }), null)
      expect(Cls.isEnabled).toHaveBeenCalled()
      expect(Cls).not.toHaveBeenCalled()
      registry.destroy()
    })
  })

  describe('ref counting', () => {
    it('is reference-counted — class removed only after all registrations are released', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)  // refCount → 1
      ObserverRegistry.register(Cls)  // refCount → 2
      ObserverRegistry.unregister(Cls) // refCount → 1 — still registered
      expect(ObserverRegistry.has(Cls)).toBe(true)
      ObserverRegistry.unregister(Cls) // refCount → 0 — removed
      expect(ObserverRegistry.has(Cls)).toBe(false)
    })
  })

  describe('constructor', () => {
    it('passes samplerRegistry to each observer', () => {
      const { Cls } = makeObserverClass()
      ObserverRegistry.register(Cls)
      const fakeSamplerRegistry = { snapshot: jest.fn() }
      new ObserverRegistry({}, makeContainer(), fakeSamplerRegistry)
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
