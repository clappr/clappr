import Playback from './playback'

/**
 * @typedef {Function} AdaptiveMediaActivatorFunction
 * @function
 * @param {Boolean} scheduleActivity Enable/disable activity, switch to a different media representation
 * @param {Boolean} immediateFlush (default = false) Immediate switching, flushes playout buffer
 * @returns {Boolean} Whether the switch request could be processed
 *
 */

/**
 * Video quality level description.
 * In a set of quality levels, there should be exactly one of these objects representing each
 * available quality at a given moment.
 * @typedef {Object} VideoQualityLevel
 * @class
 * @property {String} id
 * @property {Boolean} active
 * @property {String} language
 * @property {Number} width pixel
 * @property {Number} height pixels
 * @property {Number} bitrate bits/s
 * @property {String} codec
 * @member {AdaptiveMediaActivatorFunction} setActive
 *
 */

/**
 * Audio option available.
 * @typedef {Object} AudioOption
 * @class
 * @property {String} id
 * @property {Boolean} active
 * @property {Number} volume
 * @property {String} language
 * @property {String} codec
 * @property {Number} channels
 * @property {String[]} roles
 * @member {AdaptiveMediaActivatorFunction} setActive
 */

/**
 * Closed caption option available.
 * @typedef ClosedCaptionOption
 * @class
 * @property {String} id
 * @property {Boolean} active
 * @property {String} language
 * @property {String[]} roles
 * @member {AdaptiveMediaActivatorFunction} setActive
 */

export default class AdaptivePlayback extends Playback {
  /**
   * @returns {Boolean}
   */
  get isAdaptive() {
    return true
  }

  /**
   * @param {Boolean} enabled
   */
  set isAutoAdaptive(enabled) {}

  /**
   * @returns {Boolean}
   */
  get isAutoAdaptive() {
    return false
  }

  /**
   * @returns {VideoQualityLevel[]}
   */
  get activeVideoQualityLevels() {} // eslint-disable-line getter-return

  /**
   * @returns {VideoQualityLevel[]}
   */
  get videoQualityLevels() {} // eslint-disable-line getter-return

  /**
   * @returns {AudioOption[]}
   */
  get availableAudioOptions() {} // eslint-disable-line getter-return

  /**
   * @returns {AudioOption[]}
   */
  get audioOptions() {} // eslint-disable-line getter-return

  /**
   * @returns {ClosedCaptionOption[]}
   */
  get availableClosedCaptions() {} // eslint-disable-line getter-return

  /**
   * @returns {ClosedCaptionOption[]}
   */
  get closedCaptions() {} // eslint-disable-line getter-return
}
