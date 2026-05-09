import StreamInfoSampler from './stream_info_sampler'
import { Events } from '@clappr/core'
import { EVENT_TYPES } from '../utils/constants'

beforeAll(() => {
  Events.register('CONTAINER_TELEMETRY_TRACE')
})

const makeContainer = () => ({
  on: jest.fn(),
  off: jest.fn(),
  options: { telemetry: { streamInfoSample: { enabled: true } } }
})

const trace = (type, data = {}) => ({ type, data })

const streamInfo = (overrides = {}) => ({
  container: 'HLS',
  videoCodec: 'H.264',
  audioCodec: 'AAC',
  levelsCount: 4,
  ...overrides
})

describe('StreamInfoSampler', () => {
  let sampler
  let container

  beforeEach(() => {
    container = makeContainer()
    sampler = new StreamInfoSampler(null, container)
  })

  describe('isEnabled()', () => {
    it('returns true when streamInfoSample.enabled is true', () => {
      expect(StreamInfoSampler.isEnabled({ streamInfoSample: { enabled: true } })).toBe(true)
    })

    it('returns false when streamInfoSample.enabled is false', () => {
      expect(StreamInfoSampler.isEnabled({ streamInfoSample: { enabled: false } })).toBe(false)
    })

    it('returns false when streamInfoSample is absent', () => {
      expect(StreamInfoSampler.isEnabled({})).toBe(false)
    })

    it('returns false when cfg is null', () => {
      expect(StreamInfoSampler.isEnabled(null)).toBe(false)
    })
  })

  describe('constructor', () => {
    it('registers listener on CONTAINER_TELEMETRY_TRACE', () => {
      expect(container.on).toHaveBeenCalledWith(
        Events.Custom.CONTAINER_TELEMETRY_TRACE,
        expect.any(Function)
      )
    })

    it('does not throw when container is null', () => {
      expect(() => new StreamInfoSampler(null, null)).not.toThrow()
    })
  })

  describe('_onTrace(STREAM_INFO)', () => {
    it('stores stream info on STREAM_INFO event', () => {
      sampler._onTrace(trace(EVENT_TYPES.STREAM_INFO, streamInfo()))
      expect(sampler.collect()).toEqual(streamInfo())
    })

    it('overwrites previous info when a new STREAM_INFO event arrives', () => {
      sampler._onTrace(trace(EVENT_TYPES.STREAM_INFO, streamInfo({ container: 'HLS' })))
      sampler._onTrace(trace(EVENT_TYPES.STREAM_INFO, streamInfo({ container: 'DASH' })))
      expect(sampler.collect().container).toBe('DASH')
    })

    it('ignores other event types', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_START))
      sampler._onTrace(trace(EVENT_TYPES.BITRATE_INIT, { current: { bitrate: 5000 } }))
      expect(sampler.collect()).toBeNull()
    })
  })

  describe('collect()', () => {
    it('returns null before any STREAM_INFO event', () => {
      expect(sampler.collect()).toBeNull()
    })

    it('returns a copy — mutations do not affect internal state', () => {
      sampler._onTrace(trace(EVENT_TYPES.STREAM_INFO, streamInfo()))
      const result = sampler.collect()
      result.container = 'MUTATED'
      expect(sampler.collect().container).toBe('HLS')
    })

    it('returns null after destroy', () => {
      sampler._onTrace(trace(EVENT_TYPES.STREAM_INFO, streamInfo()))
      sampler.destroy()
      expect(sampler.collect()).toBeNull()
    })
  })

  describe('destroy()', () => {
    it('unregisters listener on CONTAINER_TELEMETRY_TRACE', () => {
      sampler.destroy()
      expect(container.off).toHaveBeenCalledWith(
        Events.Custom.CONTAINER_TELEMETRY_TRACE,
        expect.any(Function)
      )
    })

    it('ignores events after destroy', () => {
      sampler.destroy()
      sampler._onTrace(trace(EVENT_TYPES.STREAM_INFO, streamInfo()))
      expect(sampler.collect()).toBeNull()
    })

    it('is idempotent', () => {
      expect(() => { sampler.destroy(); sampler.destroy() }).not.toThrow()
    })
  })
})
