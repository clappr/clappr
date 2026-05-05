import ObserverRegistry from './observer_registry'
import VideoEventObserver from './video_event_observer'
import { Log } from '@clappr/core'

jest.mock('./video_event_observer', () => {
  const mock = jest.fn()
  mock.isEnabled = jest.fn(() => true)
  return { __esModule: true, default: mock }
})

const makeContainer = (cfg = {}) => ({
  options: { telemetry: { ...cfg } },
  trigger: jest.fn()
})

describe('ObserverRegistry', () => {
  let mockVideoObserverInstance

  beforeEach(() => {
    jest.clearAllMocks()
    mockVideoObserverInstance = { bind: jest.fn(), destroy: jest.fn() }
    VideoEventObserver.mockImplementation(() => mockVideoObserverInstance)
  })

  describe('bind()', () => {
    it('calls bind() on all registered observers', () => {
      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.bind()
      expect(mockVideoObserverInstance.bind).toHaveBeenCalledTimes(1)
    })
  })

  describe('destroy()', () => {
    it('calls destroy() on all observers', () => {
      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.destroy()
      expect(mockVideoObserverInstance.destroy).toHaveBeenCalledTimes(1)
    })

    it('is safe to call multiple times', () => {
      const registry = new ObserverRegistry({}, makeContainer(), null)
      expect(() => {
        registry.destroy()
        registry.destroy()
      }).not.toThrow()
    })

    it('is safe to call without bind', () => {
      const registry = new ObserverRegistry({}, makeContainer(), null)
      expect(() => registry.destroy()).not.toThrow()
    })
  })

  describe('register()', () => {
    afterEach(() => {
      ObserverRegistry.unregister('custom')
    })

    it('skips registration and warns when ObserverClass is missing required methods', () => {
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {})
      ObserverRegistry.register('custom', class {})
      expect(warnSpy).toHaveBeenCalled()
    })

    it('skips registration and warns when static isEnabled() is missing', () => {
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {})
      const CustomObserver = jest.fn()
      CustomObserver.prototype.bind = jest.fn()
      CustomObserver.prototype.destroy = jest.fn()

      ObserverRegistry.register('custom', CustomObserver)
      expect(warnSpy).toHaveBeenCalled()
      expect(warnSpy.mock.calls[0].join(' ')).toContain('static isEnabled()')
    })

    it('includes a registered external observer and calls bind() on it', () => {
      const customInstance = { bind: jest.fn(), destroy: jest.fn() }
      const CustomObserver = jest.fn(() => customInstance)
      CustomObserver.isEnabled = jest.fn(() => true)
      CustomObserver.prototype.bind = jest.fn()
      CustomObserver.prototype.destroy = jest.fn()

      ObserverRegistry.register('custom', CustomObserver)

      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.bind()

      expect(customInstance.bind).toHaveBeenCalledTimes(1)
    })

    it('passes samplerRegistry to each observer constructor', () => {
      const fakeSamplerRegistry = { snapshot: jest.fn() }
      const registry = new ObserverRegistry({}, makeContainer(), fakeSamplerRegistry)
      registry.destroy()
      expect(VideoEventObserver).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        fakeSamplerRegistry
      )
    })
  })

  describe('observer filtering via isEnabled()', () => {
    afterEach(() => {
      ObserverRegistry.unregister('custom')
    })

    it('excludes observers whose isEnabled returns false', () => {
      VideoEventObserver.isEnabled.mockReturnValue(false)

      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.destroy()
      expect(VideoEventObserver).not.toHaveBeenCalled()
      VideoEventObserver.isEnabled.mockReturnValue(true)
    })

    it('includes observers whose isEnabled returns true', () => {
      VideoEventObserver.isEnabled.mockReturnValue(true)

      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.bind()
      expect(VideoEventObserver).toHaveBeenCalled()
    })

    it('excludes a registered external observer when isEnabled returns false', () => {
      const customInstance = { bind: jest.fn(), destroy: jest.fn() }
      const CustomObserver = jest.fn(() => customInstance)
      CustomObserver.isEnabled = jest.fn(() => false)
      CustomObserver.prototype.bind = jest.fn()
      CustomObserver.prototype.destroy = jest.fn()

      ObserverRegistry.register('custom', CustomObserver)

      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.bind()
      expect(CustomObserver).not.toHaveBeenCalled()
    })
  })

  describe('unregister()', () => {
    it('removes a previously registered observer', () => {
      const customInstance = { bind: jest.fn(), destroy: jest.fn() }
      const CustomObserver = jest.fn(() => customInstance)
      CustomObserver.isEnabled = jest.fn(() => true)
      CustomObserver.prototype.bind = jest.fn()
      CustomObserver.prototype.destroy = jest.fn()

      ObserverRegistry.register('custom', CustomObserver)
      ObserverRegistry.unregister('custom')

      const registry = new ObserverRegistry({}, makeContainer(), null)
      registry.destroy()
      expect(CustomObserver).not.toHaveBeenCalled()
    })
  })
})
