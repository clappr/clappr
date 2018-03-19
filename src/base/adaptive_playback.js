import Playback from './playback'

/**
 * Used on quality levels and audio or CC options to be activated/deactivated (possibly async`).
 * See VideoQualityLevel for explanation and spec.
 * @typedef {Function} AdaptiveMediaActivator
 * @function
 * @param {Boolean} scheduleActivity Enable/disable activity, switch to a different media representation.
 * @param {Boolean} immediateFlush (default = false) Immediate switching, flushes playout buffer.
 * @param {Function} callback Callback for implemenation to indicate switch has succeeded.
 *                            May be be called in series with triggering the respective ...SWITCH_END event.
 * @returns {Boolean} Whether the switch request could be processed
 *
 */

/**
 * Video quality level description handling object.
 *
 * In a set of quality levels, there should be exactly one of these objects representing each
 * available quality at a given moment.
 * Quality levels can (but must not) be activated independently from each others.
 * When many levels are active, this may tell the underlying media engine that it is allowed
 * use these qualities to fill the playback's buffer, but not any other qualities.
 * An AdpativePlayback implementation may enforce deactivation of levels previously active
 * upon activation of another level (simplest most straight-forward implementation).
 * The API therefore allows to flag levels for usage, or in turn, black-list them to avoid them being used.
 * Wether this is possible depends on the implementation glue code towards the underlying engine,
 * and wether the engine allows this as well.
 *
 * When engines allow to activate several options/levels at once (like using a set of white-listed qualities,
 * or downloading all CC tracks to display them in a random-accessible way w/o latency), if we want to
 * activate an option and make sure that it is the only one, we obviously have to deactivate the previously
 * existing options explicitly. These things need to be managed at a higher level, this API tries
 * to provide a generic and omnipotent access to any possible media-engine features and application needs.
 * Helpers for common simple cases, or base classes for easing implementation glue towards media engines
 * may be added on to top for later on to base-implementations of this.
 *
 * @typedef {Object} VideoQualityLevel
 * @readonly @property {String} id An unique identifier for this quality.
 *                                 Should be defined and be proper to underlying imlementations.
 * @readonly @property {Boolean} active Wether this quality level is activated (meaning that it may be used to fill the playback buffer).
 *                                      May be implemented as accessor method.
 * @readonly @property {Number} width Pixels width of this quality
 * @readonly @property {Number} height Pixels height of this quality
 * @readonly @property {Number} bitrate Average bitrate of this quality level in bits/s
 * @readonly @property {String} codec String identifying the video codec
 * @member {AdaptiveMediaActivator} setActive Method that allows to activate/deactivate this quality level.
 */

/**
 * Audio option available.
 * See VideoQualityLevel.
 * @typedef {Object} AudioOption
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
 * See VideoQualityLevel.
 * @typedef ClosedCaptionOption
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
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but not implemented')

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
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but not implemented')

    return []
  }

  /**
   * @returns {VideoQualityLevel[]}
   */
  get videoQualityLevels() {
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but not implemented')

    return []
  }

  /**
   * @returns {AudioOption[]}
   */
  get availableAudioOptions() {
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but not implemented')

    return []
  }

  /**
   * @returns {AudioOption[]}
   */
  get audioOptions() {
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but not implemented')

    return []
  }

  /**
   * @returns {ClosedCaptionOption[]}
   */
  get availableClosedCaptions() {
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but not implemented')

    return []
  }

  /**
   * @returns {ClosedCaptionOption[]}
   */
  get closedCaptions() {
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but not implemented')

    return []
  }
}
