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

  describe('segmentHistory', () => {
    const seg = (overrides = {}) => trace(EVENT_TYPES.REQUEST_END, {
      kind: 'segment', bytes: 1024, durationMs: 200,
      chunk: { seq: 1, variantId: 0, start: 0, dur: 4 },
      ...overrides
    })

    it('starts empty', () => {
      expect(sampler.collect().segmentHistory).toEqual([])
    })

    it('records a segment entry on REQUEST_END', () => {
      sampler._onTrace(seg({ chunk: { seq: 3, variantId: 1, start: 8, dur: 4 }, durationMs: 150, bytes: 2048 }))
      const [entry] = sampler.collect().segmentHistory
      expect(entry).toEqual({ seq: 3, variantId: 1, start: 8, dur: 4, loadTimeMs: 150, bytes: 2048, ok: true })
    })

    it('records an error entry on REQUEST_ERROR with chunk', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_ERROR, {
        kind: 'segment', fatal: false,
        chunk: { seq: 5, variantId: 2, start: 16, dur: 4 }
      }))
      const [entry] = sampler.collect().segmentHistory
      expect(entry).toEqual({ seq: 5, variantId: 2, start: 16, dur: 4, loadTimeMs: 0, bytes: 0, ok: false })
    })

    it('ignores REQUEST_END segments without chunk', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'segment', bytes: 0 }))
      expect(sampler.collect().segmentHistory).toEqual([])
    })

    it('ignores REQUEST_END segments with seq=null (init segments)', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, {
        kind: 'segment', bytes: 0,
        chunk: { seq: null, variantId: 0, start: 0, dur: 0 }
      }))
      expect(sampler.collect().segmentHistory).toEqual([])
    })

    it('does not record history for non-segment kinds', () => {
      sampler._onTrace(trace(EVENT_TYPES.REQUEST_END, {
        kind: 'manifest', bytes: 512, chunk: { seq: 1, variantId: 0, start: 0, dur: 4 }
      }))
      expect(sampler.collect().segmentHistory).toEqual([])
    })

    it('caps at SEGMENT_HISTORY_SIZE dropping oldest', () => {
      for (let i = 0; i < 13; i++) {
        sampler._onTrace(seg({ chunk: { seq: i, variantId: 0, start: i * 4, dur: 4 } }))
      }
      const history = sampler.collect().segmentHistory
      expect(history.length).toBe(10)
      expect(history[0].seq).toBe(3)
      expect(history[9].seq).toBe(12)
    })

    it('collect() returns a snapshot copy (mutations do not affect internal state)', () => {
      sampler._onTrace(seg())
      const h = sampler.collect().segmentHistory
      h.push({ seq: 99 })
      expect(sampler.collect().segmentHistory.length).toBe(1)
    })
  })

  describe('networkQuality', () => {
    const emitSegment = (s, throughputEwmaMbps) =>
      s._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'segment', throughputEwmaMbps, throughputMbps: throughputEwmaMbps, durationMs: 100, bytes: 1000 }))

    it('is null before any segment', () => {
      expect(sampler.collect().networkQuality).toBeNull()
    })

    it("is excellent when EWMA > 25", () => {
      emitSegment(sampler, 30)
      expect(sampler.collect().networkQuality).toEqual({ label: 'excellent', score: 4 })
    })

    it("is good when EWMA is between 10 and 25", () => {
      emitSegment(sampler, 15)
      expect(sampler.collect().networkQuality).toEqual({ label: 'good', score: 3 })
    })

    it("is fair when EWMA is between 4 and 10", () => {
      emitSegment(sampler, 6)
      expect(sampler.collect().networkQuality).toEqual({ label: 'fair', score: 2 })
    })

    it("is poor when EWMA is between 1.5 and 4", () => {
      emitSegment(sampler, 2)
      expect(sampler.collect().networkQuality).toEqual({ label: 'poor', score: 1 })
    })

    it("is critical when EWMA < 1.5", () => {
      emitSegment(sampler, 1)
      expect(sampler.collect().networkQuality).toEqual({ label: 'critical', score: 0 })
    })
  })

  describe('networkAdequacy', () => {
    const emitSegment = (s, throughputEwmaMbps) =>
      s._onTrace(trace(EVENT_TYPES.REQUEST_END, { kind: 'segment', throughputEwmaMbps, throughputMbps: throughputEwmaMbps, durationMs: 100, bytes: 1000 }))
    const emitBitrate = (s, bitrateKbps) =>
      s._onTrace(trace(EVENT_TYPES.BITRATE_INIT, { current: { bitrate: bitrateKbps * 1000 } }))

    it('is null before any segment', () => {
      expect(sampler.collect().networkAdequacy).toBeNull()
    })

    it('is null when bitrate has not arrived yet', () => {
      emitSegment(sampler, 10)
      expect(sampler.collect().networkAdequacy).toBeNull()
    })

    it("is excellent when ratio > 3", () => {
      emitBitrate(sampler, 2000)
      emitSegment(sampler, 10)
      expect(sampler.collect().networkAdequacy).toEqual({ label: 'excellent', score: 4 })
    })

    it("is good when ratio is between 2 and 3", () => {
      emitBitrate(sampler, 4000)
      emitSegment(sampler, 10)
      expect(sampler.collect().networkAdequacy).toEqual({ label: 'good', score: 3 })
    })

    it("is fair when ratio is between 1.5 and 2", () => {
      emitBitrate(sampler, 6000)
      emitSegment(sampler, 10)
      expect(sampler.collect().networkAdequacy).toEqual({ label: 'fair', score: 2 })
    })

    it("is poor when ratio is between 1 and 1.5", () => {
      emitBitrate(sampler, 8000)
      emitSegment(sampler, 10)
      expect(sampler.collect().networkAdequacy).toEqual({ label: 'poor', score: 1 })
    })

    it("is critical when ratio < 1", () => {
      emitBitrate(sampler, 15000)
      emitSegment(sampler, 10)
      expect(sampler.collect().networkAdequacy).toEqual({ label: 'critical', score: 0 })
    })

    it('updates when BITRATE_CHANGE fires', () => {
      emitBitrate(sampler, 2000)
      emitSegment(sampler, 10)
      sampler._onTrace(trace(EVENT_TYPES.BITRATE_CHANGE, { current: { bitrate: 15000 * 1000 } }))
      expect(sampler.collect().networkAdequacy).toEqual({ label: 'critical', score: 0 })
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
