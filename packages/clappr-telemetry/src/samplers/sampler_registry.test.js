import SamplerRegistry from './sampler_registry'
import BufferSampler from './buffer_sampler'
import DecodingSampler from './decoding_sampler'
import { emitTelemetry } from '../utils'
import { EVENT_TYPES } from '../utils/constants'
import { Log } from '@clappr/core'

jest.mock('./buffer_sampler', () => {
  const mock = jest.fn()
  Object.defineProperty(mock, 'name', { value: 'buffer', configurable: true })
  mock.prototype.collect = jest.fn()
  mock.prototype.destroy = jest.fn()
  return { __esModule: true, default: mock }
})

jest.mock('./decoding_sampler', () => {
  const mock = jest.fn()
  Object.defineProperty(mock, 'name', { value: 'decoding', configurable: true })
  mock.prototype.collect = jest.fn()
  mock.prototype.destroy = jest.fn()
  return { __esModule: true, default: mock }
})

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  emitTelemetry: jest.fn()
}))

const makeContainer = (cfg = {}) => ({
  options: { telemetry: { sampleIntervalMs: 1000, ...cfg } },
  trigger: jest.fn()
})

describe('SamplerRegistry', () => {
  let mockBufferInstance
  let mockDecodingInstance

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()

    mockBufferInstance = { collect: jest.fn(() => ({ bufferAhead: 20, currentTime: 10 })), destroy: jest.fn() }
    mockDecodingInstance = { collect: jest.fn(() => ({ decodedFps: 24, droppedFps: 0, dropRatio: 0, totalDecoded: 100, totalDropped: 0, currentTime: 10 })), destroy: jest.fn() }

    BufferSampler.mockImplementation(() => mockBufferInstance)
    DecodingSampler.mockImplementation(() => mockDecodingInstance)

    SamplerRegistry.register(BufferSampler)
    SamplerRegistry.register(DecodingSampler)
  })

  afterEach(() => {
    SamplerRegistry.unregister(BufferSampler)
    SamplerRegistry.unregister(DecodingSampler)
    jest.useRealTimers()
  })

  describe('bind()', () => {
    it('does not start a timer when sampleIntervalMs is 0', () => {
      const scheduler = new SamplerRegistry({}, makeContainer({ sampleIntervalMs: 0 }))
      scheduler.bind()
      jest.advanceTimersByTime(10000)
      expect(emitTelemetry).not.toHaveBeenCalled()
    })

    it('emits MSE_SAMPLE with grouped data on each tick', () => {
      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

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
      jest.advanceTimersByTime(3000)

      expect(emitTelemetry).toHaveBeenCalledTimes(3)
    })

    it('respects custom sampleIntervalMs', () => {
      const scheduler = new SamplerRegistry({}, makeContainer({ sampleIntervalMs: 500 }))
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      expect(emitTelemetry).toHaveBeenCalledTimes(2)
    })

    it('is idempotent — two bind() calls produce one timer', () => {
      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      expect(emitTelemetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('_tick()', () => {
    it('continues emitting other samplers when one collect() throws', () => {
      mockBufferInstance.collect.mockImplementation(() => { throw new Error('boom') })

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).not.toHaveProperty('buffer')
      expect(data).toHaveProperty('decoding')
    })

    it('omits key when collect() returns null', () => {
      mockDecodingInstance.collect.mockReturnValue(null)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).toHaveProperty('buffer')
      expect(data).not.toHaveProperty('decoding')
    })

    it('does not emit when all collect() return null', () => {
      mockBufferInstance.collect.mockReturnValue(null)
      mockDecodingInstance.collect.mockReturnValue(null)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      expect(emitTelemetry).not.toHaveBeenCalled()
    })

    it('does not emit when no samplers are registered', () => {
      SamplerRegistry.unregister(BufferSampler)
      SamplerRegistry.unregister(DecodingSampler)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      expect(emitTelemetry).not.toHaveBeenCalled()

      SamplerRegistry.register(BufferSampler)
      SamplerRegistry.register(DecodingSampler)
    })
  })

  describe('register()', () => {
    let CustomSampler

    beforeEach(() => {
      CustomSampler = jest.fn()
      Object.defineProperty(CustomSampler, 'name', { value: 'custom', configurable: true })
      CustomSampler.prototype.collect = jest.fn()
      CustomSampler.prototype.destroy = jest.fn()
    })

    afterEach(() => {
      SamplerRegistry.unregister(CustomSampler)
    })

    it('skips registration and warns when required methods are missing', () => {
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {})
      class NoMethods {}
      SamplerRegistry.register(NoMethods)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      expect(warnSpy).toHaveBeenCalled()
      scheduler.destroy()
    })

    it('includes a registered external sampler in the tick', () => {
      const customInstance = { collect: jest.fn(() => ({ foo: 'bar' })), destroy: jest.fn() }
      CustomSampler.mockImplementation(() => customInstance)

      SamplerRegistry.register(CustomSampler)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).toHaveProperty('custom')
      expect(data.custom).toEqual({ foo: 'bar' })

      scheduler.destroy()
    })

    it('overwrites a previously registered sampler with the same name', () => {
      const NewSampler = jest.fn()
      Object.defineProperty(NewSampler, 'name', { value: 'custom', configurable: true })
      NewSampler.prototype.collect = jest.fn()
      NewSampler.prototype.destroy = jest.fn()

      SamplerRegistry.register(CustomSampler)
      SamplerRegistry.register(NewSampler)

      new SamplerRegistry({}, makeContainer()) // eslint-disable-line no-new

      expect(NewSampler).toHaveBeenCalled()
      expect(CustomSampler).not.toHaveBeenCalled()

      SamplerRegistry.unregister(NewSampler)
    })
  })

  describe('unregister()', () => {
    it('removes the sampler so it is no longer instantiated', () => {
      SamplerRegistry.unregister(BufferSampler)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).not.toHaveProperty('buffer')
      expect(data).toHaveProperty('decoding')

      SamplerRegistry.register(BufferSampler)
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

    it('instantiates all samplers when no enabled flag is set', () => {
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
      const CustomSampler = jest.fn()
      Object.defineProperty(CustomSampler, 'name', { value: 'custom', configurable: true })
      CustomSampler.prototype.collect = jest.fn()
      CustomSampler.prototype.destroy = jest.fn()
      CustomSampler.isEnabled = jest.fn(() => false)

      SamplerRegistry.register(CustomSampler)
      new SamplerRegistry({}, makeContainer()) // eslint-disable-line no-new

      expect(CustomSampler.isEnabled).toHaveBeenCalled()
      expect(CustomSampler).not.toHaveBeenCalled()

      SamplerRegistry.unregister(CustomSampler)
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
      jest.advanceTimersByTime(2000)

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
