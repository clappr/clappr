import { createEnvelope, emitTelemetry, getBufferAhead, getBufferedRanges, hashUrl } from './helpers'
import { TRACE_EVENT, TELEMETRY_CONTRACT_VERSION, TelemetryEventTypes } from './constants'

/**
 * Creates a fake TimeRanges object for testing.
 *
 * @param {Array<[number, number]>} ranges - Array of [start, end] pairs
 * @returns {TimeRanges} Fake TimeRanges
 */
const createFakeTimeRanges = (ranges = []) => ({
  length: ranges.length,
  start: (i) => ranges[i][0],
  end: (i) => ranges[i][1],
})

/**
 * Creates a fake video element for testing.
 *
 * @param {object} overrides - Properties to override
 * @returns {HTMLVideoElement} Fake video element
 */
const createFakeVideoElement = (overrides = {}) => ({
  currentTime: 10,
  readyState: 4,
  networkState: 2,
  paused: false,
  playbackRate: 1,
  buffered: createFakeTimeRanges([[0, 20]]),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  ...overrides,
})

describe('Telemetry Constants', () => {
  it('should define all canonical event types', () => {
    expect(TelemetryEventTypes.MEDIA_EVENT).toBe('media.event')
    expect(TelemetryEventTypes.MEDIA_STATE_SAMPLE).toBe('media.state.sample')
    expect(TelemetryEventTypes.MSE_BUFFER_SAMPLE).toBe('mse.buffer.sample')
    expect(TelemetryEventTypes.NET_REQUEST_START).toBe('net.request.start')
    expect(TelemetryEventTypes.NET_REQUEST_END).toBe('net.request.end')
    expect(TelemetryEventTypes.NET_REQUEST_ERROR).toBe('net.request.error')
    expect(TelemetryEventTypes.CHUNK_PIPELINE_END).toBe('chunk.pipeline.end')
    expect(TelemetryEventTypes.STALL_START).toBe('stall.start')
    expect(TelemetryEventTypes.STALL_END).toBe('stall.end')
    expect(TelemetryEventTypes.STALL_CLASSIFIED).toBe('stall.classified')
    expect(TelemetryEventTypes.TELEMETRY_ERROR).toBe('telemetry.error')
  })

  it('should freeze TelemetryEventTypes to prevent mutation', () => {
    expect(Object.isFrozen(TelemetryEventTypes)).toBe(true)
  })

  it('should define TRACE_EVENT channel', () => {
    expect(TRACE_EVENT).toBe('telemetry:trace')
  })

  it('should define contract version', () => {
    expect(TELEMETRY_CONTRACT_VERSION).toBe('1.0')
  })
})

describe('createEnvelope', () => {
  it('should create a valid envelope with all required fields', () => {
    const data = { name: 'waiting', currentTime: 5 }
    const envelope = createEnvelope('media.event', data, 'video-state-telemetry')

    expect(envelope).toEqual(expect.objectContaining({
      type: 'media.event',
      source: 'video-state-telemetry',
      data: { name: 'waiting', currentTime: 5 },
      v: '1.0',
    }))
    expect(typeof envelope.t).toBe('number')
    expect(typeof envelope.ts).toBe('number')
    expect(envelope.t).toBeGreaterThan(0)
    expect(envelope.ts).toBeGreaterThan(0)
  })

  it('should produce monotonic timestamp (t) using performance.now', () => {
    const e1 = createEnvelope('test', {}, 'src')
    const e2 = createEnvelope('test', {}, 'src')
    expect(e2.t).toBeGreaterThanOrEqual(e1.t)
  })

  it('should include wall-clock timestamp (ts) close to Date.now()', () => {
    const before = Date.now()
    const envelope = createEnvelope('test', {}, 'src')
    const after = Date.now()
    expect(envelope.ts).toBeGreaterThanOrEqual(before)
    expect(envelope.ts).toBeLessThanOrEqual(after)
  })
})

describe('emitTelemetry', () => {
  it('should trigger TRACE_EVENT on the emitter with correct envelope', () => {
    const emitter = { trigger: jest.fn() }
    const data = { name: 'playing' }

    emitTelemetry(emitter, 'media.event', data, 'my-plugin')

    expect(emitter.trigger).toHaveBeenCalledTimes(1)
    expect(emitter.trigger).toHaveBeenCalledWith(
      TRACE_EVENT,
      expect.objectContaining({
        type: 'media.event',
        source: 'my-plugin',
        data: { name: 'playing' },
        v: '1.0',
      }),
    )
  })

  it('should emit telemetry.error if trigger throws', () => {
    let callCount = 0
    const emitter = {
      trigger: jest.fn((_event, _envelope) => {
        callCount++
        if (callCount === 1) throw new Error('boom')
      }),
    }

    emitTelemetry(emitter, 'media.event', {}, 'my-plugin')

    expect(emitter.trigger).toHaveBeenCalledTimes(2)
    const errorCall = emitter.trigger.mock.calls[1]
    expect(errorCall[0]).toBe(TRACE_EVENT)
    expect(errorCall[1].type).toBe('telemetry.error')
    expect(errorCall[1].data.scope).toBe('my-plugin')
    expect(errorCall[1].data.message).toBe('boom')
  })

  it('should not crash if even the error emission throws', () => {
    const emitter = {
      trigger: jest.fn(() => { throw new Error('fail') }),
    }

    expect(() => emitTelemetry(emitter, 'media.event', {}, 'src')).not.toThrow()
  })
})

