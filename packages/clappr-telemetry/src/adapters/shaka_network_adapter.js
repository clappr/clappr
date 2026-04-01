import { Log } from '@clappr/core'
import { emitTelemetry, calculateThroughput, sanitizeLicenseUri } from '../utils'
import { EVENT_TYPES, TELEMETRY_SOURCES } from '../utils/constants'

// Shaka Player native event names
const SHAKA_READY = 'shaka:ready'
const SHAKA_ERROR = 'error'
const SHAKA_VARIANT_CHANGED = 'variantchanged'
const SHAKA_DRM_SESSION_UPDATE = 'drmsessionupdate'
const SHAKA_EXPIRATION_UPDATED = 'expirationupdated'

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
    this._isBound = false
    this._lastDrmSessionHash = null

    this.requestFilter = this.requestFilter.bind(this)
    this.responseFilter = this.responseFilter.bind(this)
    this._onShakaReady = this._onShakaReady.bind(this)
    this._onShakaError = this._onShakaError.bind(this)
    this._onVariantChanged = this._onVariantChanged.bind(this)
    this._onDrmSessionUpdate = this._onDrmSessionUpdate.bind(this)
    this._onExpirationUpdated = this._onExpirationUpdated.bind(this)
  }

  bind() {
    if (this._isBound) return

    const shakaPlayer = this.playback?.shakaPlayerInstance

    if (shakaPlayer && typeof shakaPlayer.getNetworkingEngine === 'function') {
      this.shakaPlayer = shakaPlayer
      if (this.attachFilters(shakaPlayer)) {
        this._isBound = true
        return
      }
      // attachFilters failed (networking engine not yet ready); fall through to register listener
    }

    this._isBound = true

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
      return false
    }

    networkEngine.registerRequestFilter(this.requestFilter)
    networkEngine.registerResponseFilter(this.responseFilter)
    shakaPlayer.addEventListener(SHAKA_ERROR, this._onShakaError)
    shakaPlayer.addEventListener(SHAKA_VARIANT_CHANGED, this._onVariantChanged)
    shakaPlayer.addEventListener(SHAKA_DRM_SESSION_UPDATE, this._onDrmSessionUpdate)
    shakaPlayer.addEventListener(SHAKA_EXPIRATION_UPDATED, this._onExpirationUpdated)

    return true
  }

  detachFilters() {
    if (!this.shakaPlayer) {
      return
    }

    this.shakaPlayer.removeEventListener(SHAKA_ERROR, this._onShakaError)
    this.shakaPlayer.removeEventListener(SHAKA_VARIANT_CHANGED, this._onVariantChanged)
    this.shakaPlayer.removeEventListener(SHAKA_DRM_SESSION_UPDATE, this._onDrmSessionUpdate)
    this.shakaPlayer.removeEventListener(SHAKA_EXPIRATION_UPDATED, this._onExpirationUpdated)

    const networkEngine = this.shakaPlayer.getNetworkingEngine()
    if (!networkEngine) {
      Log.warn('[ShakaNetworkAdapter] Networking engine not available for detachment')
      return
    }

    networkEngine.unregisterRequestFilter(this.requestFilter)
    networkEngine.unregisterResponseFilter(this.responseFilter)
  }

  /**
   * Emits REQUEST_START. Telemetry data:
   * @param {string} data.kind - Request type ("manifest"|"segment"|"license"|"app"|"timing"|"cert")
   */
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

  /**
   * Emits REQUEST_END. Telemetry data:
   * @param {string} data.kind - Same values as requestFilter
   * @param {number} data.durationMs - Request round-trip time in ms
   * @param {number} data.bytes - Response size in bytes
   * @param {number} data.throughputMbps - Calculated throughput in Mbps
   */
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

  /**
   * Emits BITRATE_CHANGE. Telemetry data:
   * @param {number|null} data.previous.bitrate - Previous bandwidth in bps
   * @param {number|null} data.previous.width - Previous video width in px
   * @param {number|null} data.previous.height - Previous video height in px
   * @param {number|null} data.current.bitrate - New bandwidth in bps
   * @param {number|null} data.current.width - New video width in px
   * @param {number|null} data.current.height - New video height in px
   */
  _onVariantChanged(event) {
    const oldTrack = event.oldTrack ?? {}
    const newTrack = event.newTrack ?? {}
    emitTelemetry(this.container, EVENT_TYPES.BITRATE_CHANGE, {
      previous: {
        bitrate: oldTrack.bandwidth ?? null,
        width: oldTrack.width ?? null,
        height: oldTrack.height ?? null
      },
      current: {
        bitrate: newTrack.bandwidth ?? null,
        width: newTrack.width ?? null,
        height: newTrack.height ?? null
      }
    }, TELEMETRY_SOURCES.NETWORK)
  }

  /**
   * Emits DRM_SESSION_UPDATE. Telemetry data:
   * @param {string} data.keySystem - DRM key system in use (e.g. "com.widevine.alpha")
   * @param {string|null} data.licenseServerOrigin - License server origin (no path or query params)
   * @param {string[]} data.licenseServerParams - Query param names present in the license URL (no values)
   */
  _onDrmSessionUpdate() {
    const { licenseServerOrigin, licenseServerParams } = sanitizeLicenseUri(
      this.shakaPlayer.drmInfo()?.licenseServerUri
    )
    const data = {
      keySystem: this.shakaPlayer.keySystem(),
      licenseServerOrigin,
      licenseServerParams
    }
    const hash = JSON.stringify(data)
    if (hash === this._lastDrmSessionHash) return
    this._lastDrmSessionHash = hash
    emitTelemetry(this.container, EVENT_TYPES.DRM_SESSION_UPDATE, data, TELEMETRY_SOURCES.NETWORK)
  }

  /**
   * Emits DRM_EXPIRATION_UPDATED. Telemetry data:
   * @param {number} data.expirationTime - Unix timestamp (ms) when the license expires; Infinity if no expiration
   */
  _onExpirationUpdated() {
    emitTelemetry(this.container, EVENT_TYPES.DRM_EXPIRATION_UPDATED, {
      expirationTime: this.shakaPlayer.getExpiration()
    }, TELEMETRY_SOURCES.NETWORK)
  }

  destroy() {
    if (this.playback?.off) {
      this.playback.off(SHAKA_READY, this._onShakaReady)
    }

    this.detachFilters()
    this.pendingRequests.clear()
    this.shakaPlayer = null
    this._isBound = false
    this._lastDrmSessionHash = null
  }
}
