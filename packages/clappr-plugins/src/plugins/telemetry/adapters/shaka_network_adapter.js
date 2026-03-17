import { Log } from '@clappr/core'
import { emitTelemetry, calculateThroughput } from '../utils'
import { TelemetryEvents } from '../utils/telemetry_events'
import { TELEMETRY_SOURCE_NETWORK } from '../utils/constants'

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
    return playback?.name === 'dash_shaka_playback'
  }

  constructor(playback, container) {
    this.playback = playback
    this.container = container
    this.shakaPlayer = null
    this.pendingRequests = new Map()

    this.requestFilter = this.requestFilter.bind(this)
    this.responseFilter = this.responseFilter.bind(this)
    this._onShakaReady = this._onShakaReady.bind(this)
    this._onShakaError = this._onShakaError.bind(this)
  }

  bind() {
    const shakaPlayer = this.playback?.shakaPlayerInstance

    if (shakaPlayer && typeof shakaPlayer.getNetworkingEngine === 'function') {
      this.shakaPlayer = shakaPlayer
      this.attachFilters(shakaPlayer)
      return
    }

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

    if (this.playback?.off) {
      this.playback.off('shaka:ready', this._onShakaReady)
    }

    this.shakaPlayer = shakaPlayer
    this.attachFilters(shakaPlayer)
  }

  _onShakaError() {
    this.pendingRequests.clear()
  }

  attachFilters(shakaPlayer) {
    const networkEngine = shakaPlayer.getNetworkingEngine()

    if (!networkEngine) {
      Log.warn('[ShakaNetworkAdapter] Networking engine not available')
      return
    }

    networkEngine.registerRequestFilter(this.requestFilter)
    networkEngine.registerResponseFilter(this.responseFilter)
    shakaPlayer.addEventListener('error', this._onShakaError)
  }

  detachFilters() {
    if (!this.shakaPlayer) {
      return
    }

    const networkEngine = this.shakaPlayer.getNetworkingEngine()
    if (!networkEngine) {
      Log.warn('[ShakaNetworkAdapter] Networking engine not available for detachment')
      return
    }

    networkEngine.unregisterRequestFilter(this.requestFilter)
    networkEngine.unregisterResponseFilter(this.responseFilter)
    this.shakaPlayer.removeEventListener('error', this._onShakaError)
  }

  requestFilter(type, request) {
    const uri = request.uris?.[0] ?? ''
    const startT = performance.now()
    const entry = { startT }

    const queue = this.pendingRequests.get(uri) ?? []
    queue.push(entry)
    this.pendingRequests.set(uri, queue)

    emitTelemetry(this.container, TelemetryEvents.REQUEST_START, {
      kind: shakaKind(type)
    }, TELEMETRY_SOURCE_NETWORK)
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

    emitTelemetry(this.container, TelemetryEvents.REQUEST_END, {
      kind: shakaKind(type),
      durationMs,
      bytes,
      throughputMbps
    }, TELEMETRY_SOURCE_NETWORK)
  }

  destroy() {
    if (this.playback?.off) {
      this.playback.off('shaka:ready', this._onShakaReady)
    }

    this.detachFilters()
    this.pendingRequests.clear()
    this.shakaPlayer = null
  }
}
