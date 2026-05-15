import { Events } from '@clappr/core'
import { round1 } from '../utils/helpers'
import { EVENT_TYPES } from '../utils/constants'

const SEGMENT_HISTORY_SIZE = 10

const QUALITY_SCORE = { excellent: 4, good: 3, fair: 2, poor: 1, critical: 0 }

const quality = label => ({ label, score: QUALITY_SCORE[label] })

/**
 * Classifies absolute throughput into a quality tier.
 *
 * Thresholds derived from industry benchmarks used by Mux, Conviva, and NPAW:
 * - > 25 Mbps → excellent (4K HDR headroom)
 * - > 10 Mbps → good     (1080p with comfortable margin)
 * - >  4 Mbps → fair     (720p viable)
 * - >1.5 Mbps → poor     (360p / SD territory)
 * - ≤1.5 Mbps → critical (below reliable SD playback)
 *
 * @param {number|null} mbps - EWMA throughput in Mbps
 * @returns {{label: string, score: number}|null}
 */
function _classifyNetworkQuality(mbps) {
  if (mbps == null) return null
  if (mbps > 25) return quality('excellent')
  if (mbps > 10) return quality('good')
  if (mbps > 4) return quality('fair')
  if (mbps > 1.5) return quality('poor')
  return quality('critical')
}

/**
 * Classifies throughput adequacy relative to the current stream bitrate.
 *
 * Based on the buffer-safety margin concept from Conviva and NPAW: a ratio of
 * throughput-to-bitrate above 2× is considered safe for continuous playback
 * without rebuffering. Ratios below 1× mean the network cannot sustain the
 * current quality level.
 *
 * @param {number|null} mbps       - EWMA throughput in Mbps
 * @param {number|null} bitrateKbps - Current ABR variant bitrate in kbps
 * @returns {{label: string, score: number}|null}
 */
function _classifyNetworkAdequacy(mbps, bitrateKbps) {
  if (mbps == null || bitrateKbps == null || bitrateKbps === 0) return null
  const ratio = mbps / (bitrateKbps / 1000)
  if (ratio > 3) return quality('excellent')
  if (ratio > 2) return quality('good')
  if (ratio > 1.5) return quality('fair')
  if (ratio > 1) return quality('poor')
  return quality('critical')
}

export default class NetworkSampler {
  static get name() {
    return 'network-sampler'
  }

  static isEnabled(cfg) {
    return cfg?.networkSample?.enabled === true
  }

  constructor(_playback, container) {
    this._destroyed = false
    this._container = container

    this._throughputEwmaMbps = null
    this._lastThroughputMbps = null
    this._activeRequests = 0
    this._segmentsLoaded = 0
    this._segmentErrors = 0
    this._totalBytesKB = 0
    this._licenseRequests = 0
    this._licenseErrors = 0
    this._fatalErrors = 0
    this._totalSegmentLoadTimeMs = 0
    this._drmExpirationTime = null
    this._currentBitrateKbps = null
    this._lastSegmentBytes = null
    this._segmentHistory = []

    if (container) {
      this._onTrace = this._onTrace.bind(this)
      container.on(Events.Custom.CONTAINER_TELEMETRY_TRACE, this._onTrace)
    }
  }

  _onTrace({ type, data }) {
    if (this._destroyed) return
    switch (type) {
      case EVENT_TYPES.REQUEST_START:
        this._onRequestStart()
        break
      case EVENT_TYPES.REQUEST_END:
        this._onRequestEnd(data)
        break
      case EVENT_TYPES.REQUEST_ERROR:
        this._onRequestError(data)
        break
      case EVENT_TYPES.DRM_EXPIRATION_UPDATED:
        this._onDrmExpirationUpdated(data)
        break
      case EVENT_TYPES.BITRATE_INIT:
      case EVENT_TYPES.BITRATE_CHANGE:
        this._onBitrateUpdate(data)
        break
    }
  }

  get _avgSegmentLoadTimeMs() {
    return this._segmentsLoaded > 0
      ? round1(this._totalSegmentLoadTimeMs / this._segmentsLoaded)
      : null
  }

  _onBitrateUpdate(data) {
    if (data?.current?.bitrate != null) {
      this._currentBitrateKbps = data.current.bitrate / 1000
    }
  }

