export { TELEMETRY_CONTRACT_VERSION, EVENT_TYPES, TELEMETRY_SOURCES, DEFAULT_VIDEO_EVENTS } from './constants'
export {
  createEnvelope,
  emitTelemetry,
  calculateThroughput,
  sanitizeLicenseUri,
  hashUrl,
  getBufferAhead,
  getBufferedRanges,
  parseVideoCodec,
  parseAudioCodec
} from './helpers'

/**
 * Checks whether a registry component class should be instantiated.
 * Both conditions must pass (AND — not exclusive):
 *   1. static isEnabled(cfg) — if defined, must return truthy
 *   2. cfg[Cls.name]?.enabled — must not be explicitly false
 *
 * @param {Function} Cls - Registry class
 * @param {Object} cfg - Telemetry config (container.options.telemetry)
 * @returns {boolean}
 */
export const isComponentEnabled = (Cls, cfg) => {
  if (typeof Cls.isEnabled === 'function' && !Cls.isEnabled(cfg)) return false
  return cfg[Cls.name]?.enabled !== false
}
