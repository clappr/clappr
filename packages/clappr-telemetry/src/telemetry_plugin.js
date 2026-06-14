import { ContainerPlugin, Log, Events } from '@clappr/core'
import { NetworkAdapters } from './adapters'
import { SamplerRegistry } from './samplers'
import { ObserverRegistry } from './observers'

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
  static get SamplerRegistry() { return SamplerRegistry }
  static get ObserverRegistry() { return ObserverRegistry }

  static get NetworkAdapters() { return NetworkAdapters }

  constructor(container) {
    super(container)
    this.adapter = null
    this.samplerRegistry = null
    this.observerRegistry = null
    this._configAdapters = []
    this._configSamplers = []
    this._configObservers = []
  }

  get name() {
    return 'telemetry'
  }

  get supportedVersion() {
    return { min: '0.13.1' }
  }

  /**
   * Returns a snapshot of all active samplers at the current moment.
   * Returns an empty object if the registry is not yet initialized.
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
    const cfg = this.container.options?.telemetry
    if (!cfg || cfg.enabled === false) return

    this._configSamplers.forEach(S => SamplerRegistry.unregister(S))
    const samplers = cfg.samplers || []
    samplers.forEach(S => SamplerRegistry.register(S))
    this._configSamplers = samplers

    this._configAdapters.forEach(A => NetworkAdapters.unregister(A))
    const adapters = cfg.adapters || []
    adapters.forEach(A => NetworkAdapters.register(A))
    this._configAdapters = adapters

    // Samplers must be bound before the adapter so events emitted during
    // adapter.bind() (e.g. STREAM_INFO on Shaka's attachFilters) are captured.
    if (this.samplerRegistry) this.samplerRegistry.destroy()
    this.samplerRegistry = new SamplerRegistry(playback, this.container)
    this.samplerRegistry.bind()

    this._configObservers.forEach(O => ObserverRegistry.unregister(O))
    const observers = cfg.observers || []
    observers.forEach(O => ObserverRegistry.register(O))
    this._configObservers = observers

    if (this.observerRegistry) this.observerRegistry.destroy()
    this.observerRegistry = new ObserverRegistry(playback, this.container, this.samplerRegistry)
    this.observerRegistry.bind()

    const AdapterClass = NetworkAdapters.find(playback)
    if (AdapterClass) {
      if (this.adapter) this.adapter.destroy()
      this.adapter = new AdapterClass(playback, this.container)
      this.adapter.bind()
    } else if (adapters.length > 0) {
      Log.warn(`[TelemetryPlugin] No network adapter for playback: ${playback.name || playback.constructor.name || 'unknown'}`)
    }
  }

  destroy() {
    this._configAdapters.forEach(A => NetworkAdapters.unregister(A))
    this._configAdapters = []
    this._configSamplers.forEach(S => SamplerRegistry.unregister(S))
    this._configSamplers = []
    this._configObservers.forEach(O => ObserverRegistry.unregister(O))
    this._configObservers = []
    if (this.adapter) {
      this.adapter.destroy()
      this.adapter = null
    }
    if (this.samplerRegistry) {
      this.samplerRegistry.destroy()
      this.samplerRegistry = null
    }
    if (this.observerRegistry) {
      this.observerRegistry.destroy()
      this.observerRegistry = null
    }
    super.destroy()
  }
}
