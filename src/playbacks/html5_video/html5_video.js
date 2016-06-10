// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {seekStringToSeconds} from 'base/utils'

import Playback from 'base/playback'
import template from 'base/template'
import Styler from 'base/styler'
import Browser from 'components/browser'
import Events from 'base/events'
import tagStyle from './public/style.scss'
import sourceHTML from './public/index.html'
import find from 'lodash.find'
import $ from 'clappr-zepto'

const MIMETYPES = {
  'mp4': ['avc1.42E01E', 'avc1.58A01E', 'avc1.4D401E', 'avc1.64001E', 'mp4v.20.8', 'mp4v.20.240', 'mp4a.40.2'].map(
    (codec) => { return 'video/mp4; codecs="' + codec + ', mp4a.40.2"'}),
  'ogg': ['video/ogg; codecs="theora, vorbis"', 'video/ogg; codecs="dirac"', 'video/ogg; codecs="theora, speex"'],
  '3gpp': ['video/3gpp; codecs="mp4v.20.8, samr"'],
  'webm': ['video/webm; codecs="vp8, vorbis"'],
  'mkv': ['video/x-matroska; codecs="theora, vorbis"'],
  'm3u8': ['application/x-mpegurl']
}
MIMETYPES['ogv'] = MIMETYPES['ogg']
MIMETYPES['3gp'] = MIMETYPES['3gpp']

export default class HTML5Video extends Playback {
  get name() { return 'html5_video' }
  get tagName() { return 'video' }
  get template() { return template(sourceHTML) }

  get attributes() {
    return {
      'data-html5-video': ''
    }
  }

  get events() {
    return {
      'canplay': '_onCanPlay',
      'canplaythrough': '_handleBufferingEvents',
      'durationchange': '_onDurationChange',
      'ended': '_onEnded',
      'error': '_onError',
      'loadeddata': '_onLoadedData',
      'loadedmetadata': '_onLoadedMetadata',
      'pause': '_onPause',
      'playing': '_onPlaying',
      'progress': '_onProgress',
      'seeked': '_handleBufferingEvents',
      'seeking': '_handleBufferingEvents',
      'stalled': '_handleBufferingEvents',
      'timeupdate': '_onTimeUpdate',
      'waiting': '_onWaiting'
    }
  }

  /**
   * Determine if the playback has ended.
   * @property ended
   * @type Boolean
   */
  get ended() {
    return this.el.ended
  }

  /**
   * Determine if the playback is having to buffer in order for
   * playback to be smooth.
   * This is related to the PLAYBACK_BUFFERING and PLAYBACK_BUFFERFULL events
   * @property buffering
   * @type Boolean
   */
  get buffering() {
    return !!this._bufferingState
  }

  constructor(options) {
    super(options)
    this._loadStarted = false
    this._playheadMoving = false
    this._playheadMovingTimer = null
    this._stopped = false
    this._options = options
    this._setupSrc(options.src)

    var playbackConfig = (options.playbackConfig || {})
    var preload = playbackConfig.preload || ((Browser.isSafari)?'auto':options.preload)

    $.extend(this.el, {
      loop: options.loop,
      autoplay: options.autoPlay,
      poster: options.poster,
      preload: preload || 'metadata',
      controls: playbackConfig.controls || options.useVideoTagDefaultControls,
      crossOrigin: playbackConfig.crossOrigin
    })

    // TODO should settings be private?
    this.settings = {default: ['seekbar']}
    this.settings.left = ['playpause', 'position', 'duration']
    this.settings.right = ['fullscreen', 'volume', 'hd-indicator']
  }

  /**
   * Sets the source url on the <video> element, and also the 'src' property.
   * @method setupSrc
   * @private
   * @param {String} srcUrl The source URL.
   */
  _setupSrc(srcUrl) {
    this._src = srcUrl
    this.el.src = srcUrl
  }

