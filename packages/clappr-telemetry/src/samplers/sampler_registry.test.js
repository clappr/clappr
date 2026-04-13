import SamplerRegistry from './sampler_registry'
import BufferSampler from './buffer_sampler'
import DecodingSampler from './decoding_sampler'
import { emitTelemetry } from '../utils'
import { EVENT_TYPES } from '../utils/constants'
import { Log } from '@clappr/core'

jest.mock('./buffer_sampler', () => {
  const mock = jest.fn()
  mock.isEnabled = jest.fn(() => true)
  return { __esModule: true, default: mock }
})

jest.mock('./decoding_sampler', () => {
  const mock = jest.fn()
  mock.isEnabled = jest.fn(() => true)
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
    BufferSampler.isEnabled.mockReturnValue(true)
    DecodingSampler.isEnabled.mockReturnValue(true)
  })

  afterEach(() => {
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
  })

  describe('sampler filtering via isEnabled()', () => {
    it('excludes disabled samplers', () => {
      BufferSampler.isEnabled.mockReturnValue(false)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).not.toHaveProperty('buffer')
      expect(data).toHaveProperty('decoding')
    })

    it('does not emit when all samplers are disabled', () => {
      BufferSampler.isEnabled.mockReturnValue(false)
      DecodingSampler.isEnabled.mockReturnValue(false)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      expect(emitTelemetry).not.toHaveBeenCalled()
    })
  })

  describe('register()', () => {
    afterEach(() => {
      SamplerRegistry.unregister('custom')
    })

    it('skips registration and warns when SamplerClass is missing required methods', () => {
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {})
      SamplerRegistry.register('custom', class {})

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).not.toHaveProperty('custom')
      expect(warnSpy).toHaveBeenCalled()

      scheduler.destroy()
    })

    it('includes a registered external sampler in the tick', () => {
      const customInstance = { collect: jest.fn(() => ({ foo: 'bar' })), destroy: jest.fn() }
      const CustomSampler = jest.fn(() => customInstance)
      CustomSampler.isEnabled = jest.fn(() => true)
      CustomSampler.prototype.collect = jest.fn()
      CustomSampler.prototype.destroy = jest.fn()

      SamplerRegistry.register('custom', CustomSampler)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).toHaveProperty('custom')
      expect(data.custom).toEqual({ foo: 'bar' })

      scheduler.destroy()
    })

    it('excludes a registered external sampler when isEnabled returns false', () => {
      const CustomSampler = jest.fn()
      CustomSampler.isEnabled = jest.fn(() => false)
      CustomSampler.prototype.collect = jest.fn()
      CustomSampler.prototype.destroy = jest.fn()

      SamplerRegistry.register('custom', CustomSampler)

      const scheduler = new SamplerRegistry({}, makeContainer())
      scheduler.bind()
      jest.advanceTimersByTime(1000)

      expect(emitTelemetry).toHaveBeenCalled()
      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data).not.toHaveProperty('custom')

      scheduler.destroy()
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
