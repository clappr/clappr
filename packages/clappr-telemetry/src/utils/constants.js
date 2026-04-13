
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
   * Emitted when the ABR algorithm switches to a different quality variant
   *
   * @event BITRATE_CHANGE
   */
  BITRATE_CHANGE: 'bitrate:change',

  /**
   * Emitted when a network request fails
   *
   * @event REQUEST_ERROR
   */
  REQUEST_ERROR: 'request:error',

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
  BUS: 'telemetry_bus',

  /**
   * Emitted when a DRM session is updated
   *
   * @event DRM_SESSION_UPDATE
   */
  DRM_SESSION_UPDATE: 'drm:session:update',

  /**
   * Emitted when a DRM license expiration time is updated
   *
   * @event DRM_EXPIRATION_UPDATED
   */
  DRM_EXPIRATION_UPDATED: 'drm:expiration:updated',

  /**
   * Emitted once per scheduler tick with a combined snapshot of buffer and decoding state.
   * Payload shape: `{ buffer?: {...}, decoding?: {...} }` — keys are present only
   * when the respective sampler is enabled and has data to report.
   *
   * @event MSE_SAMPLE
   */
  MSE_SAMPLE: 'mse.sample'
}
