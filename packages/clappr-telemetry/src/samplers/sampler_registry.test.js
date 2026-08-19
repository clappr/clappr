import SamplerRegistry from './sampler_registry'
import BufferSampler from './buffer_sampler'
import DecodingSampler from './decoding_sampler'
import { emitTelemetry } from '../utils'
import { EVENT_TYPES } from '../utils/constants'
import { Log } from '@clappr/core'

vi.mock('./buffer_sampler', () => {
  const mock = vi.fn()
  Object.defineProperty(mock, 'name', { get: () => 'buffer', configurable: true })
  mock.prototype.collect = vi.fn()
  mock.prototype.destroy = vi.fn()
  return { __esModule: true, default: mock }
})

vi.mock('./decoding_sampler', () => {
  const mock = vi.fn()
  Object.defineProperty(mock, 'name', { get: () => 'decoding', configurable: true })
  mock.prototype.collect = vi.fn()
  mock.prototype.destroy = vi.fn()
  return { __esModule: true, default: mock }
})

vi.mock('../utils', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    emitTelemetry: vi.fn()
  }
})

const makeContainer = (cfg = {}) => ({
  options: { telemetry: { sampleIntervalMs: 1000, samplers: [BufferSampler, DecodingSampler], ...cfg } },
  trigger: vi.fn()
})

