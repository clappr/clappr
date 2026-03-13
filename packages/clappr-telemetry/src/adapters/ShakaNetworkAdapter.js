import { Events, Log } from '@clappr/core'
import { emitTelemetry, hashUrl, calculateThroughput } from '../utils'

// Maps Shaka RequestType integers to human-readable kind strings
const SHAKA_KIND_MAP = {
  0: 'manifest',
  1: 'segment',
  2: 'license',
  3: 'app',
  4: 'timing',
  5: 'cert'
}

const shakaKind = (type) => SHAKA_KIND_MAP[type] ?? 'unknown'

/**
 * Telemetry adapter for Shaka Player.
 * Collects network request/response metrics from Shaka's networking engine.
 *
 * Attaches filters to the Shaka networking engine and emits telemetry events
 * through the container's telemetry bus.
 */
export default class ShakaNetworkAdapter {
  static get name() {
    return 'shaka_network_adapter'
  }

  static isSupported(playback) {
    // Check playback engine name only (shakaPlayerInstance may not be available yet)
    const engineName = playback?.constructor?.name || ''
    return engineName.includes('DashShaka') || engineName.includes('Shaka')
  }

  constructor(playback, container) {
    this.playback = playback
    this.container = container
    this.shakaPlayer = null
    this.pendingRequests = new Map()

    // Bind methods for filter registration/unregistration
    this.requestFilter = this.requestFilter.bind(this)
    this.responseFilter = this.responseFilter.bind(this)
    this._onShakaReady = this._onShakaReady.bind(this)
  }

  bind() {
    // Try synchronous bind first
    const shakaPlayer = this.playback?.shakaPlayerInstance

    if (shakaPlayer && typeof shakaPlayer.getNetworkingEngine === 'function') {
      this.shakaPlayer = shakaPlayer
      this.attachFilters(shakaPlayer)
      return
    }

    // If not available yet, wait for SHAKA_READY event
    if (this.playback?.on) {
      this.playback.on('shaka:ready', this._onShakaReady)
    } else {
      Log.warn('[ShakaNetworkAdapter] Shaka player instance not available and no event handler')
    }
  }

  _onShakaReady() {
    const shakaPlayer = this.playback?.shakaPlayerInstance

    if (!shakaPlayer || typeof shakaPlayer.getNetworkingEngine !== 'function') {
      Log.warn('[ShakaNetworkAdapter] Shaka player instance missing getNetworkingEngine')
      return
    }

    // Detach from event after first successful bind
    if (this.playback?.off) {
      this.playback.off('shaka:ready', this._onShakaReady)
    }

    this.shakaPlayer = shakaPlayer
    this.attachFilters(shakaPlayer)
  }

  attachFilters(shakaPlayer) {
    const networkEngine = shakaPlayer.getNetworkingEngine()

    if (!networkEngine) {
      Log.warn('[ShakaNetworkAdapter] Networking engine not available')
      return
    }

    networkEngine.registerRequestFilter(this.requestFilter)
    networkEngine.registerResponseFilter(this.responseFilter)
  }

  detachFilters() {
    if (!this.shakaPlayer) {
      return
    }

    const networkEngine = this.shakaPlayer.getNetworkingEngine()
    if (!networkEngine) {
      Log.warn('[ShakaNetworkAdapter] Networking engine not available for detachment')
    }

    networkEngine.unregisterRequestFilter(this.requestFilter)
    networkEngine.unregisterResponseFilter(this.responseFilter)
  }

  requestFilter(type, request) {
    const uri = request.uris?.[0] ?? ''
    const id = `${hashUrl(uri)}-${performance.now()}`
    const entry = { id, startT: performance.now() }

    // Track concurrent requests to same URI
    const queue = this.pendingRequests.get(uri) ?? []
    queue.push(entry)
    this.pendingRequests.set(uri, queue)

    // Emit through container's telemetry bus
    emitTelemetry(this.container, Events.CONTAINER_TELEMETRY_REQUEST_START, {
      id,
      kind: shakaKind(type),
      urlHash: hashUrl(uri)
    }, ShakaNetworkAdapter.name)
  }

  responseFilter(type, response) {
    const uri = response.uri ?? ''
    const queue = this.pendingRequests.get(uri) ?? []
    const pending = queue.shift()

    if (queue.length === 0) {
      this.pendingRequests.delete(uri)
    }

    const durationMs = pending ? performance.now() - pending.startT : 0
    const bytes = response.data?.byteLength ?? 0
    const throughputMbps = calculateThroughput(bytes, durationMs)

    // Emit through container's telemetry bus
    emitTelemetry(this.container, Events.CONTAINER_TELEMETRY_REQUEST_END, {
      id: pending?.id ?? hashUrl(uri),
      kind: shakaKind(type),
      urlHash: hashUrl(uri),
      durationMs,
      bytes,
      throughputMbps
    }, ShakaNetworkAdapter.name)
  }

  destroy() {
    // Unregister from SHAKA_READY event if waiting
    if (this.playback?.off) {
      this.playback.off('shaka:ready', this._onShakaReady)
    }

    this.detachFilters()
    this.pendingRequests.clear()
    this.shakaPlayer = null
  }
}
