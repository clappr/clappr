// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import $ from 'clappr-zepto'
import { uniqueId, currentScriptUrl } from '../../utils/utils'
import BaseObject from '../../base/base_object/base_object'
import Events from '../../base/events/events'
import Browser from '../browser/browser'
import CoreFactory from '../core_factory/core_factory'
import Loader from '../loader/loader'
import ErrorMixin from '../../base/error_mixin/error_mixin'

const baseUrl = currentScriptUrl().replace(/\/[^/]+$/, '')

/**
 * @class Player
 * @constructor
 * @extends BaseObject
 * @module components
 * @example
 * ### Using the Player
 *
 * Add the following script on your HTML:
 * ```html
 * <head>
 *   <script type="text/javascript" src="http://cdn.clappr.io/latest/clappr.min.js"></script>
 * </head>
 * ```
 * Now, create the player:
 * ```html
 * <body>
 *   <div id="player"></div>
 *   <script>
 *     var player = new Clappr.Player({source: "http://your.video/here.mp4", parentId: "#player"});
 *   </script>
 * </body>
 * ```
 */
export default class Player extends BaseObject {
  set loader(loader) { this._loader = loader }
  get loader() {
    if (!this._loader) { this._loader = new Loader(this.options.plugins || {}, this.options.playerId) }

    return this._loader
  }

  /**
   * Determine if the playback has ended.
   * @property ended
   * @type Boolean
   */
  get ended() {
    return this.core.activeContainer.ended
  }

  /**
   * Determine if the playback is having to buffer in order for
   * playback to be smooth.
   * (i.e if a live stream is playing smoothly, this will be false)
   * @property buffering
   * @type Boolean
   */
  get buffering() {
    return this.core.activeContainer.buffering
  }

  /*
   * determine if the player is ready.
   * @property isReady
   * @type {Boolean} `true` if the player is ready. ie PLAYER_READY event has fired
   */
  get isReady() {
    return !!this._ready
  }

  /**
   * An events map that allows the user to add custom callbacks in player's options.
   * @property eventsMapping
   * @type {Object}
   */
  get eventsMapping() {
    return {
      onReady: Events.PLAYER_READY,
      onResize: Events.PLAYER_RESIZE,
      onPlay: Events.PLAYER_PLAY,
      onPause: Events.PLAYER_PAUSE,
      onStop: Events.PLAYER_STOP,
      onEnded: Events.PLAYER_ENDED,
      onSeek: Events.PLAYER_SEEK,
      onError: Events.PLAYER_ERROR,
      onTimeUpdate: Events.PLAYER_TIMEUPDATE,
      onVolumeUpdate: Events.PLAYER_VOLUMEUPDATE,
      onSubtitleAvailable: Events.PLAYER_SUBTITLE_AVAILABLE
    }
  }

  /**
   * @typedef {Object} PlaybackConfig
   * @prop {boolean} disableContextMenu
   * disables the context menu (right click) on the video element if a HTML5Video playback is used.
   * @prop {boolean} preload
   * video will be preloaded according to `preload` attribute options **default**: `'metadata'`
   * @prop {boolean} controls
   * enabled/disables displaying controls
   * @prop {boolean} crossOrigin
   * enables cross-origin capability for media-resources
   * @prop {boolean} playInline
   * enables in-line video elements
   * @prop {boolean} audioOnly
   * enforce audio-only playback (when possible)
   * @prop {Object} externalTracks
   * pass externaly loaded track to playback
   * @prop {Number} [maxBufferLength]
   * The default behavior for the **HLS playback** is to keep buffering indefinitely, even on VoD.
   * This replicates the behavior for progressive download, which continues buffering when pausing the video, thus making the video available for playback even on slow networks.
   * To change this behavior use `maxBufferLength` where **value is in seconds**.
   * @prop {Number} [maxBackBufferLength]
   * After how much distance of the playhead data should be pruned from the buffer (influences memory consumption
   * of adaptive media-engines like Hls.js or Shaka)
   * @prop {Number} [minBufferLength]
   * After how much data in the buffer at least we attempt to consume it (influences QoS-related behavior
   * of adaptive media-engines like Hls.js or Shaka). If this is too low, and the available bandwidth is varying a lot
   * and too close to the streamed bitrate, we may continuously hit under-runs.
   * @prop {Number} [initialBandwidthEstimate]
   * define an initial bandwidth "guess" (or previously stored/established value) for underlying adaptive-bitreate engines
   * of adaptive playback implementations, like Hls.js or Shaka
   * @prop {Number} [maxAdaptiveBitrate]
   * Limits the streamed bitrate (for adaptive media-engines in underlying playback implementations)
   * @prop {Object} [maxAdaptiveVideoDimensions]
   * Limits the video dimensions in adaptive media-engines. Should be a literal object with `height` and `width`.
   * @prop {Boolean}[enableAutomaticABR] **default**: `true`
   * Allows to enable/disable automatic bitrate switching in adaptive media-engines
   * @prop {String} [preferredTextLanguage] **default**: `'pt-BR'`
   * Allows to set a preferred text language, that may be enabled by the media-engine if available.
   * @prop {String} [preferredAudioLanguage] **default**: `'pt-BR'`
   * Allows to set a preferred audio language, that may be enabled by the media-engine if available.
   */

