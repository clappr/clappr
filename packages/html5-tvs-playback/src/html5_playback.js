import { Events, Log, Playback, version } from '@clappr/core'
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

  constructor(options, i18n, playerError) {
    super(options, i18n, playerError)
    this.setPrivateFlags()
    this._setupSource(this.options.src)
  }

  setPrivateFlags() {
    this._isStopped = false
    this._isDestroyed = false
  }

  _setupSource(sourceURL) {
    if (this.el.src === sourceURL) return

    this.el.src = sourceURL
    this._src = this.el.src
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
    this._wipeUpMedia()
    this.trigger(Events.PLAYBACK_STOP)
  }

  destroy() {
    this._isDestroyed = true
    super.destroy()
    this._wipeUpMedia()
    this._src = null
  }

  _wipeUpMedia() {
    this.el.removeAttribute('src') // The src attribute will be added again in play().
    this.el.load() // Loads with no src attribute to stop the loading of the previous source and avoid leaks.
  }
}
