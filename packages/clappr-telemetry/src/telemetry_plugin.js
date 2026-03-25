import { ContainerPlugin, Log, Events } from '@clappr/core'
import { findNetworkAdapter } from './adapters'

/**
 * @event CONTAINER_TELEMETRY_TRACE
 * Emits telemetry data from all sources (network, playback, etc.)
 * Payload: { type, source, data, t, ts, v }
 */
Events.register('CONTAINER_TELEMETRY_TRACE')

/**
 * Main telemetry plugin.
 * Detects playback engine and activates appropriate adapter for metrics collection.
 * Integrates with container's telemetry bus to forward network and playback metrics.
 */
export default class TelemetryPlugin extends ContainerPlugin {
  constructor(container) {
    super(container)
    this.adapter = null
  }

  get name() {
    return 'telemetry'
  }

  get supportedVersion() {
    return { min: '0.13.1' }
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_READY, () => {
      if (this.container?.playback) {
        this.onPlaybackRead(this.container.playback)
      }
    })
  }

  onPlaybackRead(playback) {
    const telemetryConfig = this.container.options?.telemetry || {}
    const networkEnabled = telemetryConfig.network?.enabled === true

    if (!networkEnabled) {
      return
    }

    const AdapterClass = findNetworkAdapter(playback)

    if (!AdapterClass) {
      Log.warn(`[TelemetryPlugin] No network adapter for playback: ${playback.name || playback.constructor.name || 'unknown'}`)
      return
    }

    this.adapter = new AdapterClass(playback, this.container)
    this.adapter.bind()
  }

  destroy() {
    if (this.adapter) {
      this.adapter.destroy()
      this.adapter = null
    }
    super.destroy()
  }
}
