import './constants'
import { emitTelemetry, createEnvelope, calculateThroughput } from './helpers'
import { Events } from '@clappr/core'
import { TelemetryEvents } from './telemetry_events'

describe('Telemetry Constants', () => {
  it('should define public container trace event', () => {
    expect(Events.CONTAINER_TELEMETRY_TRACE)
      .toBe('container:telemetry:trace')
  })

  it('should define internal telemetry event types', () => {
    expect(TelemetryEvents.REQUEST_START).toBe('request:start')
    expect(TelemetryEvents.REQUEST_END).toBe('request:end')
    expect(TelemetryEvents.ERROR).toBe('error')
    expect(TelemetryEvents.BUS).toBe('telemetry_bus')
  })
})

describe('createEnvelope', () => {
  it('should create a valid envelope with all required fields', () => {
    const data = { name: 'waiting', currentTime: 5 }

    const envelope = createEnvelope(
      'media.event',
      data,
      'video-state-telemetry'
    )

    expect(envelope).toEqual(
      expect.objectContaining({
        type: 'media.event',
        source: 'video-state-telemetry',
        data: { name: 'waiting', currentTime: 5 },
        v: '1.0'
      })
    )

    expect(typeof envelope.t).toBe('number')
    expect(typeof envelope.ts).toBe('number')
  })

  it('should produce monotonic timestamp', () => {
    const e1 = createEnvelope('test', {}, 'src')
    const e2 = createEnvelope('test', {}, 'src')

    expect(e2.t).toBeGreaterThanOrEqual(e1.t)
  })

  it('should include wall clock timestamp', () => {
    const before = Date.now()

    const envelope = createEnvelope('test', {}, 'src')

    const after = Date.now()

    expect(envelope.ts).toBeGreaterThanOrEqual(before)
    expect(envelope.ts).toBeLessThanOrEqual(after)
  })
})

describe('emitTelemetry', () => {
  it('should trigger telemetry trace event with envelope', () => {
    const emitter = { trigger: jest.fn() }

    emitTelemetry(
      emitter,
      TelemetryEvents.REQUEST_START,
      { url: 'video.ts' },
      'test-plugin'
    )

    expect(emitter.trigger).toHaveBeenCalledWith(
      Events.CONTAINER_TELEMETRY_TRACE,
      expect.objectContaining({
        type: TelemetryEvents.REQUEST_START,
        source: 'test-plugin'
      })
    )
  })

  it('should silently ignore errors from trigger', () => {
    const emitter = {
      trigger: jest.fn(() => {
        throw new Error('boom')
      })
    }

    emitTelemetry(
      emitter,
      TelemetryEvents.REQUEST_START,
      {},
      'plugin'
    )

    // Should have been called once despite throwing
    expect(emitter.trigger).toHaveBeenCalledTimes(1)
  })
})

describe('Telemetry Envelope Contract', () => {
  const requiredFields = ['type', 't', 'ts', 'source', 'data', 'v']

  it('should contain all required fields', () => {
    const envelope = createEnvelope('test', {}, 'src')

    requiredFields.forEach((f) => {
      expect(envelope).toHaveProperty(f)
    })
  })
})

describe('calculateThroughput', () => {
  const ONE_MB_IN_BYTES = 1000000
  const TEN_MB_IN_BYTES = 10000000
  const TEN_KB_IN_BYTES = 10000

  const ONE_SECOND_MS = 1000
  const HALF_SECOND_MS = 500
  const TEN_SECONDS_MS = 10000

  it('should calculate throughput in Mbps correctly', () => {
    // 1 MB (1,000,000 bytes) in 1 second (1000 ms) = 8 Mbps
    const throughput = calculateThroughput(ONE_MB_IN_BYTES, ONE_SECOND_MS)

    expect(throughput).toBe(8)
  })

  it('should handle half-second transfer', () => {
    // 1 MB in 500 ms (0.5 seconds) = 16 Mbps
    const throughput = calculateThroughput(ONE_MB_IN_BYTES, HALF_SECOND_MS)

    expect(throughput).toBe(16)
  })

  it('should handle small payloads', () => {
    // 10 KB (10,000 bytes) in 100 ms
    // Formula: (10000 * 8) / (100 / 1000) / 1000000
    // = 80000 / 0.1 / 1000000 = 0.8 Mbps
    const throughput = calculateThroughput(TEN_KB_IN_BYTES, 100)

    expect(throughput).toBeCloseTo(0.8, 5)
  })

  it('should return 0 when duration is 0', () => {
    expect(calculateThroughput(ONE_MB_IN_BYTES, 0)).toBe(0)
  })

  it('should return 0 when duration is negative', () => {
    expect(calculateThroughput(ONE_MB_IN_BYTES, -100)).toBe(0)
  })

  it('should return 0 when bytes is 0', () => {
    expect(calculateThroughput(0, ONE_SECOND_MS)).toBe(0)
  })

  it('should handle very fast transfers (high throughput)', () => {
    // 10 MB in 1 second = 80 Mbps
    const throughput = calculateThroughput(TEN_MB_IN_BYTES, ONE_SECOND_MS)

    expect(throughput).toBe(80)
  })

  it('should handle very slow transfers (low throughput)', () => {
    // 1 MB in 10 seconds = 0.8 Mbps
    const throughput = calculateThroughput(ONE_MB_IN_BYTES, TEN_SECONDS_MS)

    expect(throughput).toBeCloseTo(0.8, 5)
  })

  it('should handle fractional bytes and milliseconds', () => {
    // 5000 bytes in 250 ms
    // Formula: (5000 * 8) / (250 / 1000) / 1000000
    // = 40000 / 0.25 / 1000000 = 0.16 Mbps
    const throughput = calculateThroughput(5000, 250)

    expect(throughput).toBeCloseTo(0.16, 5)
  })
})
