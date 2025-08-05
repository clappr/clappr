// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * Container is responsible for the video rendering and state
 */

import Events from '../../base/events/events'
import UIObject from '../../base/ui_object/ui_object'
import ErrorMixin from '../../base/error_mixin/error_mixin'
import Styler from '../../base/styler/styler'
import { DoubleEventHandler } from '../../utils/utils'
import ContainerStyle from './public/style.scss'
import $ from 'clappr-zepto'

/**
 * An abstraction to represent a container for a given playback
 * TODO: describe its responsabilities
 * @class Container
 * @constructor
 * @extends UIObject
 * @module base
 */
export default class Container extends UIObject {
  /**
   * container's name
   * @method name
   * @default Container
   * @return {String} container's name
   */
  get name() { return 'Container' }
  get attributes() { return { class: 'container', 'data-container': '' } }
  get events() {
    return {
      'click': 'clicked',
      'dblclick': 'dblClicked',
      'touchend': 'dblTap',
      'contextmenu': 'onContextMenu',
      'mouseenter': 'mouseEnter',
      'mouseleave': 'mouseLeave',
      'mouseup': 'onMouseUp',
      'mousedown': 'onMouseDown'
    }
  }

  /**
   * Determine if the playback has ended.
   * @property ended
   * @type Boolean
   */
  get ended() {
    return this.playback.ended
  }

