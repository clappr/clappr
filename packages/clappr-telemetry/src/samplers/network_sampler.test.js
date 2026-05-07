import NetworkSampler from './network_sampler'
import { Events } from '@clappr/core'
import { EVENT_TYPES } from '../utils/constants'

beforeAll(() => {
  Events.register('CONTAINER_TELEMETRY_TRACE')
})

const makeContainer = () => ({
  on: jest.fn(),
  off: jest.fn(),
  options: { telemetry: { networkSample: { enabled: true } } }
})

const trace = (type, data = {}) => ({ type, data })

describe('NetworkSampler', () => {
  let sampler
  let container

  beforeEach(() => {
    container = makeContainer()
    sampler = new NetworkSampler(null, container)
  })

  describe('isEnabled()', () => {
    it('returns true when networkSample.enabled is true', () => {
      expect(NetworkSampler.isEnabled({ networkSample: { enabled: true } })).toBe(true)
    })

    it('returns false when networkSample.enabled is false', () => {
      expect(NetworkSampler.isEnabled({ networkSample: { enabled: false } })).toBe(false)
    })

    it('returns false when networkSample is absent', () => {
      expect(NetworkSampler.isEnabled({})).toBe(false)
    })

    it('returns false when cfg is null', () => {
      expect(NetworkSampler.isEnabled(null)).toBe(false)
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
      expect(() => new NetworkSampler(null, null)).not.toThrow()
    })
  })

  describe('REQUEST_START', () => {
    it('increments activeRequests', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_START))
      expect(sampler.collect().activeRequests).toBe(1)
    })
  })

  describe('REQUEST_END', () => {
    it('decrements activeRequests', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_START))
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'manifest' }))
      expect(sampler.collect().activeRequests).toBe(0)
    })

    it('activeRequests never goes negative', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'manifest' }))
      expect(sampler.collect().activeRequests).toBe(0)
    })

    it('segment: increments segmentsLoaded and accumulates totalBytesKB', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'segment', bytes: 2048 }))
      const result = sampler.collect()
      expect(result.segmentsLoaded).toBe(1)
      expect(result.totalBytesKB).toBe(2)
    })

    it('segment: updates throughputEwmaMbps when present', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'segment', bytes: 0, throughputEwmaMbps: 5.5 }))
      expect(sampler.collect().throughputEwmaMbps).toBe(5.5)
    })

    it('segment: ignores throughputEwmaMbps when null', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'segment', bytes: 0, throughputEwmaMbps: null }))
      expect(sampler.collect().throughputEwmaMbps).toBeNull()
    })

    it('segment: updates lastThroughputMbps when present', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'segment', bytes: 0, throughputMbps: 8.3 }))
      expect(sampler.collect().lastThroughputMbps).toBe(8.3)
    })

    it('segment: ignores lastThroughputMbps when null', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'segment', bytes: 0, throughputMbps: null }))
      expect(sampler.collect().lastThroughputMbps).toBeNull()
    })

    it('segment: accumulates durationMs into avgSegmentLoadTimeMs', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'segment', bytes: 0, durationMs: 200 }))
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'segment', bytes: 0, durationMs: 400 }))
      expect(sampler.collect().avgSegmentLoadTimeMs).toBe(300)
    })

    it('avgSegmentLoadTimeMs is null before the first segment', () => {
      expect(sampler.collect().avgSegmentLoadTimeMs).toBeNull()
    })

    it('license: increments licenseRequests', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'license' }))
      expect(sampler.collect().licenseRequests).toBe(1)
    })

    it('other kinds: no counter changes', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'manifest' }))
      const result = sampler.collect()
      expect(result.segmentsLoaded).toBe(0)
      expect(result.licenseRequests).toBe(0)
    })
  })

  describe('REQUEST_ERROR', () => {
    it('segment: increments segmentErrors', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_START))
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_ERROR, { kind: 'segment' }))
      expect(sampler.collect().segmentErrors).toBe(1)
    })

    it('license: increments licenseErrors', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_ERROR, { kind: 'license' }))
      expect(sampler.collect().licenseErrors).toBe(1)
    })

    it('activeRequests never goes negative on error', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_ERROR, { kind: 'segment' }))
      expect(sampler.collect().activeRequests).toBe(0)
    })

    it('fatal: true increments fatalErrors', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_ERROR, { kind: 'segment', fatal: true }))
      expect(sampler.collect().fatalErrors).toBe(1)
    })

    it('fatal: false does not increment fatalErrors', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_ERROR, { kind: 'segment', fatal: false }))
      expect(sampler.collect().fatalErrors).toBe(0)
    })
  })

  describe('DRM_EXPIRATION_UPDATED', () => {
    it('updates drmExpirationTime', () => {
      sampler._onTrace(trace(EVENT_TYPES.DRM_EXPIRATION_UPDATED, { expirationTime: 1700000000000 }))
      expect(sampler.collect().drmExpirationTime).toBe(1700000000000)
    })

    it('drmExpirationTime is null before any DRM event', () => {
      expect(sampler.collect().drmExpirationTime).toBeNull()
    })
  })

  describe('collect()', () => {
    it('returns null after destroy', () => {
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
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_START))
      expect(sampler.collect()).toBeNull()
    })

    it('is idempotent', () => {
      expect(() => { sampler.destroy(); sampler.destroy() }).not.toThrow()
    })
  })
})
