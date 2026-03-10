import { emitTelemetry, hashUrl, createEnvelope } from './helpers'
import { TRACE_EVENT } from './constants'
import { Events } from '@clappr/core'

describe('Telemetry Constants', () => {
  it('should define all canonical event types', () => {
    expect(Events.CONTAINER_TELEMETRY_REQUEST_START)
      .toBe('container:telemetry:request:start')

    expect(Events.CONTAINER_TELEMETRY_REQUEST_END)
      .toBe('container:telemetry:request:end')
  })

  it('should define TRACE_EVENT channel', () => {
    expect(TRACE_EVENT).toBe('telemetry:trace')
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
        v: '1.0',
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
  it('should trigger TRACE_EVENT with envelope', () => {
    const emitter = { trigger: jest.fn() }

    emitTelemetry(
      emitter,
      Events.CONTAINER_TELEMETRY_REQUEST_START,
      { url: 'video.ts' },
      'test-plugin'
    )

    expect(emitter.trigger).toHaveBeenCalledWith(
      TRACE_EVENT,
      expect.objectContaining({
        type: Events.CONTAINER_TELEMETRY_REQUEST_START,
        source: 'test-plugin',
      })
    )
  })

  it('should emit telemetry.error if trigger throws', () => {
    let count = 0

    const emitter = {
      trigger: jest.fn(() => {
        count++
        if (count === 1) throw new Error('boom')
      }),
    }

    emitTelemetry(
      emitter,
      Events.CONTAINER_TELEMETRY_REQUEST_START,
      {},
      'plugin'
    )

    expect(emitter.trigger).toHaveBeenCalledTimes(2)
  })
})

describe('hashUrl', () => {
  it('should return a hex string', () => {
    const hash = hashUrl('https://example.com/segment.ts')

    expect(typeof hash).toBe('string')
    expect(hash).toMatch(/^[0-9a-f]+$/)
  })

  it('should generate same hash for same url', () => {
    const a = hashUrl('https://example.com/a.ts')
    const b = hashUrl('https://example.com/a.ts')

    expect(a).toBe(b)
  })

  it('should generate different hashes for different urls', () => {
    const a = hashUrl('https://example.com/a.ts')
    const b = hashUrl('https://example.com/b.ts')

    expect(a).not.toBe(b)
  })

  it('should return 0 for empty values', () => {
    expect(hashUrl(null)).toBe('0')
    expect(hashUrl(undefined)).toBe('0')
    expect(hashUrl('')).toBe('0')
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