describe('getBufferAhead', () => {
  it('should return buffer ahead when currentTime is within a range', () => {
    const videoEl = createFakeVideoElement({
      currentTime: 10,
      buffered: createFakeTimeRanges([[0, 20]]),
    })

    expect(getBufferAhead(videoEl)).toBe(10)
  })

  it('should return 0 when currentTime is outside all ranges', () => {
    const videoEl = createFakeVideoElement({
      currentTime: 25,
      buffered: createFakeTimeRanges([[0, 20]]),
    })

    expect(getBufferAhead(videoEl)).toBe(0)
  })

  it('should handle multiple buffer ranges', () => {
    const videoEl = createFakeVideoElement({
      currentTime: 35,
      buffered: createFakeTimeRanges([[0, 20], [30, 50]]),
    })

    expect(getBufferAhead(videoEl)).toBe(15)
  })

  it('should return 0 when buffered is empty', () => {
    const videoEl = createFakeVideoElement({
      currentTime: 0,
      buffered: createFakeTimeRanges([]),
    })

    expect(getBufferAhead(videoEl)).toBe(0)
  })

  it('should return 0 when video element is null', () => {
    expect(getBufferAhead(null)).toBe(0)
  })

  it('should return 0 when buffered is undefined', () => {
    expect(getBufferAhead({ currentTime: 0 })).toBe(0)
  })

  it('should handle currentTime at exact start of range', () => {
    const videoEl = createFakeVideoElement({
      currentTime: 0,
      buffered: createFakeTimeRanges([[0, 10]]),
    })

    expect(getBufferAhead(videoEl)).toBe(10)
  })

  it('should handle currentTime at exact end of range', () => {
    const videoEl = createFakeVideoElement({
      currentTime: 10,
      buffered: createFakeTimeRanges([[0, 10]]),
    })

    expect(getBufferAhead(videoEl)).toBe(0)
  })
})

describe('getBufferedRanges', () => {
  it('should return compact array of ranges', () => {
    const buffered = createFakeTimeRanges([[0, 10], [20, 30]])
    expect(getBufferedRanges(buffered)).toEqual([[0, 10], [20, 30]])
  })

  it('should return empty array for empty buffered', () => {
    expect(getBufferedRanges(createFakeTimeRanges([]))).toEqual([])
  })

  it('should return empty array for null/undefined', () => {
    expect(getBufferedRanges(null)).toEqual([])
    expect(getBufferedRanges(undefined)).toEqual([])
  })
})

describe('hashUrl', () => {
  it('should return a hex string for a URL', () => {
    const hash = hashUrl('https://example.com/segment.ts')
    expect(typeof hash).toBe('string')
    expect(hash).toMatch(/^[0-9a-f]+$/)
  })

  it('should return consistent hashes for the same URL', () => {
    const h1 = hashUrl('https://example.com/seg1.ts')
    const h2 = hashUrl('https://example.com/seg1.ts')
    expect(h1).toBe(h2)
  })

  it('should return different hashes for different URLs', () => {
    const h1 = hashUrl('https://example.com/seg1.ts')
    const h2 = hashUrl('https://example.com/seg2.ts')
    expect(h1).not.toBe(h2)
  })

  it('should return "0" for null/undefined/empty', () => {
    expect(hashUrl(null)).toBe('0')
    expect(hashUrl(undefined)).toBe('0')
    expect(hashUrl('')).toBe('0')
  })
})

// Contract test: envelope schema validation
describe('Telemetry Envelope Contract', () => {
  const requiredEnvelopeFields = ['type', 't', 'ts', 'source', 'data', 'v']

  it('should have all required fields in every envelope', () => {
    const envelope = createEnvelope('test.type', { key: 'value' }, 'test-source')
    requiredEnvelopeFields.forEach((field) => {
      expect(envelope).toHaveProperty(field)
    })
  })

  it('should have correct types for each field', () => {
    const envelope = createEnvelope('test.type', { key: 'value' }, 'test-source')
    expect(typeof envelope.type).toBe('string')
    expect(typeof envelope.t).toBe('number')
    expect(typeof envelope.ts).toBe('number')
    expect(typeof envelope.source).toBe('string')
    expect(typeof envelope.data).toBe('object')
    expect(typeof envelope.v).toBe('string')
  })
})
