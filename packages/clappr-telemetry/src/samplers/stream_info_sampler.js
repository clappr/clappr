import { Events } from '@clappr/core'
import { EVENT_TYPES } from '../utils/constants'

export default class StreamInfoSampler {
  static get name() { return 'stream-info-sampler' }
  static isEnabled(cfg) { return cfg?.streamInfoSample?.enabled === true }

  constructor(_playback, container) {
    this._destroyed = false
    this._container = container
    this._info = null
    if (container) {
      this._onTrace = this._onTrace.bind(this)
      container.on(Events.Custom.CONTAINER_TELEMETRY_TRACE, this._onTrace)
    }
  }

  _onTrace({ type, data }) {
    if (this._destroyed) return
    if (type === EVENT_TYPES.STREAM_INFO) this._info = { ...data }
  }

  collect() {
    if (this._destroyed) return null
    return this._info ? { ...this._info } : null
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
