import { Log, Events } from '@clappr/core'
import { emitTelemetry, calculateThroughput, hashUrl } from '../utils'
import { EVENT_TYPES, TELEMETRY_SOURCES } from '../utils/constants'

// HLS.js event name constants — kept local to avoid bundling hls.js into this package
export const HLS_EVENTS = {
  FRAG_LOADING: 'hlsFragLoading',
  FRAG_LOADED: 'hlsFragLoaded',
  MANIFEST_LOADING: 'hlsManifestLoading',
  MANIFEST_LOADED: 'hlsManifestLoaded',
  KEY_LOADING: 'hlsKeyLoading',
  KEY_LOADED: 'hlsKeyLoaded',
  LEVEL_SWITCHED: 'hlsLevelSwitched',
  ERROR: 'hlsError'
}

const HLS_NETWORK_ERROR_TYPE = 'networkError'

const MAX_PENDING_REQUESTS = 100
const EVICTION_BATCH_SIZE = 20

/**
 * @param {object} frag - HLS.js fragment
 * @returns {'segment'|'init'|'subtitle'}
 */
const fragKind = frag => {
  if (frag.sn === 'initSegment') return 'init'
  if (frag.type === 'subtitle') return 'subtitle'
  return 'segment'
}

/**
 * @param {object} frag - HLS.js fragment
 * @returns {{ stream: string, variantId: number, seq: number|null, start: number, dur: number }}
 */
const fragChunk = frag => ({
  stream: frag.type,
  variantId: frag.level,
  seq: frag.sn !== 'initSegment' ? frag.sn : null,
  start: frag.start,
  dur: frag.duration
})

/**
 * @param {object} frag - HLS.js fragment
 * @returns {string} unique key used to correlate loading/loaded events
 */
const fragKey = frag => `${frag.sn}_${frag.level}_${frag.url}`

/**
 * @param {{ start: number, end: number }|undefined} loadingStats - HLS.js stats.loading
 * @param {{ startT: number }|undefined} pendingEntry - entry stored on REQUEST_START
 * @returns {number} duration in milliseconds
 */
const calcDurationMs = (loadingStats, pendingEntry) => {
  if (loadingStats) return loadingStats.end - loadingStats.start
  if (pendingEntry) return performance.now() - pendingEntry.startT
  return 0
}

/**
 * Telemetry adapter for HLS.js.
 * Collects network request/response metrics from HLS.js fragment and manifest events.
 *
 * Mirrors the ShakaNetworkAdapter contract: same lifecycle (bind/attachFilters/detachFilters/destroy)
 * and same telemetry event types (REQUEST_START, REQUEST_END, REQUEST_ERROR, BITRATE_CHANGE).
 */
export default class HlsNetworkAdapter {
  static get name() {
    return 'hls_network_adapter'
  }

  static isSupported(playback) {
    return playback?.name === 'hls'
  }

  constructor(playback, container) {
    this.playback = playback
    this.container = container
    this.hlsInstance = null
    this.pendingRequests = new Map()
    this._isBound = false
    this._previousLevel = null

    this._onFragLoading = this._onFragLoading.bind(this)
    this._onFragLoaded = this._onFragLoaded.bind(this)
    this._onManifestLoading = this._onManifestLoading.bind(this)
    this._onManifestLoaded = this._onManifestLoaded.bind(this)
    this._onKeyLoading = this._onKeyLoading.bind(this)
    this._onKeyLoaded = this._onKeyLoaded.bind(this)
    this._onLevelSwitched = this._onLevelSwitched.bind(this)
    this._onHlsError = this._onHlsError.bind(this)
    this._onPlay = this._onPlay.bind(this)
  }

  bind() {
    if (this._isBound) return
    this._isBound = true

    const hls = this.playback?._hls

    if (hls) {
      this.attachFilters(hls)
    } else {
      // _hls not ready yet — retry on play (e.g. autoPlay or late initialization)
      if (this.container?.on) {
        this.container.on(Events.CONTAINER_PLAY, this._onPlay)
      } else {
        Log.warn('[HlsNetworkAdapter] HLS.js instance not available and no event handler')
      }
    }
  }

  _onPlay() {
    const hls = this.playback?._hls
    if (!hls) return
    this.container.off(Events.CONTAINER_PLAY, this._onPlay)
    this.attachFilters(hls)
  }

