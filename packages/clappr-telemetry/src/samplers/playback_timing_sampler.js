import { Events } from '@clappr/core'
import { EVENT_TYPES } from '../utils/constants'

export default class PlaybackTimingSampler {
  static get name() { return 'timing-sampler' }

  static isEnabled(cfg) {
    return cfg?.timingSample?.enabled === true
  }

  constructor(playback, container) {
    this._playback = playback
    this._container = container
    this._destroyed = false

    this._state = 'idle'
    this._stateStartMs = Date.now()

    this._sessionStartAt = Date.now()

    this._timePlayingMs = 0
    this._timeWaitingMs = 0
    this._joinTimeMs = null
    this._timeToFirstFrameMs = null
    this._playRequestedAt = null
    this._manifestLoadTimeMs = null
    this._firstSegmentLoadTimeMs = null

    this._onPlayIntent = this._onPlayIntent.bind(this)
    this._onPlaying = this._onPlaying.bind(this)
    this._onBuffering = this._onBuffering.bind(this)
    this._onPause = this._onPause.bind(this)
    this._onEnded = this._onEnded.bind(this)
    this._onStop = this._onStop.bind(this)
    this._onTrace = this._onTrace.bind(this)

    if (playback) {
      playback.on(Events.PLAYBACK_PLAY_INTENT, this._onPlayIntent)
      playback.on(Events.PLAYBACK_PLAY, this._onPlaying)
      playback.on(Events.PLAYBACK_BUFFERING, this._onBuffering)
      playback.on(Events.PLAYBACK_PAUSE, this._onPause)
      playback.on(Events.PLAYBACK_ENDED, this._onEnded)
      playback.on(Events.PLAYBACK_STOP, this._onStop)
    }

    if (container) {
      container.on(Events.Custom.CONTAINER_TELEMETRY_TRACE, this._onTrace)
    }
  }

  _flush() {
    const ms = Date.now() - this._stateStartMs
    if (this._state === 'playing') this._timePlayingMs += ms
    else if (this._state === 'waiting') this._timeWaitingMs += ms
    this._stateStartMs = Date.now()
  }

  _onTrace({ type, data }) {
    if (this._destroyed) return
    if (this._manifestLoadTimeMs !== null && this._firstSegmentLoadTimeMs !== null) return
    if (type !== EVENT_TYPES.REQUEST_END) return

    const kind = data?.kind
    const durationMs = data?.durationMs

    if (kind === 'manifest' && this._manifestLoadTimeMs === null && durationMs != null) {
      this._manifestLoadTimeMs = durationMs
    }

    if (kind === 'segment' && this._firstSegmentLoadTimeMs === null && durationMs != null) {
      this._firstSegmentLoadTimeMs = durationMs
    }
  }

  _onPlayIntent() {
    if (this._destroyed || this._playRequestedAt !== null) return
    this._playRequestedAt = Date.now()
  }

  _onPlaying() {
    if (this._destroyed) return
    const now = Date.now()
    if (this._joinTimeMs === null && this._playRequestedAt !== null) {
      this._joinTimeMs = now - this._playRequestedAt
    }
    if (this._timeToFirstFrameMs === null) {
      this._timeToFirstFrameMs = now - this._sessionStartAt
    }
    this._flush()
    this._state = 'playing'
  }

  _onBuffering() {
    if (this._destroyed) return
    this._flush()
    this._state = 'waiting'
  }

  _onPause() {
    if (this._destroyed) return
    this._flush()
    this._state = 'idle'
  }

  _onEnded() {
    if (this._destroyed) return
    this._flush()
    this._state = 'idle'
  }

  _onStop() {
    if (this._destroyed) return
    this._flush()
    this._state = 'idle'
  }

  /**
   * Collects accumulated playback timing metrics for the current session.
   * Returns `null` after `destroy()` is called.
   *
   * @returns {{
   *   timePlayingMs: number,
   *   timeWaitingMs: number,
   *   joinTimeMs: number|null,
   *   autoplayStartupTimeMs: number|null,
   *   manifestLoadTimeMs: number|null,
   *   firstSegmentLoadTimeMs: number|null
   * } | null}
   */
  collect() {
    if (this._destroyed) return null
    const live = Date.now() - this._stateStartMs
    return {
      timePlayingMs: this._timePlayingMs + (this._state === 'playing' ? live : 0),
      timeWaitingMs: this._timeWaitingMs + (this._state === 'waiting' ? live : 0),
      joinTimeMs: this._joinTimeMs,
      autoplayStartupTimeMs: this._playRequestedAt === null ? this._timeToFirstFrameMs : null,
      manifestLoadTimeMs: this._manifestLoadTimeMs,
      firstSegmentLoadTimeMs: this._firstSegmentLoadTimeMs
    }
  }

  destroy() {
    if (this._destroyed) return
    if (this._playback) {
      this._playback.off(Events.PLAYBACK_PLAY_INTENT, this._onPlayIntent)
      this._playback.off(Events.PLAYBACK_PLAY, this._onPlaying)
      this._playback.off(Events.PLAYBACK_BUFFERING, this._onBuffering)
      this._playback.off(Events.PLAYBACK_PAUSE, this._onPause)
      this._playback.off(Events.PLAYBACK_ENDED, this._onEnded)
      this._playback.off(Events.PLAYBACK_STOP, this._onStop)
    }
    if (this._container) {
      this._container.off(Events.Custom.CONTAINER_TELEMETRY_TRACE, this._onTrace)
    }
    this._destroyed = true
    this._playback = null
    this._container = null
  }
}
