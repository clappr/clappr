/**
 * PUBLIC EVENT CHANNEL
 *
 * Main event exposed on the container's event bus.
 * External consumers (HUD, analytics, logging) listen to this single event
 * to receive all telemetry traces regardless of source or type.
 */
export const CONTAINER_TELEMETRY_TRACE = 'container:telemetry:trace'

/**
 * INTERNAL EVENT TYPES
 *
 * Enumeration of telemetry event types used in the `type` field of telemetry envelopes.
 * These are internal to the telemetry system and flow through CONTAINER_TELEMETRY_TRACE.
 *
 * Example envelope emitted via CONTAINER_TELEMETRY_TRACE:
 * container.trigger(CONTAINER_TELEMETRY_TRACE, {
 *   type: TelemetryEvents.REQUEST_END,    <- internal event type
 *   source: 'network',                     <- origin (network adapter)
 *   data: { kind, durationMs, bytes, ... },
 *   t: 1234.56,                           <- monotonic timestamp (performance.now())
 *   ts: 1709123456789,                    <- wall-clock timestamp (Date.now())
 *   v: '1.0'                              <- envelope contract version
 * })
 *
 * All envelopes are emitted on CONTAINER_TELEMETRY_TRACE channel.
 */

export const TelemetryEvents = {
  /**
   * Network request lifecycle start
   */
  REQUEST_START: 'request:start',

  /**
   * Network request lifecycle end (response received)
   */
  REQUEST_END: 'request:end',

  /**
   * Internal telemetry error
   */
  ERROR: 'error',

  /**
   * Identifies the telemetry bus as the source of an error event
   */
  BUS: 'telemetry_bus'
}
