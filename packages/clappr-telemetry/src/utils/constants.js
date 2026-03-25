
/**
 * Telemetry canonical event types.
 *
 * Every telemetry plugin emits events using these canonical strings
 * so that consumers (HUD, analytics) remain player-agnostic.
 */

/**
 * Current version of the telemetry envelope contract.
 */
export const TELEMETRY_CONTRACT_VERSION = '1.0'

export const TELEMETRY_SOURCES = {
  NETWORK: 'network'
}

export const EVENT_TYPES = {
  /**
   * Emitted when a telemetry network request starts
   *
   * @event REQUEST_START
   */
  REQUEST_START: 'request:start',

  /**
   * Emitted when a telemetry network request finishes
   *
   * @event REQUEST_END
   */
  REQUEST_END: 'request:end',

  /**
   * Emitted when a telemetry internal error occurs
   *
   * @event ERROR
   */
  ERROR: 'error',

  /**
   * Identifies the telemetry bus as the source of an error event
   *
   * @event BUS
   */
  BUS: 'telemetry_bus'
}