  _onRequestStart() {
    this._activeRequests++
  }

  _onRequestEnd(data) {
    this._activeRequests = Math.max(0, this._activeRequests - 1)
    if (data.kind === 'segment') {
      if (data.throughputEwmaMbps != null) this._throughputEwmaMbps = data.throughputEwmaMbps
      if (data.throughputMbps != null) this._lastThroughputMbps = data.throughputMbps
      this._segmentsLoaded++
      this._lastSegmentBytes = data.bytes ?? null
      this._totalBytesKB += (data.bytes ?? 0) / 1024
      this._totalSegmentLoadTimeMs += data.durationMs ?? 0
      const chunk = data.chunk
      if (chunk?.seq != null) {
        this._pushSegment({
          seq: chunk.seq,
          variantId: chunk.variantId,
          start: round1(chunk.start),
          dur: round1(chunk.dur),
          loadTimeMs: Math.round(data.durationMs ?? 0),
          bytes: data.bytes ?? 0,
          ok: true
        })
      }
    } else if (data.kind === 'license') {
      this._licenseRequests++
    }
  }

  _onRequestError(data) {
    this._activeRequests = Math.max(0, this._activeRequests - 1)
    if (data.fatal === true) this._fatalErrors++
    if (data.kind === 'segment') {
      this._segmentErrors++
      const chunk = data.chunk
      if (chunk?.seq != null) {
        this._pushSegment({
          seq: chunk.seq,
          variantId: chunk.variantId,
          start: round1(chunk.start),
          dur: round1(chunk.dur),
          loadTimeMs: 0,
          bytes: 0,
          ok: false
        })
      }
    } else if (data.kind === 'license') {
      this._licenseErrors++
    }
  }

  _pushSegment(entry) {
    if (this._segmentHistory.length >= SEGMENT_HISTORY_SIZE) this._segmentHistory.shift()
    this._segmentHistory.push(entry)
  }

  _onDrmExpirationUpdated({ expirationTime }) {
    this._drmExpirationTime = expirationTime ?? null
  }

  /**
   * Collects the current network metrics snapshot.
   * Returns `null` after `destroy()` is called.
   *
   * @returns {{
   *   throughputEwmaMbps: number|null,
   *   lastThroughputMbps: number|null,
   *   activeRequests: number,
   *   segmentsLoaded: number,
   *   segmentErrors: number,
   *   totalBytesKB: number,
   *   licenseRequests: number,
   *   licenseErrors: number,
   *   fatalErrors: number,
   *   avgSegmentLoadTimeMs: number|null,
   *   drmExpirationTime: number|null,
   *   lastSegmentBytes: number|null,
   *   networkQuality: {label:string, score:number}|null,
   *   networkAdequacy: {label:string, score:number}|null,
   *   segmentHistory: Array<{seq:number, variantId:number, start:number, dur:number, loadTimeMs:number, bytes:number, ok:boolean}>
   * } | null}
   */
  collect() {
    if (this._destroyed) return null
    return {
      throughputEwmaMbps: round1(this._throughputEwmaMbps),
      lastThroughputMbps: round1(this._lastThroughputMbps),
      activeRequests: this._activeRequests,
      segmentsLoaded: this._segmentsLoaded,
      segmentErrors: this._segmentErrors,
      totalBytesKB: round1(this._totalBytesKB),
      licenseRequests: this._licenseRequests,
      licenseErrors: this._licenseErrors,
      fatalErrors: this._fatalErrors,
      avgSegmentLoadTimeMs: this._avgSegmentLoadTimeMs,
      drmExpirationTime: this._drmExpirationTime,
      lastSegmentBytes: this._lastSegmentBytes,
      networkQuality: _classifyNetworkQuality(this._throughputEwmaMbps),
      networkAdequacy: _classifyNetworkAdequacy(this._throughputEwmaMbps, this._currentBitrateKbps),
      segmentHistory: this._segmentHistory.slice()
    }
  }

  destroy() {
    if (this._destroyed) return
    if (this._container) {
      this._container.off(Events.Custom.CONTAINER_TELEMETRY_TRACE, this._onTrace)
    }
    this._destroyed = true
    this._container = null
  }
}
