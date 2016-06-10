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
   * Determine if the playback has ended.
   * @property ended
   * @type Boolean
   */
  get ended() {
    return false
  }

  /**
   * Determine if the playback is having to buffer in order for
   * playback to be smooth.
   * (i.e if a live stream is playing smoothly, this will be false)
   * @property buffering
   * @type Boolean
   */
  get buffering() {
    return false
  }

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
   * seeks the playback to a given `time` in seconds
   * @method seek
   * @param {Number} time should be a number between 0 and the video duration
   */
  seek(time) {} // eslint-disable-line no-unused-vars

  /**
   * seeks the playback to a given `percentage` in percentage
   * @method seekPercentage
   * @param {Number} time should be a number between 0 and 100
   */
  seekPercentage(percentage) {} // eslint-disable-line no-unused-vars


  /**
   * The time that "0" now represents relative to when playback started.
   * For a stream with a sliding window this will increase as content is
   * removed from the beginning.
   * @method getStartTimeOffset
   * @return {Number} time (in seconds) that time "0" represents.
   */
  getStartTimeOffset() { return 0 }

  /**
   * gets the duration in seconds
   * @method getDuration
   * @return {Number} duration (in seconds) of the current source
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
   * checks if the playback is ready.
   * @property isReady
   * @type {Boolean} `true` if the current playback is ready, otherwise `false`
   */
  get isReady() {
    return false
  }

  /**
   * gets the playback type (`'vod', 'live', 'aod'`)
   * @method getPlaybackType
   * @return {String} you should write the playback type otherwise it'll assume `'no_op'`
   * @example
   * ```javascript
   * html5VideoPlayback.getPlaybackType() //vod
   * html5AudioPlayback.getPlaybackType() //aod
   * html5VideoPlayback.getPlaybackType() //live
   * flashHlsPlayback.getPlaybackType() //live
   * ```
   */
  getPlaybackType() {
    return Playback.NO_OP
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
  volume(value) {} // eslint-disable-line no-unused-vars

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
 * checks if the playback can play a given `source`
 * If a mimeType is provided then this will be used instead of inferring the mimetype
 * from the source extension.
 * @method canPlay
 * @static
 * @param {String} source the given source ex: `http://example.com/play.mp4`
 * @param {String} [mimeType] the given mime type, ex: `'application/vnd.apple.mpegurl'`
 * @return {Boolean} `true` if the playback is playable, otherwise `false`
 */
Playback.canPlay = (source, mimeType) => { // eslint-disable-line no-unused-vars
  return false
}

/**
 * a playback type for video on demand
 *
 * @property VOD
 * @static
 * @type String
 */
Playback.VOD = 'vod'
/**
 * a playback type for audio on demand
 *
 * @property AOD
 * @static
 * @type String
 */
Playback.AOD = 'aod'
/**
 * a playback type for live video
 *
 * @property LIVE
 * @static
 * @type String
 */
Playback.LIVE = 'live'
/**
 * a default playback type
 *
 * @property NO_OP
 * @static
 * @type String
 */
Playback.NO_OP = 'no_op'
/**
 * the plugin type
 *
 * @property type
 * @static
 * @type String
 */
Playback.type = 'playback'
