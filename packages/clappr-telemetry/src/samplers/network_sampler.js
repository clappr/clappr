import { Events } from '@clappr/core'
import { round1 } from '../utils/helpers'
import { EVENT_TYPES } from '../utils/constants'

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
      this._totalBytesKB += (data.bytes ?? 0) / 1024
      this._totalSegmentLoadTimeMs += data.durationMs ?? 0
    } else if (data.kind === 'license') {
      this._licenseRequests++
    }
  }

  _onRequestError(data) {
    this._activeRequests = Math.max(0, this._activeRequests - 1)
    if (data.fatal === true) this._fatalErrors++
    if (data.kind === 'segment') this._segmentErrors++
    else if (data.kind === 'license') this._licenseErrors++
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
   *   drmExpirationTime: number|null
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
      avgSegmentLoadTimeMs: this._segmentsLoaded > 0 ? round1(this._totalSegmentLoadTimeMs / this._segmentsLoaded) : null,
      drmExpirationTime: this._drmExpirationTime
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