  /**
   * Determine if the playback is having to buffer in order for
   * playback to be smooth.
   * (i.e if a live stream is playing smoothly, this will be false)
   * @property buffering
   * @type Boolean
   */
  get buffering() {
    return this.playback.buffering
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
   * checks if has closed caption tracks.
   * @property hasClosedCaptionsTracks
   * @type {Boolean}
   */
  get hasClosedCaptionsTracks() {
    return this.playback.hasClosedCaptionsTracks
  }

  /**
   * gets the available closed caption tracks.
   * @property closedCaptionsTracks
   * @type {Array} an array of objects with at least 'id' and 'name' properties
   */
  get closedCaptionsTracks() {
    return this.playback.closedCaptionsTracks
  }

  /**
   * gets the selected closed caption track index. (-1 is disabled)
   * @property closedCaptionsTrackId
   * @type {Number}
   */
  get closedCaptionsTrackId() {
    return this.playback.closedCaptionsTrackId
  }

  /**
   * sets the selected closed caption track index. (-1 is disabled)
   * @property closedCaptionsTrackId
   * @type {Number}
   */
  set closedCaptionsTrackId(trackId) {
    this.playback.closedCaptionsTrackId = trackId
  }

  /**
   * returns a list of the available audio tracks.
   * @type {import('../../base/playback/playback').AudioTrack[]} audio tracks
   */
  get audioTracks() {
    return this.playback.audioTracks
  }

  /**
  * returns the audio track currently in use.
  * @type {import('../../base/playback/playback').AudioTrack} audio track
  */
  get currentAudioTrack() {
    return this.playback.currentAudioTrack
  }

  /**
  * returns the picture-in-picture state.
  * @type {Boolean}
  */
  get isPiPActive() {
    return this.playback.isPiPActive
  }

  /**
   * it builds a container
   * @method constructor
   * @param {Object} options the options object
   * @param {Strings} i18n the internationalization component
   */
  constructor(options, i18n, playerError) {
    super(options)
    this._i18n = i18n
    this.currentTime = 0
    this.volume = 100
    this.playback = options.playback
    this.playerError = playerError
    this.settings = $.extend(true, {}, this.playback.settings)
    this.isReady = false
    this.mediaControlDisabled = false
    this.plugins = [this.playback]
    this.dblTapHandler = new DoubleEventHandler(500)
    this.clickTimer = null
    this.clickDelay = 200 // FIXME: could be a player option
    this.actionsMetadata = {}
    this.bindEvents()
  }

  /**
   * binds playback events to the methods of the container.
   * it listens to playback's events and triggers them as container events.
   *
   * | Playback |
   * |----------|
   * | progress |
   * | timeupdate |
   * | ready |
   * | buffering |
   * | bufferfull |
   * | settingsupdate |
   * | loadedmetadata |
   * | highdefinitionupdate |
   * | bitrate |
   * | playbackstate |
   * | dvr |
   * | mediacontrol_disable |
   * | mediacontrol_enable |
   * | ended |
   * | play |
   * | pause |
   * | error |
   * | pip_enter |
   * | pip_exit |
   *
   * ps: the events usually translate from PLABACK_x to CONTAINER_x, you can check all the events at `Event` class.
   *
   * @method bindEvents
   */
  bindEvents() {
    this.listenTo(this.playback, Events.PLAYBACK_PROGRESS, this.onProgress)
    this.listenTo(this.playback, Events.PLAYBACK_TIMEUPDATE, this.timeUpdated)
    this.listenTo(this.playback, Events.PLAYBACK_READY, this.ready)
    this.listenTo(this.playback, Events.PLAYBACK_BUFFERING, this.onBuffering)
    this.listenTo(this.playback, Events.PLAYBACK_BUFFERFULL, this.bufferfull)
    this.listenTo(this.playback, Events.PLAYBACK_SETTINGSUPDATE, this.settingsUpdate)
    this.listenTo(this.playback, Events.PLAYBACK_LOADEDMETADATA, this.loadedMetadata)
    this.listenTo(this.playback, Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinitionUpdate)
    this.listenTo(this.playback, Events.PLAYBACK_BITRATE, this.updateBitrate)
    this.listenTo(this.playback, Events.PLAYBACK_PLAYBACKSTATE, this.playbackStateChanged)
    this.listenTo(this.playback, Events.PLAYBACK_DVR, this.playbackDvrStateChanged)
    this.listenTo(this.playback, Events.PLAYBACK_MEDIACONTROL_DISABLE, this.disableMediaControl)
    this.listenTo(this.playback, Events.PLAYBACK_MEDIACONTROL_ENABLE, this.enableMediaControl)
    this.listenTo(this.playback, Events.PLAYBACK_SEEK, this.onSeek)
    this.listenTo(this.playback, Events.PLAYBACK_SEEKED, this.onSeeked)
    this.listenTo(this.playback, Events.PLAYBACK_ENDED, this.onEnded)
    this.listenTo(this.playback, Events.PLAYBACK_PLAY, this.playing)
    this.listenTo(this.playback, Events.PLAYBACK_PAUSE, this.paused)
    this.listenTo(this.playback, Events.PLAYBACK_STOP, this.stopped)
    this.listenTo(this.playback, Events.PLAYBACK_ERROR, this.error)
    this.listenTo(this.playback, Events.PLAYBACK_SUBTITLE_AVAILABLE, this.subtitleAvailable)
    this.listenTo(this.playback, Events.PLAYBACK_SUBTITLE_CHANGED, this.subtitleChanged)
    this.listenTo(this.playback, Events.PLAYBACK_AUDIO_AVAILABLE, this.audioAvailable)
    this.listenTo(this.playback, Events.PLAYBACK_AUDIO_CHANGED, this.audioChanged)
    this.listenTo(this.playback, Events.PLAYBACK_PIP_ENTER, this.onEnterPiP)
    this.listenTo(this.playback, Events.PLAYBACK_PIP_EXIT, this.onExitPiP)
  }

  subtitleAvailable() {
    this.trigger(Events.CONTAINER_SUBTITLE_AVAILABLE)
  }

  subtitleChanged(track) {
    this.trigger(Events.CONTAINER_SUBTITLE_CHANGED, track)
  }

  audioAvailable(tracks) {
    this.trigger(Events.CONTAINER_AUDIO_AVAILABLE, tracks)
  }

  audioChanged(track) {
    this.trigger(Events.CONTAINER_AUDIO_CHANGED, track)
  }

  playbackStateChanged(state) {
    this.trigger(Events.CONTAINER_PLAYBACKSTATE, state)
  }

  playbackDvrStateChanged(dvrInUse) {
    this.settings = this.playback.settings
    this.dvrInUse = dvrInUse
    this.trigger(Events.CONTAINER_PLAYBACKDVRSTATECHANGED, dvrInUse)
  }

  updateBitrate(newBitrate) {
    this.trigger(Events.CONTAINER_BITRATE, newBitrate)
  }

  statsReport(metrics) {
    this.trigger(Events.CONTAINER_STATS_REPORT, metrics)
  }

  getPlaybackType() {
    return this.playback.getPlaybackType()
  }

  /**
   * returns `true` if DVR is enable otherwise `false`.
   * @method isDvrEnabled
   * @return {Boolean}
   */
  isDvrEnabled() {
    return !!this.playback.dvrEnabled
  }

  /**
   * returns `true` if DVR is in use otherwise `false`.
   * @method isDvrInUse
   * @return {Boolean}
   */
  isDvrInUse() {
    return !!this.dvrInUse
  }

  /**
   * destroys the container
   * @method destroy
   */
  destroy() {
    this.disableResizeObserver()
    this.trigger(Events.CONTAINER_DESTROYED, this, this.name)
    this.stopListening()
    this.plugins.forEach((plugin) => plugin.destroy())
    this.$el.remove()
    this.undelegateEvents()
  }

  setStyle(style) {
    this.$el.css(style)
  }

  ready() {
    this.isReady = true
    this.trigger(Events.CONTAINER_READY, this.name)
  }

  isPlaying() {
    return this.playback.isPlaying()
  }

  getStartTimeOffset() {
    return this.playback.getStartTimeOffset()
  }

  getCurrentTime() {
    return this.currentTime
  }

  getDuration() {
    return this.playback.getDuration()
  }

  error(error) {
    if (!this.isReady) { this.ready() }

    this.trigger(Events.CONTAINER_ERROR, error, this.name)
  }

  loadedMetadata(metadata) {
    this.trigger(Events.CONTAINER_LOADEDMETADATA, metadata)
  }

  timeUpdated(timeProgress) {
    this.currentTime = timeProgress.current
    this.trigger(Events.CONTAINER_TIMEUPDATE, timeProgress, this.name)
  }

  onProgress(...args) {
    this.trigger(Events.CONTAINER_PROGRESS, ...args, this.name)
  }

  playing() {
    this.trigger(Events.CONTAINER_PLAY, this.name, this.actionsMetadata.playEvent || {})
    this.actionsMetadata.playEvent = {}
  }

  paused() {
    this.trigger(Events.CONTAINER_PAUSE, this.name, this.actionsMetadata.pauseEvent || {})
    this.actionsMetadata.pauseEvent = {}
  }

  stopped() {
    this.trigger(Events.CONTAINER_STOP, this.actionsMetadata.stopEvent || {})
    this.actionsMetadata.stopEvent = {}
  }

  /**
   * plays the playback
   * @method play
   * @param {Object} customData
   */
  play(customData = {}) {
    this.actionsMetadata.playEvent = customData
    this.playback.play(customData)
  }

  /**
   * stops the playback
   * @method stop
   * @param {Object} customData
   */
  stop(customData = {}) {
    this.actionsMetadata.stopEvent = customData
    this.playback.stop(customData)
    this.currentTime = 0
  }

  switchAudioTrack(id) {
    this.playback.switchAudioTrack(id)
  }

  /**
   * pauses the playback
   * @method pause
   * @param {Object} customData
   */
  pause(customData = {}) {
    this.actionsMetadata.pauseEvent = customData
    this.playback.pause(customData)
  }

  onEnded() {
    this.trigger(Events.CONTAINER_ENDED, this, this.name)
    this.currentTime = 0
  }

  clicked() {
    if (!this.options.chromeless || this.options.allowUserInteraction) {
      // The event is delayed because it can be canceled by a double-click event
      // An example of use is to prevent playback from pausing when switching to full screen
      this.clickTimer = setTimeout(() => {
        this.clickTimer && this.trigger(Events.CONTAINER_CLICK, this, this.name)
      }, this.clickDelay)
    }
  }

  cancelClicked() {
    clearTimeout(this.clickTimer)
    this.clickTimer = null
  }

  dblClicked() {
    if (!this.options.chromeless || this.options.allowUserInteraction) {
      this.cancelClicked()
      this.trigger(Events.CONTAINER_DBLCLICK, this, this.name)
    }
  }

  dblTap(evt) {
    if (!this.options.chromeless || this.options.allowUserInteraction) {
      this.dblTapHandler.handle(evt, () => {
        this.cancelClicked()
        this.trigger(Events.CONTAINER_DBLCLICK, this, this.name)
      })
    }
  }

  onContextMenu(event) {
    if (!this.options.chromeless || this.options.allowUserInteraction) { this.trigger(Events.CONTAINER_CONTEXTMENU, event, this.name) }
  }

  seek(time) {
    this.playback.seek(time)
  }

  onSeek(time) {
    this.trigger(Events.CONTAINER_SEEK, time, this.name)
  }

  onSeeked() {
    this.trigger(Events.CONTAINER_SEEKED, this.name)
  }

  seekPercentage(percentage) {
    const duration = this.getDuration()
    if (percentage >= 0 && percentage <= 100) {
      const time = duration * (percentage / 100)
      this.seek(time)
    }
  }

  setVolume(value) {
    this.volume = parseFloat(value)
    this.trigger(Events.CONTAINER_VOLUME, this.volume, this.name)
    this.playback.volume(this.volume)
  }

  fullscreen() {
    this.trigger(Events.CONTAINER_FULLSCREEN, this.name)
  }

  onBuffering() {
    this.trigger(Events.CONTAINER_STATE_BUFFERING, this.name)
  }

  bufferfull() {
    this.trigger(Events.CONTAINER_STATE_BUFFERFULL, this.name)
  }

  onEnterPiP() {
    this.trigger(Events.CONTAINER_PIP_ENTER, this.name)
  }

  onExitPiP() {
    this.trigger(Events.CONTAINER_PIP_EXIT, this.name)
  }

  /**
   * adds plugin to the container
   * @method addPlugin
   * @param {Object} plugin
   */
  addPlugin(plugin) {
    this.plugins.push(plugin)
  }

  /**
   * checks if a plugin, given its name, exist
   * @method hasPlugin
   * @param {String} name
   * @return {Boolean}
   */
  hasPlugin(name) {
    return !!this.getPlugin(name)
  }

  /**
   * get the plugin given its name
   * @method getPlugin
   * @param {String} name
   */
  getPlugin(name) {
    return this.plugins.filter(plugin => plugin.name === name)[0]
  }

  mouseEnter() {
    if (!this.options.chromeless || this.options.allowUserInteraction) { this.trigger(Events.CONTAINER_MOUSE_ENTER) }
  }

  mouseLeave() {
    if (!this.options.chromeless || this.options.allowUserInteraction) { this.trigger(Events.CONTAINER_MOUSE_LEAVE) }
  }

  mouseUp() {
    if (!this.options.chromeless || this.options.allowUserInteraction) { this.trigger(Events.CONTAINER_MOUSE_UP) }
  }

  mouseDown() {
    if (!this.options.chromeless || this.options.allowUserInteraction) { this.trigger(Events.CONTAINER_MOUSE_DOWN) }
  }

  enterPiP() {
    this.playback.enterPiP()
  }

  exitPiP() {
    this.playback.exitPiP()
  }

  settingsUpdate() {
    this.settings = this.playback.settings
    this.trigger(Events.CONTAINER_SETTINGSUPDATE)
  }

  highDefinitionUpdate(isHD) {
    this.trigger(Events.CONTAINER_HIGHDEFINITIONUPDATE, isHD)
  }

  isHighDefinitionInUse() {
    return this.playback.isHighDefinitionInUse()
  }

  disableMediaControl() {
    if (!this.mediaControlDisabled) {
      this.mediaControlDisabled = true
      this.trigger(Events.CONTAINER_MEDIACONTROL_DISABLE)
    }
  }

  enableMediaControl() {
    if (this.mediaControlDisabled) {
      this.mediaControlDisabled = false
      this.trigger(Events.CONTAINER_MEDIACONTROL_ENABLE)
    }
  }

  updateStyle() {
    if (!this.options.chromeless || this.options.allowUserInteraction) { this.$el.removeClass('chromeless') } else { this.$el.addClass('chromeless') }
  }

  enableResizeObserver() {
    this.disableResizeObserver()
    this.resizeObserverInterval = setInterval(() => this.checkResize(), 500)
  }

  disableResizeObserver() {
    this.resizeObserverInterval && clearInterval(this.resizeObserverInterval)
  }

  checkResize() {
    const newSize = { width: this.el.clientWidth, height: this.el.clientHeight }
    const { width, height } = this.currentSize || {}
    const isResize = height !== newSize.height || width !== newSize.width
    if (!isResize) return
    this.currentSize = newSize
    this.trigger(Events.CONTAINER_RESIZE, newSize)
  }

  /**
   * method called before resize the element
   * @method onResize
   * @param {Object} options the options object
   * @return {UIObject} itself
   */
  onResize(options) {
    this.playback.resize(options)
    return this
  }

  /**
   * enables to configure the container after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   * @param {Object} oldOptions previous options
   */
  configure(options, oldOptions) {
    this.trigger(Events.CONTAINER_OPTIONS_WILL_CHANGE, oldOptions)

    this._options = $.extend(true, this._options, options)
    this.updateStyle()
    this.playback.configure(this.options)
    this.trigger(Events.CONTAINER_OPTIONS_CHANGE)
  }

  render() {
    const style = Styler.getStyleFor(ContainerStyle.toString(), { baseUrl: this.options.baseUrl })
    this.$el.append(style[0])
    this.$el.append(this.playback.render().el)
    this.updateStyle()
    this.checkResize()
    this.enableResizeObserver()
    return this
  }
}

Object.assign(Container.prototype, ErrorMixin)
