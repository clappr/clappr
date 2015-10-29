import {extend} from './utils'
import UIObject from './ui_object'

/**
 * An abstraction to represent a generic playback, it's like an interface to be implemented by subclasses.
 * @class Playback
 * @constructor
 * @extends UIObject
 * @module base
 */
export default class Playback extends UIObject {
  /**
   * @method constructor
   * @param {Object} options the options object
   */
  constructor(options) {
    super(options)
    this.settings = {}
  }

  /**
   * plays the playback.
   * @method play
   */
  play() {}

  /**
   * pauses the playback.
   * @method pause
   */
  pause() {}

  /**
   * stops the playback.
   * @method stop
   */
  stop() {}

  /**
   * seeks the playback to a given `time` in percentage
   * @method seek
   * @param {Number} time should be a number between 0 and 100
   */
  seek(time) {}

  /**
   * gets the duration in seconds
   * @method getDuration
   * @return {Number} duration time (in seconds) of the current source
   */
  getDuration() { return 0 }

  /**
   * checks if the playback is playing.
   * @method isPlaying
   * @return {Boolean} `true` if the current playback is playing, otherwise `false`
   */
  isPlaying() {
    return false
  }

  /**
   * gets the playback type
   * @method getPlaybackType
   * @return {String} you should write the playback type otherwise it'll assume `'no_op'`
   * @example
   * ```javascript
   * html5VideoPlayback.getPlaybackType() //html5_video
   * flashHlsPlayback.getPlaybackType() //hls
   * ```
   */
  getPlaybackType() {
    return 'no_op'
  }

  /**
   * checks if the playback is in HD.
   * @method isHighDefinitionInUse
   * @return {Boolean} `true` if the playback is playing in HD, otherwise `false`
   */
  isHighDefinitionInUse() {
    return false
  }

  /**
   * sets the volume for the playback
   * @method volume
   * @param {Number} value a number between 0 (`muted`) to 100 (`max`)
   */
  volume(value) {}

  /**
   * destroys the playback, removing it from DOM
   * @method destroy
   */
  destroy() {
    this.$el.remove()
  }
}

Playback.extend = function(properties) {
  return extend(Playback, properties)
}

  /**
   * checks if the playback can play a given `source` and optionally a `mimeType`
   * @method canPlay
   * @static
   * @param {String} source the given source ex: `http://example.com/play.mp4`
   * @param {String} [mimeType] the given mime type, ex: `'application/vnd.apple.mpegurl'`
   * @return {Boolean} `true` if the playback is playable, otherwise `false`
   */
Playback.canPlay = (source, mimeType) => {
  return false
}

Playback.type = 'playback'
