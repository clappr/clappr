import { Log, Playback, version } from '@clappr/core'
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

  _setupSource(sourceURL) {
    if (this.el.src === sourceURL) return

    this.el.src = sourceURL
    this._src = this.el.src
  }

  play() {
    this._setupSource(this._src)

    const promise = this.el.play()
    promise && promise.catch && promise.catch(error => Log.warn(this.name, 'The play promise throws one error: ', error))
  }

  pause() {
    this.el.pause()
  }
}