  _onLoadedMetadata(e) {
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_LOADEDMETADATA, {duration: e.target.duration, data: e})
    this._updateSettings()
    var autoSeekFromUrl = typeof(this._options.autoSeekFromUrl) === 'undefined' || this._options.autoSeekFromUrl
    if (this.getPlaybackType() !== Playback.LIVE && autoSeekFromUrl) {
      this._checkInitialSeek()
    }
  }

  _onDurationChange() {
    this._updateSettings()
    this._onTimeUpdate()
    // onProgress uses the duration
    this._onProgress()
  }

  _updateSettings() {
    // we can't figure out if hls resource is VoD or not until it is being loaded or duration has changed.
    // that's why we check it again and update media control accordingly.
    if (this.getPlaybackType() === Playback.VOD) {
      this.settings.left = ['playpause', 'position', 'duration']
    } else {
      this.settings.left = ['playstop']
    }
    this.settings.seekEnabled = this.isSeekEnabled()
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  isSeekEnabled() {
    return isFinite(this.getDuration())
  }

  getPlaybackType() {
    return [0, undefined, Infinity].indexOf(this.el.duration) >= 0 ? Playback.LIVE : Playback.VOD
  }

  isHighDefinitionInUse() {
    return false
  }

  play() {
    this.trigger(Events.PLAYBACK_PLAY_INTENT)
    this._stopped = false
    this._handleBufferingEvents()
    this.el.play()
  }

  pause() {
    this.el.pause()
  }

  stop() {
    this.pause()
    this._stopped = true
    this.el.currentTime = 0
    this._stopPlayheadMovingChecks()
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_STOP)
  }

  volume(value) {
    this.el.volume = value / 100
  }

  mute() {
    this.el.volume = 0
  }

  unmute() {
    this.el.volume = 1
  }

  isMuted() {
    return !!this.el.volume
  }

  isPlaying() {
    return !this.el.paused && !this.el.ended
  }

  get isReady() {
    return this._isReadyState
  }

  _startPlayheadMovingChecks() {
    if (this._playheadMovingTimer !== null) {
      return
    }
    this._playheadMovingTimeOnCheck = null
    this._determineIfPlayheadMoving()
    this._playheadMovingTimer = setInterval(this._determineIfPlayheadMoving.bind(this), 500)
  }

  _stopPlayheadMovingChecks() {
    if (this._playheadMovingTimer === null) {
      return
    }
    clearInterval(this._playheadMovingTimer)
    this._playheadMovingTimer = null
    this._playheadMoving = false
  }

  _determineIfPlayheadMoving() {
    var before = this._playheadMovingTimeOnCheck
    var now = this.el.currentTime
    this._playheadMoving = before !== now
    this._playheadMovingTimeOnCheck = now
    this._handleBufferingEvents()
  }

  // this seems to happen when the user is having to wait
  // for something to happen AFTER A USER INTERACTION
  // e.g the player might be buffering, but when `play()` is called
  // only at this point will this be called.
  // Or the user may seek somewhere but the new area requires buffering,
  // so it will fire then as well.
  // On devices where playing is blocked until requested with a user action,
  // buffering may start, but never finish until the user initiates a play,
  // but this only happens when play is actually requested
  _onWaiting() {
    this._loadStarted = true
    this._handleBufferingEvents()
  }

  // called after the first frame has loaded
  // note this doesn't fire on ios before the user has requested play
  // ideally the "loadstart" event would be used instead, but this fires
  // before a user has requested play on iOS, and also this is always fired
  // even if the preload setting is "none". In both these cases this causes
  // infinite buffering until the user does something which isn't great.
  _onLoadedData() {
    this._loadStarted = true
    this._handleBufferingEvents()
  }

  // note this doesn't fire on ios before user has requested play
  _onCanPlay() {
    this._handleBufferingEvents()
  }

  _onPlaying() {
    this._startPlayheadMovingChecks()
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_PLAY)
  }

  _onPause() {
    this._stopPlayheadMovingChecks()
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_PAUSE)
  }

  _onEnded() {
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_ENDED, this.name)
  }

  // The playback should be classed as buffering if the following are true:
  // - the ready state is less then HAVE_FUTURE_DATA or the playhead isn't moving and it should be
  // - the media hasn't "ended",
  // - the media hasn't been stopped
  // - loading has started
  _handleBufferingEvents() {
    var playheadShouldBeMoving = !this.el.ended && !this.el.paused
    var buffering = this._loadStarted && !this.el.ended && !this.stopped && ((playheadShouldBeMoving && !this._playheadMoving) || this.el.readyState < this.el.HAVE_FUTURE_DATA)
    if (this._bufferingState !== buffering) {
      this._bufferingState = buffering
      if (buffering) {
        this.trigger(Events.PLAYBACK_BUFFERING, this.name)
      }
      else {
        this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
      }
    }
  }

  _onError() {
    this.trigger(Events.PLAYBACK_ERROR, this.el.error, this.name)
  }

  destroy() {
    this.$el.remove()
    this.el.src = ''
    this._src = null
  }

  seek(time) {
    this.el.currentTime = time
  }

  seekPercentage(percentage) {
    var time = this.el.duration * (percentage / 100)
    this.seek(time)
  }

  _checkInitialSeek() {
    var seekTime = seekStringToSeconds(window.location.href)
    if (seekTime !== 0) {
      this.seek(seekTime)
    }
  }

  getCurrentTime() {
    return this.el.currentTime
  }

  getDuration() {
    return this.el.duration
  }

  _onTimeUpdate() {
    this._handleBufferingEvents()
    if (this.getPlaybackType() === Playback.LIVE) {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 1, total: 1}, this.name)
    } else {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: this.el.currentTime, total: this.el.duration}, this.name)
    }
  }

  _onProgress() {
    if (!this.el.buffered.length) {
      return
    }
    var bufferedPos = 0
    for (var i = 0;  i < this.el.buffered.length; i++) {
      if (this.el.currentTime >= this.el.buffered.start(i) && this.el.currentTime <= this.el.buffered.end(i)) {
        bufferedPos = i
        break
      }
    }
    this.trigger(Events.PLAYBACK_PROGRESS, {
      start: this.el.buffered.start(bufferedPos),
      current: this.el.buffered.end(bufferedPos),
      total: this.el.duration
    })
  }

  _typeFor(src) {
    var resourceParts = src.split('?')[0].match(/.*\.(.*)$/) || []
    var isHls = resourceParts.length > 1 && resourceParts[1] === 'm3u8'
    return isHls ? 'application/vnd.apple.mpegurl' : 'video/mp4'
  }

  _ready() {
    if (this._isReadyState) {
      return
    }
    this._isReadyState = true
    this.trigger(Events.PLAYBACK_READY, this.name)
  }

  render() {
    var style = Styler.getStyleFor(tagStyle)

    this._src && this.$el.html(this.template({ src: this._src, type: this._typeFor(this._src) }))

    if (this._options.useVideoTagDefaultControls) {
      this.$el.attr('controls', 'controls')
    }

    if (this._options.disableVideoTagContextMenu) {
      this.$el.on('contextmenu', () => {
        return false
      })
    }

    this.$el.append(style)
    this._ready()
    return this
  }
}

HTML5Video._canPlay = function(type, mimeTypesByExtension, resourceUrl, mimeType) {
  var extension = (resourceUrl.split('?')[0].match(/.*\.(.*)$/) || [])[1]
  var mimeTypes = mimeType || mimeTypesByExtension[extension] || []
  mimeTypes = (mimeTypes.constructor === Array) ? mimeTypes : [mimeTypes]

  var media = document.createElement(type)
  return !!find(mimeTypes, (mediaType) => !!media.canPlayType(mediaType).replace(/no/, ''))
}

HTML5Video.canPlay = function(resourceUrl, mimeType) {
  return HTML5Video._canPlay('video', MIMETYPES, resourceUrl, mimeType)
}

module.exports = HTML5Video
