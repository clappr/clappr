import { TELEMETRY_CONTRACT_VERSION } from './constants'
import { CONTAINER_TELEMETRY_TRACE } from './telemetry_events'

/**
 * Creates a telemetry envelope with monotonic and wall-clock timestamps.
 *
 * @param {string} type  - Canonical event type (e.g. "media.event")
 * @param {object} data  - Event-specific payload
 * @param {string} source - Name of the plugin that emitted the event
 * @returns {object} Telemetry envelope
 */
export const createEnvelope = (type, data, source) => ({
  type,
  t: performance.now(),
  ts: Date.now(),
  source,
  data,
  v: TELEMETRY_CONTRACT_VERSION
})

/**
 * Emits a telemetry event on the given emitter (container or plugin).
 *
 * Uses the canonical Events.CONTAINER_TELEMETRY_TRACE channel so consumers only need
 * to listen to a single event name.
 *
 * @param {object} emitter - Object with a `trigger` method (container, plugin)
 * @param {string} type    - Canonical event type
 * @param {object} data    - Event-specific payload
 * @param {string} source  - Plugin name that originated the event
 */
export const emitTelemetry = (emitter, type, data, source) => {
  const envelope = createEnvelope(type, data, source)
  try {
    emitter.trigger(CONTAINER_TELEMETRY_TRACE, envelope)
  } catch {
    // Fire and forget - emission errors are ignored
  }
}

/**
 * Calculates network throughput in Mbps.
 *
 * Formula: (bytes × 8 bits/byte) / (duration in seconds) / 1,000,000 bits/Mbps
 *
 * @param {number} bytes - Response data size in bytes
 * @param {number} durationMs - Request duration in milliseconds
 * @returns {number} Throughput in Mbps (0 if duration is invalid)
 */
export const calculateThroughput = (bytes, durationMs) => {
  const MS_PER_SECOND = 1000
  const BITS_PER_BYTE = 8
  const BITS_PER_MEGABIT = 1000000
  // Industry standard: 2 decimal places for bandwidth/throughput metrics (monitoring, analytics)
  const DECIMAL_PLACES = 2

  if (durationMs <= 0) return 0

  const durationSeconds = durationMs / MS_PER_SECOND
  const bits = bytes * BITS_PER_BYTE
  const throughput = bits / durationSeconds / BITS_PER_MEGABIT

  return Math.round(throughput * Math.pow(10, DECIMAL_PLACES)) / Math.pow(10, DECIMAL_PLACES)
}
