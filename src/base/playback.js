import { extend } from './utils'
import UIObject from './ui_object'
import ErrorMixin from './error_mixin'

import $ from 'clappr-zepto'

/**
 * An abstraction to represent a generic playback, it's like an interface to be implemented by subclasses.
 * @class Playback
 * @constructor
 * @extends UIObject
 * @module base
 */
export default class Playback extends UIObject {
  /**
  * Determine if the playback does not contain video/has video but video should be ignored.
  * @property isAudioOnly
  * @type Boolean
  */
  get isAudioOnly() {
    return false
  }

  get isAdaptive() {
    return false
  }

  /**
   * Determine if the playback has ended.
   * @property ended
   * @type Boolean
   */
  get ended() {
    return false
  }

  /**
   * The internationalization plugin.
   * @property i18n
   * @type {Strings}
   */
  get i18n() {
    return this._i18n
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
   * Determine if the playback has user consent.
   * @property consented
   * @type Boolean
   */
  get consented() {
    return this._consented
  }

  /**
   * @method constructor
   * @param {Object} options the options object
   * @param {Strings} i18n the internationalization component
   */
  constructor(options, i18n, playerError) {
    super(options)
    this.settings = {}
    this._i18n = i18n
    this.playerError = playerError
    this._consented = false
  }

  /**
   * Gives user consent to playback (mobile devices).
   * @method consent
   */
  consent() {
    this._consented = true
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
   * checks if the playback has closed caption tracks.
   * @property hasClosedCaptionsTracks
   * @type {Boolean}
   */
  get hasClosedCaptionsTracks() {
    return this.closedCaptionsTracks.length > 0
  }

  /**
   * gets the playback available closed caption tracks.
   * @property closedCaptionsTracks
   * @type {Array} an array of objects with at least 'id' and 'name' properties
   */
  get closedCaptionsTracks() {
    return []
  }

  /**
   * gets the selected closed caption track index. (-1 is disabled)
   * @property closedCaptionsTrackId
   * @type {Number}
   */
  get closedCaptionsTrackId() {
    return -1
  }

  /**
   * sets the selected closed caption track index. (-1 is disabled)
   * @property closedCaptionsTrackId
   * @type {Number}
   */
  set closedCaptionsTrackId(trackId) {} // eslint-disable-line no-unused-vars

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
   * enables to configure the playback after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   */
  configure(options) {
    this._options = $.extend(this._options, options)
  }

  /**
   * attempt to autoplays the playback.
   * @method attemptAutoPlay
   */
  attemptAutoPlay() {
    this.canAutoPlay((result, error) => { // eslint-disable-line no-unused-vars
      result && this.play()
    })
  }

  /**
   * checks if the playback can autoplay.
   * @method canAutoPlay
   * @param {Function} callback function where first param is Boolean and second param is playback Error or null
   */
  canAutoPlay(cb) {
    cb(true, null) // Assume playback can autoplay by default
  }
}

Object.assign(Playback.prototype, ErrorMixin)

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
