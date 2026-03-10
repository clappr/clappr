import { TRACE_EVENT, TELEMETRY_CONTRACT_VERSION } from './constants'

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
  v: TELEMETRY_CONTRACT_VERSION,
})

/**
 * Emits a telemetry event on the given emitter (container or plugin).
 *
 * Uses the canonical TRACE_EVENT channel so consumers only need
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
    emitter.trigger(TRACE_EVENT, envelope)
  } catch (error) {
    // Telemetry must never crash the player
    try {
      const errorEnvelope = createEnvelope(
        'telemetry.error',
        { scope: source, message: error?.message || 'unknown' },
        'telemetry-bus',
      )
      emitter.trigger(TRACE_EVENT, errorEnvelope)
    } catch (_) {
      // Last resort: silently ignore
    }
  }
}

/**
 * Calculates buffer ahead (seconds) based on video.buffered and currentTime.
 *
 * @param {HTMLVideoElement} videoEl - The video element
 * @returns {number} Buffer ahead in seconds (0 if unavailable)
 */
export const getBufferAhead = (videoEl) => {
  if (!videoEl?.buffered?.length) return 0

  const currentTime = videoEl.currentTime
  const buffered = videoEl.buffered

  for (let i = 0; i < buffered.length; i++) {
    if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i)) {
      return buffered.end(i) - currentTime
    }
  }

  return 0
}

/**
 * Returns a compact representation of all buffered ranges.
 *
 * @param {TimeRanges} buffered - The video.buffered TimeRanges
 * @returns {Array<[number, number]>} Array of [start, end] pairs
 */
export const getBufferedRanges = (buffered) => {
  if (!buffered?.length) return []

  const ranges = []
  for (let i = 0; i < buffered.length; i++) {
    ranges.push([buffered.start(i), buffered.end(i)])
  }

  return ranges
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
