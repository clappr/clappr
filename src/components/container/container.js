// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * Container is responsible for the video rendering and state
 */

import Events from '../../base/events'
import UIObject from '../../base/ui_object'
import ErrorMixin from '../../base/error_mixin'

import './public/style.scss'

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
      'mouseleave': 'mouseLeave'
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
    this.settings = $.extend({}, this.playback.settings)
    this.isReady = false
    this.mediaControlDisabled = false
    this.plugins = [this.playback]
    this.dblTapTimer = null
    this.dblTapLast = 0
    this.dblTapDelay = 500 // FIXME: could be a player option
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
   *
   * ps: the events usually translate from PLABACK_x to CONTAINER_x, you can check all the events at `Event` class.
   *
   * @method bindEvents
   */
  bindEvents() {
    this.listenTo(this.playback, Events.PLAYBACK_PROGRESS, this.progress)
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
    this.listenTo(this.playback, Events.PLAYBACK_SEEKED, this.onSeeked)
    this.listenTo(this.playback, Events.PLAYBACK_ENDED, this.onEnded)
    this.listenTo(this.playback, Events.PLAYBACK_PLAY, this.playing)
    this.listenTo(this.playback, Events.PLAYBACK_PAUSE, this.paused)
    this.listenTo(this.playback, Events.PLAYBACK_STOP, this.stopped)
    this.listenTo(this.playback, Events.PLAYBACK_ERROR, this.error)
    this.listenTo(this.playback, Events.PLAYBACK_SUBTITLE_AVAILABLE, this.subtitleAvailable)
    this.listenTo(this.playback, Events.PLAYBACK_SUBTITLE_CHANGED, this.subtitleChanged)
  }

  subtitleAvailable() {
    this.trigger(Events.CONTAINER_SUBTITLE_AVAILABLE)
  }

  subtitleChanged(track) {
    this.trigger(Events.CONTAINER_SUBTITLE_CHANGED, track)
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
    this.trigger(Events.CONTAINER_DESTROYED, this, this.name)
    this.stopListening()
    this.plugins.forEach((plugin) => plugin.destroy())
    this.$el.remove()
  }

  setStyle(style) {
    this.$el.css(style)
  }

  animate(style, duration) {
    return this.$el.animate(style, duration).promise()
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
    if (!this.isReady)
      this.ready()

    this.trigger(Events.CONTAINER_ERROR, error, this.name)
  }

  loadedMetadata(metadata) {
    this.trigger(Events.CONTAINER_LOADEDMETADATA, metadata)
  }

  timeUpdated(timeProgress) {
    this.currentTime = timeProgress.current
    this.trigger(Events.CONTAINER_TIMEUPDATE, timeProgress, this.name)
  }

  progress(...args) {
    this.trigger(Events.CONTAINER_PROGRESS, ...args, this.name)
  }

  playing() {
    this.trigger(Events.CONTAINER_PLAY, this.name)
  }

  paused() {
    this.trigger(Events.CONTAINER_PAUSE, this.name)
  }

  /**
   * plays the playback
   * @method play
   */
  play() {
    this.playback.play()
  }

  /**
   * stops the playback
   * @method stop
   */
  stop() {
    this.playback.stop()
    this.currentTime = 0
  }

  /**
   * pauses the playback
   * @method pause
   */
  pause() {
    this.playback.pause()
  }

  onEnded() {
    this.trigger(Events.CONTAINER_ENDED, this, this.name)
    this.currentTime = 0
  }

  stopped() {
    this.trigger(Events.CONTAINER_STOP)
  }

  clicked() {
    if (!this.options.chromeless || this.options.allowUserInteraction)
      this.trigger(Events.CONTAINER_CLICK, this, this.name)

  }

  dblClicked() {
    if (!this.options.chromeless || this.options.allowUserInteraction)
      this.trigger(Events.CONTAINER_DBLCLICK, this, this.name)

  }

  dblTap(evt) {
    if (!this.options.chromeless || this.options.allowUserInteraction) {
      // Based on http://jsfiddle.net/brettwp/J4djY/
      let currentTime = new Date().getTime()
      let tapLength = currentTime - this.dblTapLast
      clearTimeout(this.dblTapTimer)

      if (tapLength < this.dblTapDelay && tapLength > 0) {
        this.trigger(Events.CONTAINER_DBLCLICK, this, this.name)
        evt.preventDefault()
      } else {
        this.dblTapTimer = setTimeout(() => {
          clearTimeout(this.dblTapTimer)
        }, this.dblTapDelay)
      }

      this.dblTapLast = currentTime
    }
  }

  onContextMenu(event) {
    if (!this.options.chromeless || this.options.allowUserInteraction)
      this.trigger(Events.CONTAINER_CONTEXTMENU, event, this.name)

  }

  seek(time) {
    this.trigger(Events.CONTAINER_SEEK, time, this.name)
    this.playback.seek(time)
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
    this.volume = parseInt(value, 10)
    this.trigger(Events.CONTAINER_VOLUME, value, this.name)
    this.playback.volume(value)
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
    if (!this.options.chromeless || this.options.allowUserInteraction)
      this.trigger(Events.CONTAINER_MOUSE_ENTER)

  }

  mouseLeave() {
    if (!this.options.chromeless || this.options.allowUserInteraction)
      this.trigger(Events.CONTAINER_MOUSE_LEAVE)

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
    if (!this.options.chromeless || this.options.allowUserInteraction)
      this.$el.removeClass('chromeless')
    else
      this.$el.addClass('chromeless')

  }

  /**
   * enables to configure the container after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   */
  configure(options) {
    this._options = $.extend(this._options, options)
    this.updateStyle()
    this.playback.configure(this.options)
    this.trigger(Events.CONTAINER_OPTIONS_CHANGE)
  }

  render() {
    this.$el.append(this.playback.render().el)
    this.updateStyle()
    return this
  }
}

Object.assign(Container.prototype, ErrorMixin)
