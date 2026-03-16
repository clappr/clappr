/**
 * Internal telemetry event type constants.
 *
 * They are used as the `type` field inside telemetry envelopes to distinguish
 * different kinds of telemetry data flowing through the single CONTAINER_TELEMETRY_TRACE channel.
 */

export const TelemetryEvents = {
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
