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
    ObserverRegistry.unregister({ name: 'MockObserver' })
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