  attachFilters(hls) {
    hls.on(HLS_EVENTS.FRAG_LOADING, this._onFragLoading)
    hls.on(HLS_EVENTS.FRAG_LOADED, this._onFragLoaded)
    hls.on(HLS_EVENTS.MANIFEST_LOADING, this._onManifestLoading)
    hls.on(HLS_EVENTS.MANIFEST_LOADED, this._onManifestLoaded)
    hls.on(HLS_EVENTS.KEY_LOADING, this._onKeyLoading)
    hls.on(HLS_EVENTS.KEY_LOADED, this._onKeyLoaded)
    hls.on(HLS_EVENTS.LEVEL_SWITCHED, this._onLevelSwitched)
    hls.on(HLS_EVENTS.ERROR, this._onHlsError)
    this.hlsInstance = hls
  }

  detachFilters() {
    if (!this.hlsInstance) return

    this.hlsInstance.off(HLS_EVENTS.FRAG_LOADING, this._onFragLoading)
    this.hlsInstance.off(HLS_EVENTS.FRAG_LOADED, this._onFragLoaded)
    this.hlsInstance.off(HLS_EVENTS.MANIFEST_LOADING, this._onManifestLoading)
    this.hlsInstance.off(HLS_EVENTS.MANIFEST_LOADED, this._onManifestLoaded)
    this.hlsInstance.off(HLS_EVENTS.KEY_LOADING, this._onKeyLoading)
    this.hlsInstance.off(HLS_EVENTS.KEY_LOADED, this._onKeyLoaded)
    this.hlsInstance.off(HLS_EVENTS.LEVEL_SWITCHED, this._onLevelSwitched)
    this.hlsInstance.off(HLS_EVENTS.ERROR, this._onHlsError)
    this.hlsInstance = null
  }

  _evictOldest() {
    if (this.pendingRequests.size < MAX_PENDING_REQUESTS) return

    Log.warn('[HlsNetworkAdapter] pendingRequests limit reached, evicting oldest entries')
    let removed = 0
    for (const [key, entry] of this.pendingRequests) {
      if (removed++ >= EVICTION_BATCH_SIZE) break
      const isUrl = entry.kind != null
      emitTelemetry(
        this.container,
        EVENT_TYPES.REQUEST_ERROR,
        { kind: entry.kind ?? 'unknown', urlHash: isUrl ? hashUrl(key) : null, details: 'evicted', fatal: false },
        TELEMETRY_SOURCES.NETWORK
      )
      this.pendingRequests.delete(key)
    }
  }

  /**
   * @emits CONTAINER_TELEMETRY_TRACE
   * @type {EVENT_TYPES.REQUEST_START} source: network
   * @data {{ kind: 'segment'|'init'|'subtitle', urlHash: string, chunk: object }}
   */
  _onFragLoading(_evt, { frag }) {
    if (!frag?.url) return
    this._evictOldest()
    this.pendingRequests.set(fragKey(frag), { startT: performance.now() })

    emitTelemetry(
      this.container,
      EVENT_TYPES.REQUEST_START,
      { kind: fragKind(frag), urlHash: hashUrl(frag.url), chunk: fragChunk(frag) },
      TELEMETRY_SOURCES.NETWORK
    )
  }

  /**
   * @emits CONTAINER_TELEMETRY_TRACE
   * @type {EVENT_TYPES.REQUEST_END} source: network
   * @data {{ kind: 'segment'|'init'|'subtitle', urlHash: string, chunk: object, durationMs: number, bytes: number, throughputMbps: number }}
   */
  _onFragLoaded(_evt, { frag }) {
    if (!frag?.url) return
    const key = fragKey(frag)
    const pending = this.pendingRequests.get(key)
    this.pendingRequests.delete(key)

    const durationMs = calcDurationMs(frag.stats?.loading, pending)

    const bytes = frag.stats?.total ?? 0

    emitTelemetry(
      this.container,
      EVENT_TYPES.REQUEST_END,
      { kind: fragKind(frag), urlHash: hashUrl(frag.url), chunk: fragChunk(frag), durationMs, bytes, throughputMbps: calculateThroughput(bytes, durationMs) },
      TELEMETRY_SOURCES.NETWORK
    )
  }

  /**
   * @emits CONTAINER_TELEMETRY_TRACE
   * @type {EVENT_TYPES.REQUEST_START} source: network
   * @data {{ kind: 'manifest', urlHash: string }}
   */
  _onManifestLoading(_evt, { url }) {
    if (!url) return
    this._evictOldest()
    this.pendingRequests.set(url, { startT: performance.now(), kind: 'manifest' })

    emitTelemetry(
      this.container,
      EVENT_TYPES.REQUEST_START,
      { kind: 'manifest', urlHash: hashUrl(url) },
      TELEMETRY_SOURCES.NETWORK
    )
  }

