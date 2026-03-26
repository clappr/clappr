import { Log } from '@clappr/core'
import { emitTelemetry, calculateThroughput } from '../utils'
import { EVENT_TYPES, TELEMETRY_SOURCES } from '../utils/constants'

/**
 * @event SHAKA_READY
 * Emitted when Shaka Player instance is ready
 */
const SHAKA_READY = 'shaka:ready'

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

// Guard against unbounded growth on stalled responses
const MAX_PENDING_REQUESTS = 100
const EVICTION_BATCH_SIZE = 20

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
    this._requestCounter = 0

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
      this.playback.on(SHAKA_READY, this._onShakaReady)
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
      this.playback.off(SHAKA_READY, this._onShakaReady)
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
    if (this.pendingRequests.size >= MAX_PENDING_REQUESTS) {
      Log.warn('[ShakaNetworkAdapter] pendingRequests limit reached, evicting oldest entries')
      this._evictOldest(EVICTION_BATCH_SIZE)
    }

    const requestId = ++this._requestCounter
    request._telemetryId = requestId
    this.pendingRequests.set(requestId, { startT: performance.now() })

    emitTelemetry(this.container, EVENT_TYPES.REQUEST_START, {
      kind: shakaKind(type)
    }, TELEMETRY_SOURCES.NETWORK)
  }

  responseFilter(type, response) {
    const requestId = response.originalRequest?._telemetryId
    const pending = requestId != null ? this.pendingRequests.get(requestId) : undefined

    if (requestId != null) {
      this.pendingRequests.delete(requestId)
    }

    const durationMs = pending ? performance.now() - pending.startT : 0
    const bytes = response.data?.byteLength ?? 0
    const throughputMbps = calculateThroughput(bytes, durationMs)

    emitTelemetry(this.container, EVENT_TYPES.REQUEST_END, {
      kind: shakaKind(type),
      durationMs,
      bytes,
      throughputMbps
    }, TELEMETRY_SOURCES.NETWORK)
  }

  _evictOldest(count) {
    let removed = 0
    for (const key of this.pendingRequests.keys()) {
      if (removed >= count) break
      this.pendingRequests.delete(key)
      removed++
    }
  }

  destroy() {
    if (this.playback?.off) {
      this.playback.off(SHAKA_READY, this._onShakaReady)
    }

    this.detachFilters()
    this.pendingRequests.clear()
    this.shakaPlayer = null
  }
}
