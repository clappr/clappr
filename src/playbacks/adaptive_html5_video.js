import { isNumber } from '../../base/utils'

import HTML5Video from './html5_video'

import Events from '../../base/events'

/**
 * @implements {ClosedCaptionOption}
 */
class HTML5TextTrackOption {
  /**
   * @param {TextTrack} textTrack Native HTML5 text track object
   * @param {Number} index Position index in native texttrack list
   * @param {Function} onChanged Callback for when a texttrack was enabled
   */
  constructor(textTrack, index, onChanged) {
    this._textTrack = textTrack
    this._index = index
    this._onChanged = onChanged
  }

  get id() { return String(this._textTrack.index) }
  get language() { return this._textTrack.language }
  get active() { this._textTrack.mode === 'showing' }
  get label() { this._textTrack.label }
  get roles() { return [] }

  setActive(schedule, immediateFlush) {
    if (schedule) {
      textTrack.mode = 'showing'
      this._onChanged(this.id)
    } else {
      if (immediateFlush)
        textTrack.mode = 'disabled'
      else
        textTrack.mode = 'hidden'
    }
  }
}

export class AdaptiveHTML5Video extends HTML5Video {

  /**
   * @override
   */
  get name() { return 'adaptive_html5_video' }

  /**
   * @override
   */
  get isAdaptive() { return true }

  /**
   * @override
   * @returns {ClosedCaptionOption[]}
   */
  get closedCaptions() {
    // first, query cached list
    if (this._ccOptions)
      return this._ccOptions


    let textTracks = this.el.textTracks ? Array.from(this.el.textTracks) : []

    if (textTracks.length === 0) return textTracks

    textTracks = textTracks
      .filter(track => track.kind === 'subtitles' || track.kind === 'captions')

    const onSubtitleChanged = (id) => {
      this.trigger(Events.PLAYBACK_SUBTITLE_CHANGED, {
        id
      })
    }

    this._ccOptions = textTracks.map((textTrack, index) => {
      return new HTML5TextTrackOption(textTrack, index, onSubtitleChanged)
    })
  }

  constructor(...args) {
    super(...args)

    /**
     * @member {ClosedCaptionOption}
     */
    this._lastSelectedCcOption = null

    /**
     * @member {Boolean} _ccIsSetup
     * @private
     */
    this._ccIsSetup = false

    /**
     * @member {ClosedCaptionOption[]} _ccOptions
     * @private
     */
    this._ccOptions = null

    /**
     * @private
     * @member {Function}
     */
    this._handleTextTrackChangeCb = null

    this.on(Events.PLAYBACK_PLAY, this._checkForClosedCaptions.bind(this))
  }

  destroy() {
    super.destroy()
    if (this._handleTextTrackChangeCb)
      this.el.textTracks.removeEventListener('change', this._handleTextTrackChangeCb)

  }

  /**
   * Check if there are any native text-tracks available.
   * These might only show up once the HTML5 media is playing.
   */
  _checkForClosedCaptions() {
    // Check if CC available only if current playback is HTML5Video
    if (this._ccIsSetup)
      return


    if (this.closedCaptions.length) {
      this.trigger(Events.PLAYBACK_SUBTITLE_AVAILABLE)

      this._lastSelectedCcOption = this.selectedClosedCaption
      this._handleTextTrackChangeCb = this._handleTextTrackChange.bind(this)
      this.el.textTracks.addEventListener('change', this.handleTextTrackChange)
    }

    this._ccIsSetup = true
  }

  /**
   * Called when text-track list was changed somehow
   * (maybe a track mode was changed through native API bypassing our wrappers)
   */
  _handleTextTrackChange() {

    // first, purge internally cached list
    this._ccOptions = null

    const selectedCc = this.selectedClosedCaption

    if (this._lastSelectedCcOption !== selectedCc) {
      this._lastSelectedCcOption = selectedCc
      this.trigger(Events.PLAYBACK_SUBTITLE_CHANGED, {
        id: selectedCc.id
      })
    }
  }
}
