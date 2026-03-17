import { ContainerPlugin, Log, Events } from '@clappr/core'
import { findNetworkAdapter } from './adapters'

/**
 * Main telemetry plugin.
 * Detects playback engine and activates appropriate adapter for metrics collection.
 *
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

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_PLAYBACK, this.onPlaybackRead.bind(this))
    if (this.container.playback) {
      this.onPlaybackRead(this.container.playback)
    }
  }

  onPlaybackRead(playback) {
    const telemetryConfig = this.container.options?.telemetry || {}
    const networkEnabled = telemetryConfig.network?.enabled

    if (!networkEnabled) {
      return
    }

    const AdapterClass = findNetworkAdapter(playback)

    if (!AdapterClass) {
      Log.warn(`[TelemetryPlugin] No network adapter for playback: ${playback.constructor.name}`)
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
