import Playback from './playback'

/**
 * Used on quality levels and audio or CC options to be activated/deactivated (possibly async`).
 * See VideoQualityLevel for explanation and spec.
 * @typedef {Function} AdaptiveMediaActivator
 * @function
 * @param {Boolean} scheduleActivity Optional (default = true). (Un-)schedule activity, switch to a different media representation.
 * @param {Boolean} immediateFlush Optional (default = false). Immediate switching, flushes playout buffer.
 * @param {Function} callback Optional (default = no-op/null). Callback for implemenation to indicate switch has succeeded.
 *                            May be be called in series with triggering the respective ...SWITCH_END event.
 * @returns {Boolean} Whether the switch request could be processed
 *
 */

/**
 * @typedef {Object} AdaptiveMediaOption
 * @readonly @property {Boolean} active
 * @member {AdaptiveMediaActivator} setActive Method that allows to activate/deactivate this quality level or audio/text track.
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
 * @typedef {AdaptiveMediaOption} VideoQualityLevel
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
 * @typedef {AdaptiveMediaOption} AudioOption
 * @readonly @property {String} id
 * @readonly @property {Boolean} active
 * @readonly @property {Number} volume
 * @readonly @property {String} language
 * @readonly @property {String} codec
 * @readonly @property {Number} channels
 * @readonly @property {String[]} roles
 * @member {AdaptiveMediaActivator} setActive
 */

/**
 * Closed caption option available.
 * See VideoQualityLevel.
 * @typedef {AdaptiveMediaOption} ClosedCaptionOption
 * @readonly @property {String} id
 * @readonly @property {Boolean} active
 * @readonly @property {String} language
 * @readonly @property {String} label
 * @readonly @property {String[]} roles
 * @member {AdaptiveMediaActivator} setActive
 */

export class AdaptivePlayback extends Playback {
  /**
   * Helper logic to facilitate usage of API implementation for common use-cases.
   * Activates one option exclusively. Passing an invalid identifier or `null`
   * will deactivate all options. Deactivates all options ot corresponding to this id.
   * @param {AdaptiveMediaOption[]} adaptiveMediaOptions
   * @param {String | Number | AdaptiveMediaOption} id
   *
   */
  static selectAdaptiveMediaOption(adaptiveMediaOptions, id) {
    if (typeof id === 'object') {
      // assuming it's an AdaptiveMediaOption object
      id = id.id
    }
    adaptiveMediaOptions.forEach((option, index) => {
      if (typeof id === 'string')
        option.setActive(id === option.id)
      else if (typeof id === 'number')
        option.setActive(id === index)
      else
        throw new Error('Adaptive media option id should be string or number')
    })
  }

  /**
   * @param {AdaptiveMediaOption[]} adaptiveMediaOptions
   */
  static findSelectedAdaptiveMediaOption(adaptiveMediaOptions) {
    return (adaptiveMediaOptions.filter((option) => option.active)[0] || null)
  }

  /**
   * checks if the playback has closed caption tracks.
   * @property hasClosedCaptionsTracks
   * @type {Boolean}
   * @override
   * @deprecated
   */
  get hasClosedCaptionsTracks() {
    return !!this.closedCaptions.length
  }

  /**
   * gets the playback available closed caption tracks.
   * @property closedCaptionsTracks
   * @type {Array} an array of objects with at least 'id' and 'name' properties
   * @override
   * @deprecated
   */
  get closedCaptionsTracks() {
    return this.closedCaptions.map(({ id, language }) => {
      return {
        id,
        name: language
      }
    })
  }

  /**
   * gets the selected closed caption track id (-1 is disabled)
   * @property closedCaptionsTrackId
   * @type {Number}
   * @override
   * @deprecated
   */
  get closedCaptionsTrackId() {
    const firstActiveCcOption = this.closedCaptions.filter((ccOption) => ccOption.active)[0]
    if (!firstActiveCcOption)
      return -1
    return parseInt(firstActiveCcOption.id, 10)
  }

  /**
   * sets the selected closed caption track index. (-1 is disabled)
   * @property closedCaptionsTrackId
   * @type {Number}
   * @override
   * @deprecated
   */
  set closedCaptionsTrackId(trackId) {
    this.closedCaptions.forEach((ccOption) => {
      // disable all CC options!
      if (trackId === -1) {
        ccOption.setActive(false)
        // and return
        return
      }
      // Or, find mathcing id strings in options and activate
      if (ccOption.id === String(trackId))
        ccOption.setActive()
    })
  }

  /**
   * Convenience basic use-case method to select video quality levels.
   * Activates one quality exclusively. Passing an invalid identifier or `null`
   * will deactivate all options and may therefore have underlying implementation
   * fall back onto automatic quality selection mode. The latter should also be driveable
   * through the `isAutoAdaptive` property of the implementation.
   * @param {String | Number | VideoQualityLevel} id
   */
  selectVideoQualityLevel(id) {
    AdaptivePlayback.selectAdaptiveMediaOption(this.videoQualityLevels, id)
  }

  /**
   * Convenience method to select an audio track option.
   * @param {String | Number | AudioOption} id
   */
  selectAudioOption(id) {
    AdaptivePlayback.selectAdaptiveMediaOption(this.audioOptions, id)
  }

  /**
   * Convenience method to select a text track option.
   * @param {String | Number | ClosedCaptionOption} id
   */
  selectClosedCaption(id) {
    AdaptivePlayback.selectAdaptiveMediaOption(this.audioOptions, id)
  }

  get selectedVideoQualityLevel() {
    return AdaptivePlayback.findSelectedAdaptiveMediaOption(this.videoQualityLevels)
  }

  get selectedAudioOption() {
    return AdaptivePlayback.findSelectedAdaptiveMediaOption(this.audioOptions)
  }

  get selectedClosedCaption() {
    return AdaptivePlayback.findSelectedAdaptiveMediaOption(this.closedCaptions)
  }

  /**
   *
   * @returns {Boolean}
   */
  get isAdaptive() {
    return true
  }

  /**
   * @abstract
   * @param {Boolean} enabled
   */
  set isAutoAdaptive(enabled) {
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but method not implemented')
    return false
  }

  /**
   * @returns {Boolean}
   */
  get isAutoAdaptive() { return false }

  /**
   * @abstract
   * @returns {VideoQualityLevel[]}
   */
  get videoQualityLevels() {
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but not implemented')

    return []
  }

  /**
   * @abstract
   * @returns {AudioOption[]}
   */
  get audioOptions() {
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but not implemented')

    return []
  }

  /**
   * @abstract
   * @returns {ClosedCaptionOption[]}
   */
  get closedCaptions() {
    if (this.isAdaptive)
      throw new Error('Playback is adaptive but not implemented')
    return []
  }
}