  /**
   * @emits CONTAINER_TELEMETRY_TRACE
   * @type {EVENT_TYPES.REQUEST_END} source: network
   * @data {{ kind: 'manifest', urlHash: string, durationMs: number, bytes: number, throughputMbps: number }}
   */
  _onManifestLoaded(_evt, { url, stats }) {
    if (!url) return
    const pending = this.pendingRequests.get(url)
    this.pendingRequests.delete(url)

    const durationMs = calcDurationMs(stats?.loading, pending)

    const bytes = stats?.total ?? 0

    emitTelemetry(
      this.container,
      EVENT_TYPES.REQUEST_END,
      { kind: 'manifest', urlHash: hashUrl(url), durationMs, bytes, throughputMbps: calculateThroughput(bytes, durationMs) },
      TELEMETRY_SOURCES.NETWORK
    )
  }

  /**
   * @emits CONTAINER_TELEMETRY_TRACE
   * @type {EVENT_TYPES.REQUEST_START} source: network
   * @data {{ kind: 'key', urlHash: string }}
   */
  _onKeyLoading(_evt, { frag }) {
    const url = frag?.decryptdata?.uri
    if (!url) return

    this._evictOldest()
    this.pendingRequests.set(url, { startT: performance.now(), kind: 'key' })

    emitTelemetry(
      this.container,
      EVENT_TYPES.REQUEST_START,
      { kind: 'key', urlHash: hashUrl(url) },
      TELEMETRY_SOURCES.NETWORK
    )
  }

  /**
   * @emits CONTAINER_TELEMETRY_TRACE
   * @type {EVENT_TYPES.REQUEST_END} source: network
   * @data {{ kind: 'key', urlHash: string, durationMs: number, bytes: 0, throughputMbps: number }}
   */
  _onKeyLoaded(_evt, { frag }) {
    const url = frag?.decryptdata?.uri
    if (!url) return

    const pending = this.pendingRequests.get(url)
    this.pendingRequests.delete(url)

    const durationMs = calcDurationMs(frag.stats?.loading, pending)

    emitTelemetry(
      this.container,
      EVENT_TYPES.REQUEST_END,
      { kind: 'key', urlHash: hashUrl(url), durationMs, bytes: 0, throughputMbps: calculateThroughput(0, durationMs) },
      TELEMETRY_SOURCES.NETWORK
    )
  }

  /**
   * @emits CONTAINER_TELEMETRY_TRACE
   * @type {EVENT_TYPES.REQUEST_ERROR} source: network
   * @data {{ kind: 'segment'|'init'|'subtitle'|'manifest'|'key', urlHash: string, chunk?: object, details: string, fatal: boolean }}
   */
  _onHlsError(_evt, data) {
    if (data.type !== HLS_NETWORK_ERROR_TYPE) return

    if (data.frag?.url) {
      const { frag } = data
      this.pendingRequests.delete(fragKey(frag))
      emitTelemetry(
        this.container,
        EVENT_TYPES.REQUEST_ERROR,
        { kind: fragKind(frag), urlHash: hashUrl(frag.url), chunk: fragChunk(frag), details: data.details, fatal: data.fatal },
        TELEMETRY_SOURCES.NETWORK
      )
      return
    }

    const url = data.url
    if (url) {
      const pending = this.pendingRequests.get(url)
      this.pendingRequests.delete(url)
      emitTelemetry(
        this.container,
        EVENT_TYPES.REQUEST_ERROR,
        { kind: pending?.kind ?? 'unknown', urlHash: hashUrl(url), details: data.details, fatal: data.fatal },
        TELEMETRY_SOURCES.NETWORK
      )
    }
  }

  /**
   * @emits CONTAINER_TELEMETRY_TRACE
   * @type {EVENT_TYPES.BITRATE_CHANGE} source: network
   * @data {{ previous: { bitrate: number|null, width: number|null, height: number|null }, current: { bitrate: number|null, width: number|null, height: number|null } }}
   */
  _onLevelSwitched(_evt, data) {
    const levels = this.hlsInstance?.levels ?? []
    const previousLevelData = this._previousLevel !== null ? levels[this._previousLevel] : null
    const currentLevelData = levels[data.level] ?? null

    this._previousLevel = data.level

    emitTelemetry(
      this.container,
      EVENT_TYPES.BITRATE_CHANGE,
      {
        previous: {
          bitrate: previousLevelData?.bitrate ?? null,
          width: previousLevelData?.width ?? null,
          height: previousLevelData?.height ?? null
        },
        current: {
          bitrate: currentLevelData?.bitrate ?? null,
          width: currentLevelData?.width ?? null,
          height: currentLevelData?.height ?? null
        }
      },
      TELEMETRY_SOURCES.NETWORK
    )
  }

  destroy() {
    if (this.container?.off) this.container.off(Events.CONTAINER_PLAY, this._onPlay)
    this.detachFilters()
    this.pendingRequests.clear()
    this._isBound = false
    this._previousLevel = null
  }
}
