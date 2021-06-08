import { Events, Log, Playback, PlayerError, version } from '@clappr/core'
import {
  READY_STATE_STAGES,
  UNKNOWN_ERROR,
} from './constants'

/**
 * HTML5 playback implementation for HbbTV 2.0.1 capable devices.
 * @class HTML5TVsPlayback
 */
export default class HTML5TVsPlayback extends Playback {
  static canPlay() {
    return true
  }

  get name() { return 'html5_tvs_playback' }

  get supportedVersion() { return { min: version } }

  get tagName() { return 'video' }

  get isReady() { return this.el.readyState >= READY_STATE_STAGES.HAVE_CURRENT_DATA }

  get currentTime() { return this.el.currentTime }

  get duration() { return this.el.duration }

  get events() {
    return {
      canplay: this._onCanPlay,
      loadeddata: this._onLoadedData,
      waiting: this._onWaiting,
      error: this._onError,
    }
  }

  constructor(options, i18n, playerError) {
    super(options, i18n, playerError)
    this.setPrivateFlags()
    this._setupSource(this.options.src)
  }

  setPrivateFlags() {
    this._isReady = false
    this._isBuffering = false
    this._isStopped = false
    this._isDestroyed = false
  }

  _setupSource(sourceURL) {
    if (this.el.src === sourceURL) return

    this.el.src = sourceURL
    this._src = this.el.src
  }

  _onCanPlay(e) {
    Log.info(this.name, 'The HTMLMediaElement canplay event is triggered: ', e)
    if (this._isBuffering) {
      this._isBuffering = false
      this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
    }
  }

  _onLoadedData(e) {
    Log.info(this.name, 'The HTMLMediaElement loadeddata event is triggered: ', e)
    !this._isReady && this._signalizeReadyState()
  }

  _onWaiting(e) {
    this._isBuffering = true
    Log.info(this.name, 'The HTMLMediaElement waiting event is triggered: ', e)
    this.trigger(Events.PLAYBACK_BUFFERING, this.name)
  }

  _onError(e) {
    Log.info(this.name, 'The HTMLMediaElement error event is triggered: ', e)
    const { code, message } = this.el.error || UNKNOWN_ERROR
    const isUnknownError = code === UNKNOWN_ERROR.code

    const formattedError = this.createError({
      code,
      description: message,
      raw: this.el.error,
      level: isUnknownError ? PlayerError.Levels.WARN : PlayerError.Levels.FATAL,
    })

    isUnknownError
      ? Log.warn(this.name, 'HTML5 unknown error: ', formattedError)
      : this.trigger(Events.PLAYBACK_ERROR, formattedError)
  }

  getPlaybackType() {
    return Playback.VOD
  }

  play() {
    this._isStopped = false
    this._setupSource(this._src)

    const promise = this.el.play()
    promise && promise.catch && promise.catch(error => Log.warn(this.name, 'The play promise throws one error: ', error))
  }

  pause() {
    this.el.pause()
  }

  seek(time) {
    if (time < 0) return Log.warn(this.name, 'Attempting to seek to a negative time. Ignoring this operation.')
    this.el.currentTime = time
  }

  stop() {
    this.pause()
    this._isStopped = true
    this._isReady = false
    this._wipeUpMedia()
    this.trigger(Events.PLAYBACK_STOP)
  }

  destroy() {
    this._isDestroyed = true
    this._isReady = false
    super.destroy()
    this._wipeUpMedia()
    this._src = null
  }

  _wipeUpMedia() {
    this.el.removeAttribute('src') // The src attribute will be added again in play().
    this.el.load() // Loads with no src attribute to stop the loading of the previous source and avoid leaks.
  }

  /**
   * Triggers the Clappr playback ready event if the isReady getter returns a true value.
   * If isReady getter returns a false value, invoke itself with a delay that's grown exponentially at every new auto invocation.
   * The initial delay value is 100 milliseconds.
   * Also, set the _isReady flag with true value.
   * @private
   * @param {number} backOff - interval interval between retries (in milliseconds).
   */
  _signalizeReadyState(backOff = 100) {
    if (!this.isReady) return setTimeout(() => { this._signalizeReadyState(backOff * 2) }, backOff)

    this.trigger(Events.PLAYBACK_READY, this.name)
    this._isReady = true
  }

  /**
   * @deprecated
   * This method currently exists for backward compatibility reasons.
   * Use the currentTime getter instead of it.
   */
  getCurrentTime() { return this.currentTime }

  /**
   * @deprecated
   * This method currently exists for backward compatibility reasons.
   * Use the duration getter instead of it.
   */
  getDuration() { return this.duration }
}