  /**
   * ## Player's constructor
   *
   * You might pass the options object to build the player.
   * ```javascript
   * var options = {source: "http://example.com/video.mp4", param1: "val1"};
   * var player = new Clappr.Player(options);
   * ```
   *
   * @method constructor
   * @param {Object} options Data
   * options to build a player instance
   * @param {Number} [options.width]
   * player's width **default**: `640`
   * @param {Number} [options.height]
   * player's height **default**: `360`
   * @param {String} [options.parentId]
   * the id of the element on the page that the player should be inserted into
   * @param {Object} [options.parent]
   * a reference to a dom element that the player should be inserted into
   * @param {String} [options.source]
   * The media source URL, or {source: <<source URL>>, mimeType: <<source mime type>>}
   * @param {Object} [options.sources]
   * An array of media source URL's, or an array of {source: <<source URL>>, mimeType: <<source mime type>>}
   * @param {Boolean} [options.autoPlay]
   * automatically play after page load **default**: `false`
   * @param {Boolean} [options.loop]
   * automatically replay after it ends **default**: `false`
   * @param {Boolean} [options.chromeless]
   * player acts in chromeless mode **default**: `false`
   * @param {Boolean} [options.allowUserInteraction]
   * whether or not the player should handle click events when in chromeless mode **default**: `false` on desktops browsers, `true` on mobile.
   * @param {Boolean} [options.disableKeyboardShortcuts]
   * disable keyboard shortcuts. **default**: `false`. `true` if `allowUserInteraction` is `false`.
   * @param {Boolean} [options.mute]
   * start the video muted **default**: `false`
   * @param {String} [options.mimeType]
   * add `mimeType: "application/vnd.apple.mpegurl"` if you need to use a url without extension.
   * @param {Boolean} [options.actualLiveTime]
   * show duration and seek time relative to actual time.
   * @param {String} [options.actualLiveServerTime]
   * specify server time as a string, format: "2015/11/26 06:01:03". This option is meant to be used with actualLiveTime.
   * @param {Boolean} [options.persistConfig]
   * persist player's settings (volume) through the same domain **default**: `true`
   * @param {String} [options.preload] @deprecated
   * video will be preloaded according to `preload` attribute options **default**: `'metadata'`
   * @param {Number} [options.maxBufferLength] @deprecated
   * the default behavior for the **HLS playback** is to keep buffering indefinitely, even on VoD.
   * This replicates the behavior for progressive download, which continues buffering when pausing the video, thus making the video available for playback even on slow networks.
   * To change this behavior use `maxBufferLength` where **value is in seconds**.
   * @param {String} [options.gaAccount]
   * enable Google Analytics events dispatch **(play/pause/stop/buffering/etc)** by adding your `gaAccount`
   * @param {String} [options.gaTrackerName]
   * besides `gaAccount` you can optionally, pass your favorite trackerName as `gaTrackerName`
   * @param {Object} [options.mediacontrol]
   * customize control bar colors, example: `mediacontrol: {seekbar: "#E113D3", buttons: "#66B2FF"}`
   * @param {Boolean} [options.hideMediaControl]
   * control media control auto hide **default**: `true`
   * @param {Boolean} [options.hideVolumeBar]
   * when embedded with width less than 320, volume bar will hide. You can force this behavior for all sizes by adding `true` **default**: `false`
   * @param {String} [options.watermark]
   * put `watermark: 'http://url/img.png'` on your embed parameters to automatically add watermark on your video.
   * You can customize corner position by defining position parameter. Positions can be `bottom-left`, `bottom-right`, `top-left` and `top-right`.
   * @param {String} [options.watermarkLink]
   * `watermarkLink: 'http://example.net/'` - define URL to open when the watermark is clicked. If not provided watermark will not be clickable.
   * @param {Boolean} [options.disableVideoTagContextMenu] @deprecated
   * disables the context menu (right click) on the video element if a HTML5Video playback is used.
   * @param {Boolean} [options.autoSeekFromUrl]
   * Automatically seek to the seconds provided in the url (e.g example.com?t=100) **default**: `true`
   * @param {Boolean} [options.exitFullscreenOnEnd]
   * Automatically exit full screen when the media finishes. **default**: `true`
   * @param {String} [options.poster]
   * define a poster by adding its address `poster: 'http://url/img.png'`. It will appear after video embed, disappear on play and go back when user stops the video.
   * @param {String} [options.playbackNotSupportedMessage]
   * define a custom message to be displayed when a playback is not supported.
   * @param {Object} [options.events]
   * Specify listeners which will be registered with their corresponding player events.
   * E.g. onReady -> "PLAYER_READY", onTimeUpdate -> "PLAYER_TIMEUPDATE"
   * @param {PlaybackConfig} [options.playback]
   * Generic `Playback` component related configuration
   * @param {Boolean} [options.disableErrorScreen]
   * disables the error screen plugin.
   * @param {Number} [options.autoPlayTimeout]
   * autoplay check timeout.
   */

