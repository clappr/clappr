import { Log } from '@clappr/core'
import { emitTelemetry, calculateThroughput, sanitizeLicenseUri, parseVideoCodec, parseAudioCodec } from '../utils'
import { EVENT_TYPES, TELEMETRY_SOURCES } from '../utils/constants'

// Shaka Player native event names
const SHAKA_READY = 'shaka:ready'
const SHAKA_ERROR = 'error'
const SHAKA_TRACKS_CHANGED = 'trackschanged'
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

function variantIndex(tracks, targetId) {
  const sorted = [...tracks].sort((a, b) => a.bandwidth - b.bandwidth)
  return Math.max(sorted.findIndex(t => t.id === targetId), 0)
}

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
    this._isBound = false
    this._lastDrmSessionHash = null
    this._segSeq = 0
    this._currentVariantIdx = 0

    this.requestFilter = this.requestFilter.bind(this)
    this.responseFilter = this.responseFilter.bind(this)
    this._onShakaReady = this._onShakaReady.bind(this)
    this._onShakaError = this._onShakaError.bind(this)
    this._onTracksChanged = this._onTracksChanged.bind(this)
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

  _onTracksChanged() {
    this._emitBitrateInit()
    this._emitStreamInfo()
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
    shakaPlayer.addEventListener(SHAKA_TRACKS_CHANGED, this._onTracksChanged)
    shakaPlayer.addEventListener(SHAKA_VARIANT_CHANGED, this._onVariantChanged)
    shakaPlayer.addEventListener(SHAKA_DRM_SESSION_UPDATE, this._onDrmSessionUpdate)
    shakaPlayer.addEventListener(SHAKA_EXPIRATION_UPDATED, this._onExpirationUpdated)

    this._emitBitrateInit()
    this._emitStreamInfo()
    return true
  }

  _emitBitrateInit() {
    const tracks = this.shakaPlayer.getVariantTracks?.() ?? []
    const activeTrack = tracks.find(t => t.active)
    if (!activeTrack) return
    this._currentVariantIdx = variantIndex(tracks, activeTrack.id)
    emitTelemetry(
      this.container,
      EVENT_TYPES.BITRATE_INIT,
      {
        current: {
          bitrate: activeTrack.bandwidth ?? null,
          width: activeTrack.width ?? null,
          height: activeTrack.height ?? null
        }
      },
      TELEMETRY_SOURCES.NETWORK
    )
  }

  _emitStreamInfo() {
    const tracks = this.shakaPlayer?.getVariantTracks?.() ?? []
    const active = tracks.find(t => t.active)
    if (!active) return
    emitTelemetry(this.container, EVENT_TYPES.STREAM_INFO, {
      container: active.videoMimeType?.split('/')?.[1]?.toUpperCase() ?? 'DASH',
      videoCodec: parseVideoCodec(active.videoCodec ?? null),
      audioCodec: parseAudioCodec(active.audioCodec ?? null),
      levelsCount: tracks.length
    }, TELEMETRY_SOURCES.NETWORK)
  }

  _getEwmaMbps() {
    const bw = this.shakaPlayer?.getStats?.().estimatedBandwidth ?? 0
    return bw > 0 ? bw / 1e6 : null
  }

  detachFilters() {
    if (!this.shakaPlayer) {
      return
    }

    this.shakaPlayer.removeEventListener(SHAKA_ERROR, this._onShakaError)
    this.shakaPlayer.removeEventListener(SHAKA_TRACKS_CHANGED, this._onTracksChanged)
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
    const uri = request.uris?.[0]
    if (uri) {
      this.pendingRequests.set(uri, performance.now())
    }

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
    const uri = response.originalUri ?? response.uri
    const startT = uri ? this.pendingRequests.get(uri) : undefined
    if (uri) this.pendingRequests.delete(uri)

    const durationMs = startT != null ? performance.now() - startT : 0
    const bytes = response.data?.byteLength ?? 0
    const throughputMbps = calculateThroughput(bytes, durationMs)
    const kind = shakaKind(type)

    const chunk = kind === 'segment'
      ? { seq: this._segSeq++, variantId: this._currentVariantIdx, start: 0, dur: 0 }
      : undefined

    emitTelemetry(this.container, EVENT_TYPES.REQUEST_END, {
      kind,
      durationMs,
      bytes,
      throughputMbps,
      throughputEwmaMbps: this._getEwmaMbps(),
      chunk
    }, TELEMETRY_SOURCES.NETWORK)
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
    const tracks = this.shakaPlayer?.getVariantTracks?.() ?? []
    if (tracks.length && newTrack.id != null) {
      this._currentVariantIdx = variantIndex(tracks, newTrack.id)
    }
    this._emitStreamInfo()
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
    this._segSeq = 0
    this._currentVariantIdx = 0
  }
}
