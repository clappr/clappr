import { TELEMETRY_CONTRACT_VERSION } from './constants'
import Events from '../base/events/events'

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
  try {
    const envelope = createEnvelope(type, data, source)
    emitter.trigger(Events.CONTAINER_TELEMETRY_TRACE, envelope)
  } catch (error) {
    try {
      const errorEnvelope = createEnvelope(
        Events.CONTAINER_TELEMETRY_ERROR,
        { scope: source, message: error?.message || 'unknown' },
        Events.CONTAINER_TELEMETRY_BUS
      )
      emitter.trigger(Events.CONTAINER_TELEMETRY_TRACE, errorEnvelope)
    } catch {
      // Silently ignore errors from telemetry error reporting to prevent infinite loops
    }
  }
}

/**
 * Generates a simple hash from a URL for correlation purposes.
 * Uses a fast non-cryptographic hash (djb2).
 *
 * @param {string} url - URL to hash
 * @returns {string} Hex hash string
 */
export const hashUrl = (url) => {
  if (!url) return '0'

  let hash = 5381
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) + hash + url.charCodeAt(i)) >>> 0
  }

  return hash.toString(16)
}
