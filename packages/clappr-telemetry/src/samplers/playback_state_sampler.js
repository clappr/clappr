import { Events } from '@clappr/core'
import { round1 } from '../utils/helpers'
import { EVENT_TYPES } from '../utils/constants'

export default class PlaybackStateSampler {
  static get name() { return 'playback-state-sampler' }

  static isEnabled(cfg) {
    return cfg?.playbackStateSample?.enabled === true
  }

  constructor(playback, container) {
    this._playback = playback
    this._container = container
    this._destroyed = false

    this._currentBitrateKbps = null
    this._currentWidth = null
    this._currentHeight = null
    this._switchesUp = 0
    this._switchesDown = 0
    this._previousBitrateKbps = null

    if (container) {
      this._onTrace = this._onTrace.bind(this)
      container.on(Events.Custom.CONTAINER_TELEMETRY_TRACE, this._onTrace)
    }
  }

  _onTrace({ type, data }) {
    if (this._destroyed) return
    switch (type) {
      case EVENT_TYPES.BITRATE_INIT:
        this._onBitrateInit(data)
        break
      case EVENT_TYPES.BITRATE_CHANGE:
        this._onBitrateChange(data)
        break
    }
  }

  _onBitrateInit({ current }) {
    if (current?.bitrate != null) {
      this._currentBitrateKbps = current.bitrate / 1000
      this._previousBitrateKbps = this._currentBitrateKbps
    }
    if (current?.width != null) this._currentWidth = current.width
    if (current?.height != null) this._currentHeight = current.height
  }

  _onBitrateChange({ current }) {
    if (current?.bitrate != null) {
      const kbps = current.bitrate / 1000
      if (this._previousBitrateKbps != null) {
        if (kbps > this._previousBitrateKbps) this._switchesUp++
        else if (kbps < this._previousBitrateKbps) this._switchesDown++
      }
      this._previousBitrateKbps = kbps
      this._currentBitrateKbps = kbps
    }
    if (current?.width != null) this._currentWidth = current.width
    if (current?.height != null) this._currentHeight = current.height
  }

  collect() {
    if (this._destroyed) return null
    const el = this._playback?.el
    if (!el) return null

    return {
      networkState: el.networkState,
      paused: el.paused,
      playbackRate: el.playbackRate,
      currentTime: round1(el.currentTime),
      bitrateKbps: round1(this._currentBitrateKbps),
      width: this._currentWidth,
      height: this._currentHeight,
      switchesUp: this._switchesUp,
      switchesDown: this._switchesDown
    }
  }

  destroy() {
    if (this._container) {
      this._container.off(Events.Custom.CONTAINER_TELEMETRY_TRACE, this._onTrace)
    }
    this._destroyed = true
    this._playback = null
    this._container = null
  }
}