  constructor(options) {
    super(options)
    const playbackDefaultOptions = { recycleVideo: true }
    const defaultOptions = {
      playerId: uniqueId(''),
      persistConfig: true,
      width: 640,
      height: 360,
      baseUrl: baseUrl,
      allowUserInteraction: Browser.isMobile,
      includeResetStyle: true,
      playback: playbackDefaultOptions
    }
    this._options = $.extend(true, defaultOptions, options)
    this.options.sources = this._normalizeSources(options)
    if (!this.options.chromeless) {
      // "allowUserInteraction" cannot be false if not in chromeless mode.
      this.options.allowUserInteraction = true
    }
    if (!this.options.allowUserInteraction) {
      // if user iteraction is not allowed ensure keyboard shortcuts are disabled
      this.options.disableKeyboardShortcuts = true
    }
    this._registerOptionEventListeners(this.options.events)
    this._coreFactory = new CoreFactory(this)
    const parentElement = this._getParentElement(this.options)
    parentElement && this.attachTo(parentElement)
  }

  /**
   * Returns the parent element
   * @param {String} parentId
   * @param {Object} parent
   * @returns {Object} the parent element
   */
  _getParentElement({ parentId, parent }) {
    if (parentId) return document.querySelector(parentId)
    return parent
  }

  /**
   * You can use this method to attach the player to a given element. You don't need to do this when you specify it during the player instantiation passing the `parentId` param.
   * @method attachTo
   * @param {Object} element a given element.
   * @return {Player} itself
   */
  attachTo(element) {
    this.options.parentElement = element
    this.core = this._coreFactory.create()
    this._addEventListeners()
    return this
  }

