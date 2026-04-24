import { round1 } from '../utils/helpers'

/**
 * Periodic sampler that captures low-level playback state from the `HTMLVideoElement`.
 *
 * Contributes a `playbackState` key to each `mse.sample` envelope:
 * `{ networkState, paused, playbackRate, currentTime }`.
 *
 * Enable via `telemetry.playbackStateSample.enabled: true`.
 */
export default class PlaybackStateSampler {
  static get name() { return 'playback-state-sampler' }

  static isEnabled(cfg) {
    return cfg?.playbackStateSample?.enabled === true
  }

  constructor(playback, _container) {
    this._playback = playback
    this._destroyed = false
  }

  collect() {
    if (this._destroyed) return null
    const el = this._playback?.el
    if (!el) return null

    return {
      networkState: el.networkState,
      paused: el.paused,
      playbackRate: el.playbackRate,
      currentTime: round1(el.currentTime)
    }
  }

  destroy() {
    this._destroyed = true
    this._playback = null
  }
}
