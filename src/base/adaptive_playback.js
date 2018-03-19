import Playback from './playback'

/**
 * @typedef {Function} AdaptiveMediaActivator
 * @function
 * @param {Boolean} scheduleActivity Enable/disable activity, switch to a different media representation
 * @param {Boolean} immediateFlush (default = false) Immediate switching, flushes playout buffer
 * @param {Function} callback
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
 * @property {Number} width pixel
 * @property {Number} height pixels
 * @property {Number} bitrate bits/s
 * @property {String} codec
 * @member {AdaptiveMediaActivator} setActive
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
 * @member {AdaptiveMediaActivator} setActive
 */

/**
 * Closed caption option available.
 * @typedef ClosedCaptionOption
 * @class
 * @property {String} id
 * @property {Boolean} active
 * @property {String} language
 * @property {String[]} roles
 * @member {AdaptiveMediaActivator} setActive
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
  set isAutoAdaptive(enabled) {
    if (this.isAdaptive) {
      throw new Error('Playback is adaptive but not implemented')
    }
    return false
  }

  /**
   * @returns {Boolean}
   */
  get isAutoAdaptive() { return false }

  /**
   * @returns {VideoQualityLevel[]}
   */
  get activeVideoQualityLevels() {
    if (this.isAdaptive) {
      throw new Error('Playback is adaptive but not implemented')
    }
    return []
  }

  /**
   * @returns {VideoQualityLevel[]}
   */
  get videoQualityLevels() {
    if (this.isAdaptive) {
      throw new Error('Playback is adaptive but not implemented')
    }
    return []
  }

  /**
   * @returns {AudioOption[]}
   */
  get availableAudioOptions() {
    if (this.isAdaptive) {
      throw new Error('Playback is adaptive but not implemented')
    }
    return []
  }

  /**
   * @returns {AudioOption[]}
   */
  get audioOptions() {
    if (this.isAdaptive) {
      throw new Error('Playback is adaptive but not implemented')
    }
    return []
  }

  /**
   * @returns {ClosedCaptionOption[]}
   */
  get availableClosedCaptions() {
    if (this.isAdaptive) {
      throw new Error('Playback is adaptive but not implemented')
    }
    return []
  }

  /**
   * @returns {ClosedCaptionOption[]}
   */
  get closedCaptions() {
    if (this.isAdaptive) {
      throw new Error('Playback is adaptive but not implemented')
    }
    return []
  }
}
