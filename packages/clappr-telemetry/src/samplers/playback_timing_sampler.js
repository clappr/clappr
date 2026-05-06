export default class PlaybackTimingSampler {
  static get name() { return 'timing-sampler' }

  static isEnabled(cfg) {
    return cfg?.timingSample?.enabled === true
  }

  constructor(playback, _container) {
    this._playback = playback
    this._destroyed = false

    this._state = 'idle'
    this._stateStartMs = Date.now()

    this._timePlayingMs = 0
    this._timeWaitingMs = 0
    this._joinTimeMs = null
    this._playRequestedAt = null

    this._onPlay = this._onPlay.bind(this)
    this._onPlaying = this._onPlaying.bind(this)
    this._onWaiting = this._onWaiting.bind(this)

    const el = playback?.el
    if (el) {
      el.addEventListener('play', this._onPlay, { passive: true })
      el.addEventListener('playing', this._onPlaying, { passive: true })
      el.addEventListener('waiting', this._onWaiting, { passive: true })
    }
  }

  _flush() {
    const ms = Date.now() - this._stateStartMs
    if (this._state === 'playing') this._timePlayingMs += ms
    else if (this._state === 'waiting') this._timeWaitingMs += ms
    this._stateStartMs = Date.now()
  }

  _onPlay() {
    if (this._destroyed || this._playRequestedAt !== null) return
    this._playRequestedAt = Date.now()
  }

  _onPlaying() {
    if (this._destroyed) return
    if (this._joinTimeMs === null && this._playRequestedAt !== null) {
      this._joinTimeMs = Date.now() - this._playRequestedAt
    }
    this._flush()
    this._state = 'playing'
  }

  _onWaiting() {
    if (this._destroyed) return
    this._flush()
    this._state = 'waiting'
  }

  collect() {
    if (this._destroyed) return null
    const live = Date.now() - this._stateStartMs
    return {
      timePlayingMs: this._timePlayingMs + (this._state === 'playing' ? live : 0),
      timeWaitingMs: this._timeWaitingMs + (this._state === 'waiting' ? live : 0),
      joinTimeMs: this._joinTimeMs
    }
  }

  destroy() {
    if (this._destroyed) return
    const el = this._playback?.el
    if (el) {
      el.removeEventListener('play', this._onPlay)
      el.removeEventListener('playing', this._onPlaying)
      el.removeEventListener('waiting', this._onWaiting)
    }
    this._destroyed = true
    this._playback = null
  }
}
