import { Events, Log } from '@clappr/core'
import { TELEMETRY_CONTRACT_VERSION } from './constants'

const MS_PER_SECOND = 1000
const BITS_PER_BYTE = 8
const BITS_PER_MEGABIT = 1e6
const THROUGHPUT_DECIMAL_PLACES = 2

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
 * Uses the canonical CONTAINER_TELEMETRY_TRACE channel so consumers only need
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
    emitter.trigger(Events.Custom.CONTAINER_TELEMETRY_TRACE, envelope)
  } catch (err) {
    Log.warn('[telemetry]', 'emit failed', err)
  }
}

/**
 * Sanitizes a DRM license server URI for telemetry.
 * Strips query param values to avoid leaking credentials or device identifiers.
 *
 * @param {string|null} uri - License server URL
 * @returns {{ licenseServerOrigin: string|null, licenseServerParams: string[] }}
 */
export const sanitizeLicenseUri = (uri) => {
  if (!uri) return { licenseServerOrigin: null, licenseServerParams: [] }
  try {
    const url = new URL(uri)
    return {
      licenseServerOrigin: url.origin,
      licenseServerParams: [...url.searchParams.keys()]
    }
  } catch {
    return { licenseServerOrigin: null, licenseServerParams: [] }
  }
}

/**
 * Hashes a URL string to a compact hex string using FNV-1a (32-bit).
 * Used to avoid sending raw URLs in telemetry payloads.
 *
 * @param {string} url
 * @returns {string} 8-character hex hash
 */
export const hashUrl = url => {
  let h = 0x811c9dc5
  for (let i = 0; i < url.length; i++) {
    h ^= url.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
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
  if (durationMs <= 0) return 0

  const durationSeconds = durationMs / MS_PER_SECOND
  const bits = bytes * BITS_PER_BYTE
  const throughput = bits / durationSeconds / BITS_PER_MEGABIT
  const factor = 10 ** THROUGHPUT_DECIMAL_PLACES

  return Math.round(throughput * factor) / factor
}
