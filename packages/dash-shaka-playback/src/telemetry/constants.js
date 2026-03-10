
/**
 * Telemetry canonical event types.
 *
 * Every telemetry plugin emits events using these canonical strings
 * so that consumers (HUD, analytics) remain player-agnostic.
 */


/**
 * The single bus event name used for all telemetry emissions.
 * Consumers listen to this one event on the container.
 */
export const TRACE_EVENT = 'telemetry:trace'

/**
 * Current version of the telemetry envelope contract.
 */
export const TELEMETRY_CONTRACT_VERSION = '1.0'