describe('SamplerRegistry', () => {
  let mockBufferInstance
  let mockDecodingInstance

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()

    mockBufferInstance = { collect: vi.fn(() => ({ bufferAhead: 20, currentTime: 10 })), destroy: vi.fn() }
    mockDecodingInstance = { collect: vi.fn(() => ({ decodedFps: 24, droppedFps: 0, dropRatio: 0, totalDecoded: 100, totalDropped: 0, currentTime: 10 })), destroy: vi.fn() }

    BufferSampler.mockImplementation(function () { return mockBufferInstance })
    DecodingSampler.mockImplementation(function () { return mockDecodingInstance })

    SamplerRegistry.register(BufferSampler)
    SamplerRegistry.register(DecodingSampler)
  })

  afterEach(() => {
    SamplerRegistry.unregister(BufferSampler)
    SamplerRegistry.unregister(DecodingSampler)
    vi.useRealTimers()
  })

  describe('bind()', () => {
    it('does not start a timer when sampleIntervalMs is 0', () => {
      const scheduler = new SamplerRegistry({}, makeContainer({ sampleIntervalMs: 0 }))
      scheduler.bind()
      vi.advanceTimersByTime(10000)
      expect(emitTelemetry).not.toHaveBeenCalled()
    })

    it('emits MSE_SAMPLE with grouped data on each tick', () => {
      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      vi.advanceTimersByTime(1000)

      expect(emitTelemetry).toHaveBeenCalledWith(
        expect.any(Object),
        EVENT_TYPES.MSE_SAMPLE,
        { buffer: expect.any(Object), decoding: expect.any(Object) },
        SamplerRegistry.name
      )
    })

    it('fires every 1000ms when configured', () => {
      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      vi.advanceTimersByTime(3000)

      expect(emitTelemetry).toHaveBeenCalledTimes(3)
    })

    it('respects custom sampleIntervalMs', () => {
      const scheduler = new SamplerRegistry({}, makeContainer({ sampleIntervalMs: 500 }))
      scheduler.bind()
      vi.advanceTimersByTime(1000)

      expect(emitTelemetry).toHaveBeenCalledTimes(2)
    })

    it('is idempotent — two bind() calls produce one timer', () => {
      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      scheduler.bind()
      vi.advanceTimersByTime(1000)

      expect(emitTelemetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('_tick()', () => {
    it('continues emitting other samplers when one collect() throws', () => {
      mockBufferInstance.collect.mockImplementation(() => { throw new Error('boom') })

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      vi.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).not.toHaveProperty('buffer')
      expect(data).toHaveProperty('decoding')
    })

    it('omits key when collect() returns null', () => {
      mockDecodingInstance.collect.mockReturnValue(null)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      vi.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).toHaveProperty('buffer')
      expect(data).not.toHaveProperty('decoding')
    })

    it('does not emit when all collect() return null', () => {
      mockBufferInstance.collect.mockReturnValue(null)
      mockDecodingInstance.collect.mockReturnValue(null)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      vi.advanceTimersByTime(1000)

      expect(emitTelemetry).not.toHaveBeenCalled()
    })

    it('does not emit when cfg.samplers is empty', () => {
      const scheduler = new SamplerRegistry({}, makeContainer({ samplers: [] }))
      scheduler.bind()
      vi.advanceTimersByTime(1000)

      expect(emitTelemetry).not.toHaveBeenCalled()
    })
  })

  describe('register()', () => {
    let CustomSampler

    beforeEach(() => {
      CustomSampler = vi.fn()
      Object.defineProperty(CustomSampler, 'name', { get: () => 'custom', configurable: true })
      CustomSampler.prototype.collect = vi.fn()
      CustomSampler.prototype.destroy = vi.fn()
    })

    afterEach(() => {
      SamplerRegistry.unregister(CustomSampler)
    })

    it('skips registration and warns when required methods are missing', () => {
      const warnSpy = vi.spyOn(Log, 'warn').mockImplementation(() => {})
      class NoMethods {}
      expect(SamplerRegistry.register(NoMethods)).toBe(false)
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('warns and returns false when the class relies on the auto-assigned name (no static get name())', () => {
      const warnSpy = vi.spyOn(Log, 'warn').mockImplementation(() => {})
      class NoNameGetter {
        collect() {}
        destroy() {}
      }
      expect(SamplerRegistry.register(NoNameGetter)).toBe(false)
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('returns true and includes a registered external sampler in the tick', () => {
      const customInstance = { collect: vi.fn(() => ({ foo: 'bar' })), destroy: vi.fn() }
      CustomSampler.mockImplementation(function () { return customInstance })

      expect(SamplerRegistry.register(CustomSampler)).toBe(true)

      const scheduler = new SamplerRegistry({}, makeContainer({ samplers: [CustomSampler] }))
      scheduler.bind()
      vi.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).toHaveProperty('custom')
      expect(data.custom).toEqual({ foo: 'bar' })

      scheduler.destroy()
    })

    it('instantiates the exact class from its own cfg.samplers, unaffected by a name collision overwrite elsewhere', () => {
      const NewSampler = vi.fn()
      Object.defineProperty(NewSampler, 'name', { get: () => 'custom', configurable: true })
      NewSampler.prototype.collect = vi.fn()
      NewSampler.prototype.destroy = vi.fn()

      SamplerRegistry.register(CustomSampler) // this container's own class
      SamplerRegistry.register(NewSampler) // registered elsewhere, same name — overwrites the registry map entry

      new SamplerRegistry({}, makeContainer({ samplers: [CustomSampler] })) // eslint-disable-line no-new

      expect(CustomSampler).toHaveBeenCalled()
      expect(NewSampler).not.toHaveBeenCalled()

      SamplerRegistry.unregister(NewSampler)
    })
  })

  describe('unregister()', () => {
    it('removes the sampler so it is no longer instantiated', () => {
      SamplerRegistry.unregister(BufferSampler)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      vi.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).not.toHaveProperty('buffer')
      expect(data).toHaveProperty('decoding')

      SamplerRegistry.register(BufferSampler)
      scheduler.destroy()
    })
  })

  describe('isolation between instances', () => {
    it('only instantiates samplers listed in this container own cfg.samplers, even if others are globally registered', () => {
      const CustomSampler = vi.fn()
      Object.defineProperty(CustomSampler, 'name', { get: () => 'custom', configurable: true })
      CustomSampler.prototype.collect = vi.fn()
      CustomSampler.prototype.destroy = vi.fn()
      SamplerRegistry.register(CustomSampler) // registered globally, e.g. by another player instance

      const scheduler = new SamplerRegistry({}, makeContainer({ samplers: [BufferSampler] }))
      scheduler.bind()
      vi.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).toHaveProperty('buffer')
      expect(data).not.toHaveProperty('decoding')
      expect(data).not.toHaveProperty('custom')
      expect(CustomSampler).not.toHaveBeenCalled()

      scheduler.destroy()
      SamplerRegistry.unregister(CustomSampler)
    })

    it('does not instantiate a sampler present in cfg.samplers but never registered', () => {
      const Unregistered = vi.fn()
      Object.defineProperty(Unregistered, 'name', { get: () => 'unregistered', configurable: true })
      Unregistered.prototype.collect = vi.fn()
      Unregistered.prototype.destroy = vi.fn()

      const scheduler = new SamplerRegistry({}, makeContainer({ samplers: [Unregistered] }))
      expect(Unregistered).not.toHaveBeenCalled()
      scheduler.destroy()
    })
  })

  describe('isEnabled filtering', () => {
    it('does not instantiate a sampler when cfg[name].enabled is false', () => {
      const registry = new SamplerRegistry({}, makeContainer({ buffer: { enabled: false } }))
      expect(BufferSampler).not.toHaveBeenCalled()
      expect(DecodingSampler).toHaveBeenCalledTimes(1)
      registry.destroy()
    })

    it('instantiates all samplers in cfg.samplers when no enabled flag is set', () => {
      const registry = new SamplerRegistry({}, makeContainer())
      expect(BufferSampler).toHaveBeenCalledTimes(1)
      expect(DecodingSampler).toHaveBeenCalledTimes(1)
      registry.destroy()
    })

    it('instantiates when cfg[name].enabled is true', () => {
      const registry = new SamplerRegistry({}, makeContainer({ buffer: { enabled: true } }))
      expect(BufferSampler).toHaveBeenCalledTimes(1)
      registry.destroy()
    })

    it('defers to static isEnabled(cfg) when defined on the class', () => {
      const CustomSampler = vi.fn()
      Object.defineProperty(CustomSampler, 'name', { get: () => 'custom', configurable: true })
      CustomSampler.prototype.collect = vi.fn()
      CustomSampler.prototype.destroy = vi.fn()
      CustomSampler.isEnabled = vi.fn(() => false)

      SamplerRegistry.register(CustomSampler)
      new SamplerRegistry({}, makeContainer({ samplers: [CustomSampler] })) // eslint-disable-line no-new

      expect(CustomSampler.isEnabled).toHaveBeenCalled()
      expect(CustomSampler).not.toHaveBeenCalled()

      SamplerRegistry.unregister(CustomSampler)
    })

    it('does not instantiate when isEnabled returns true but cfg[name].enabled is false', () => {
      const CustomSampler = vi.fn()
      Object.defineProperty(CustomSampler, 'name', { get: () => 'custom', configurable: true })
      CustomSampler.prototype.collect = vi.fn()
      CustomSampler.prototype.destroy = vi.fn()
      CustomSampler.isEnabled = vi.fn(() => true)

      SamplerRegistry.register(CustomSampler)
      const registry = new SamplerRegistry({}, makeContainer({ samplers: [CustomSampler], custom: { enabled: false } }))

      expect(CustomSampler.isEnabled).toHaveBeenCalled()
      expect(CustomSampler).not.toHaveBeenCalled()

      SamplerRegistry.unregister(CustomSampler)
      registry.destroy()
    })
  })

  describe('ref counting', () => {
    it('is reference-counted — class removed only after all registrations are released', () => {
      const CustomSampler = vi.fn()
      Object.defineProperty(CustomSampler, 'name', { get: () => 'counted', configurable: true })
      CustomSampler.prototype.collect = vi.fn()
      CustomSampler.prototype.destroy = vi.fn()

      SamplerRegistry.register(CustomSampler) // refCount → 1
      SamplerRegistry.register(CustomSampler) // refCount → 2
      SamplerRegistry.unregister(CustomSampler) // refCount → 1 — still registered
      expect(SamplerRegistry.has(CustomSampler)).toBe(true)
      SamplerRegistry.unregister(CustomSampler) // refCount → 0 — removed
      expect(SamplerRegistry.has(CustomSampler)).toBe(false)
    })
  })

  describe('snapshot()', () => {
    it('returns collected data keyed by sampler name', () => {
      const scheduler = new SamplerRegistry({}, makeContainer())
      const result = scheduler.snapshot()
      expect(result).toEqual({ buffer: expect.any(Object), decoding: expect.any(Object) })
    })

    it('omits key when collect() returns null', () => {
      mockDecodingInstance.collect.mockReturnValue(null)
      const scheduler = new SamplerRegistry({}, makeContainer())
      const result = scheduler.snapshot()
      expect(result).not.toHaveProperty('decoding')
      expect(result).toHaveProperty('buffer')
    })

    it('returns empty object when all collect() return null', () => {
      mockBufferInstance.collect.mockReturnValue(null)
      mockDecodingInstance.collect.mockReturnValue(null)
      const scheduler = new SamplerRegistry({}, makeContainer())
      expect(scheduler.snapshot()).toEqual({})
    })
  })

  describe('destroy()', () => {
    it('stops the timer', () => {
      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      scheduler.destroy()
      vi.advanceTimersByTime(2000)

      expect(emitTelemetry).not.toHaveBeenCalled()
    })

    it('calls destroy() on each sampler', () => {
      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.destroy()

      expect(mockBufferInstance.destroy).toHaveBeenCalled()
      expect(mockDecodingInstance.destroy).toHaveBeenCalled()
    })

    it('is safe to call without bind', () => {
      const scheduler = new SamplerRegistry({}, makeContainer())
      expect(() => scheduler.destroy()).not.toThrow()
    })

    it('is safe to call multiple times', () => {
      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      expect(() => {
        scheduler.destroy()
        scheduler.destroy()
      }).not.toThrow()
    })
  })
})
