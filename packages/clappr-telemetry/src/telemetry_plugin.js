import { ContainerPlugin, Log, Events } from '@clappr/core'
import { findNetworkAdapter } from './adapters'
import { SamplerRegistry } from './samplers'

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
  /**
   * UMD access point for `SamplerRegistry.register()`.
   * The UMD build exposes only the plugin class as the global, so named exports
   * are not reachable. This static getter bridges that gap for script-tag consumers.
   * ESM consumers should import `SamplerRegistry` directly from the package.
   */
  static get SamplerRegistry() { return SamplerRegistry }

  constructor(container) {
    super(container)
    this.adapter = null
    this.samplerRegistry = null
  }

  get name() {
    return 'telemetry'
  }

  get supportedVersion() {
    return { min: '0.13.1' }
  }

  /**
   * Returns a snapshot of all active samplers at the current moment.
   * Returns an empty object if the scheduler is not yet initialized.
   *
   * @returns {Object} Sampler data keyed by sampler name (e.g. `{ buffer: {...}, decoding: {...} }`)
   */
  get snapshot() {
    return this.samplerRegistry?.snapshot() ?? {}
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

    if (telemetryConfig.network?.enabled === true) {
      const AdapterClass = findNetworkAdapter(playback)

      if (!AdapterClass) {
        Log.warn(`[TelemetryPlugin] No network adapter for playback: ${playback.name || playback.constructor.name || 'unknown'}`)
      } else {
        if (this.adapter) this.adapter.destroy()
        this.adapter = new AdapterClass(playback, this.container)
        this.adapter.bind()
      }
    }

    // The scheduler is always instantiated regardless of which built-in samplers
    // are enabled — external samplers registered via SamplerRegistry.register()
    // must also be able to run without requiring the built-ins to be on.
    if (this.samplerRegistry) this.samplerRegistry.destroy()
    this.samplerRegistry = new SamplerRegistry(playback, this.container)
    this.samplerRegistry.bind()
  }

  destroy() {
    if (this.adapter) {
      this.adapter.destroy()
      this.adapter = null
    }
    if (this.samplerRegistry) {
      this.samplerRegistry.destroy()
      this.samplerRegistry = null
    }
    super.destroy()
  }
}
