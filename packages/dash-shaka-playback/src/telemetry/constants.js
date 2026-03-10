/**
 * Telemetry canonical event types.
 *
 * Every telemetry plugin emits events using these canonical strings
 * so that consumers (HUD, analytics) remain player-agnostic.
 */
export const TelemetryEventTypes = Object.freeze({
  // Playback / state
  MEDIA_EVENT: 'media.event',
  MEDIA_STATE_SAMPLE: 'media.state.sample',

  // Buffer
  MSE_BUFFER_SAMPLE: 'mse.buffer.sample',

  // Network
  NET_REQUEST_START: 'net.request.start',
  NET_REQUEST_END: 'net.request.end',
  NET_REQUEST_ERROR: 'net.request.error',

  // ABR
  ABR_VARIANT_CURRENT: 'abr.variant.current',
  ABR_VARIANT_SWITCH: 'abr.variant.switch',

  // MSE Append
  MSE_APPEND_START: 'mse.append.start',
  MSE_APPEND_END: 'mse.append.end',
  MSE_APPEND_ERROR: 'mse.append.error',

  // Pipeline
  CHUNK_PIPELINE_END: 'chunk.pipeline.end',

  // Stall
  STALL_START: 'stall.start',
  STALL_END: 'stall.end',
  STALL_CLASSIFIED: 'stall.classified',

  // Internal errors
  TELEMETRY_ERROR: 'telemetry.error',
})

/**
 * The single bus event name used for all telemetry emissions.
 * Consumers listen to this one event on the container.
 */
export const TRACE_EVENT = 'telemetry:trace'

/**
 * Current version of the telemetry envelope contract.
 */
export const TELEMETRY_CONTRACT_VERSION = '1.0'