  _addEventListeners() {
    if (!this.core.isReady) { this.listenToOnce(this.core, Events.CORE_READY, this._onReady) } else { this._onReady() }

    this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, this._containerChanged)
    this.listenTo(this.core, Events.CORE_FULLSCREEN, this._onFullscreenChange)
    this.listenTo(this.core, Events.CORE_RESIZE, this._onResize)
    return this
  }

  _addContainerEventListeners() {
    const container = this.core.activeContainer
    if (container) {
      this.listenTo(container, Events.CONTAINER_PLAY, this._onPlay)
      this.listenTo(container, Events.CONTAINER_PAUSE, this._onPause)
      this.listenTo(container, Events.CONTAINER_STOP, this._onStop)
      this.listenTo(container, Events.CONTAINER_ENDED, this._onEnded)
      this.listenTo(container, Events.CONTAINER_SEEK, this._onSeek)
      this.listenTo(container, Events.CONTAINER_ERROR, this._onError)
      this.listenTo(container, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate)
      this.listenTo(container, Events.CONTAINER_VOLUME, this._onVolumeUpdate)
      this.listenTo(container, Events.CONTAINER_SUBTITLE_AVAILABLE, this._onSubtitleAvailable)
    }
    return this
  }

  _registerOptionEventListeners(newEvents = {}, events = {}) {
    const hasNewEvents = Object.keys(newEvents).length > 0
    hasNewEvents && Object.keys(events).forEach((userEvent) => {
      const eventType = this.eventsMapping[userEvent]
      eventType && this.off(eventType, events[userEvent])
    })

    Object.keys(newEvents).forEach((userEvent) => {
      const eventType = this.eventsMapping[userEvent]
      if (eventType) {
        let eventFunction = newEvents[userEvent]
        eventFunction = typeof eventFunction === 'function' && eventFunction
        eventFunction && this.on(eventType, eventFunction)
      }
    })
    return this
  }

  _containerChanged() {
    this.stopListening()
    this._addEventListeners()
  }

  _onReady() {
    this._ready = true
    this._addContainerEventListeners()
    this.trigger(Events.PLAYER_READY)
  }

  _onFullscreenChange(fullscreen) {
    this.trigger(Events.PLAYER_FULLSCREEN, fullscreen)
  }

  _onVolumeUpdate(volume) {
    this.trigger(Events.PLAYER_VOLUMEUPDATE, volume)
  }

  _onSubtitleAvailable() {
    this.trigger(Events.PLAYER_SUBTITLE_AVAILABLE)
  }

  _onResize(size) {
    this.trigger(Events.PLAYER_RESIZE, size)
  }

  _onPlay(_, eventMetadata = {}) {
    this.trigger(Events.PLAYER_PLAY, eventMetadata)
  }

  _onPause(_, eventMetadata = {}) {
    this.trigger(Events.PLAYER_PAUSE, eventMetadata)
  }

  _onStop(eventMetadata = {}) {
    this.trigger(Events.PLAYER_STOP, this.getCurrentTime(), eventMetadata)
  }

  _onEnded() {
    this.trigger(Events.PLAYER_ENDED)
  }

  _onSeek(time) {
    this.trigger(Events.PLAYER_SEEK, time)
  }

  _onTimeUpdate(timeProgress) {
    this.trigger(Events.PLAYER_TIMEUPDATE, timeProgress)
  }

  _onError(error) {
    this.trigger(Events.PLAYER_ERROR, error)
  }

  _normalizeSources(options) {
    const sources = options.sources || (options.source !== undefined ? [options.source] : [])
    return sources.length === 0 ? [{ source: '', mimeType: '' }] : sources
  }

  /**
   * resizes the current player canvas.
   * @method resize
   * @param {Object} size should be a literal object with `height` and `width`.
   * @return {Player} itself
   * @example
   * ```javascript
   * player.resize({height: 360, width: 640})
   * ```
   */
  resize(size) {
    this.core.resize(size)
    return this
  }

  /**
   * loads a new source.
   * @method load
   * @param {Array|String} sources source or sources of video.
   * An array item can be a string or {source: <<source URL>>, mimeType: <<source mime type>>}
   * @param {String} mimeType a mime type, example: `'application/vnd.apple.mpegurl'`
   * @param {Boolean} [autoPlay=false] whether playing should be started immediately
   * @return {Player} itself
   */
  load(sources, mimeType, autoPlay) {
    if (autoPlay !== undefined) { this.configure({ autoPlay: !!autoPlay }) }

    this.core.load(sources, mimeType)
    return this
  }

  /**
   * destroys the current player and removes it from the DOM.
   * @method destroy
   * @return {Player} itself
   */
  destroy() {
    this.stopListening()
    this.core.destroy()
    return this
  }

  /**
   * Gives user consent to playback. Required by mobile device after a click event before Player.load().
   * @method consent
   * @param {Function} callback function called when current playback is consented
   * @example
   * ```javascript
   * player.consent(function() { doSomethingNext(); });
   * ```
   */
  consent(cb) {
    this.core.getCurrentPlayback().consent(cb)
  }

  /**
   * plays the current video (`source`).
   * @method play
   * @param {Object} customData
   * @return {Player} itself
   */
  play(customData = {}) {
    this.core.activeContainer.play(customData)
    return this
  }

  /**
   * pauses the current video (`source`).
   * @method pause
   * @param {Object} customData
   * @return {Player} itself
   */
  pause(customData = {}) {
    this.core.activeContainer.pause(customData)
    return this
  }

  /**
   * stops the current video (`source`).
   * @method stop
   * @param {Object} customData
   * @return {Player} itself
   */
  stop(customData = {}) {
    this.core.activeContainer.stop(customData)
    return this
  }

  /**
   * seeks the current video (`source`). For example, `player.seek(120)` will seek to second 120 (2minutes) of the current video.
   * @method seek
   * @param {Number} time should be a number between 0 and the video duration.
   * @return {Player} itself
   */
  seek(time) {
    this.core.activeContainer.seek(time)
    return this
  }

  /**
   * seeks the current video (`source`). For example, `player.seek(50)` will seek to the middle of the current video.
   * @method seekPercentage
   * @param {Number} time should be a number between 0 and 100.
   * @return {Player} itself
   */
  seekPercentage(percentage) {
    this.core.activeContainer.seekPercentage(percentage)
    return this
  }

  /**
   * mutes the current video (`source`).
   * @method mute
   * @return {Player} itself
   */
  mute() {
    this.core.activePlayback.mute()
    return this
  }

  /**
   * unmutes the current video (`source`).
   * @method unmute
   * @return {Player} itself
   */
  unmute() {
    this.core.activePlayback.unmute()
    return this
  }

  /**
   * checks if the player is playing.
   * @method isPlaying
   * @return {Boolean} `true` if the current source is playing, otherwise `false`
   */
  isPlaying() {
    return this.core.activeContainer.isPlaying()
  }

  /**
   * returns `true` if DVR is enable otherwise `false`.
   * @method isDvrEnabled
   * @return {Boolean}
   */
  isDvrEnabled() {
    return this.core.activeContainer.isDvrEnabled()
  }

  /**
   * returns `true` if DVR is in use otherwise `false`.
   * @method isDvrInUse
   * @return {Boolean}
   */
  isDvrInUse() {
    return this.core.activeContainer.isDvrInUse()
  }

  /**
   * enables to configure a player after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   * @return {Player} itself
   */
  configure(options = {}) {
    this._registerOptionEventListeners(options.events, this.options.events)
    this.core.configure(options)
    return this
  }

  /**
   * get a plugin by its name.
   * @method getPlugin
   * @param {String} name of the plugin.
   * @return {Object} the plugin instance
   * @example
   * ```javascript
   * var poster = player.getPlugin('poster');
   * poster.hidePlayButton();
   * ```
   */
  getPlugin(name) {
    const plugins = this.core.plugins.concat(this.core.activeContainer.plugins)
    return plugins.filter(plugin => plugin.name === name)[0]
  }

  /**
   * the current time in seconds.
   * @method getCurrentTime
   * @return {Number} current time (in seconds) of the current source
   */
  getCurrentTime() {
    return this.core.activeContainer.getCurrentTime()
  }

  /**
   * The time that "0" now represents relative to when playback started.
   * For a stream with a sliding window this will increase as content is
   * removed from the beginning.
   * @method getStartTimeOffset
   * @return {Number} time (in seconds) that time "0" represents.
   */
  getStartTimeOffset() {
    return this.core.activeContainer.getStartTimeOffset()
  }

  /**
   * the duration time in seconds.
   * @method getDuration
   * @return {Number} duration time (in seconds) of the current source
   */
  getDuration() {
    return this.core.activeContainer.getDuration()
  }
}

Object.assign(Player.prototype, ErrorMixin)
