// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Playback = require('playback')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')
var _ = require("underscore")
var Mediator = require('mediator')
var Browser = require('browser')

var objectIE = '<object type="application/x-shockwave-flash" id="<%= cid %>" class="hls-playback" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" data-hls="" width="100%" height="100%"><param name="movie" value="<%= swfPath %>"> <param name="quality" value="autohigh"> <param name="swliveconnect" value="true"> <param name="allowScriptAccess" value="always"> <param name="bgcolor" value="#001122"> <param name="allowFullScreen" value="false"> <param name="wmode" value="transparent"> <param name="tabindex" value="1"> <param name=FlashVars value="playbackId=<%= playbackId %>" /> </object>'

class HLS extends Playback {
  get name() { return 'hls' }
  get tagName() { return 'object' }
  get template() { return JST.hls }
  get attributes() {
    return {
      'class': 'hls-playback',
      'data-hls': '',
      'type': 'application/x-shockwave-flash'
    }
  }

  constructor(options) {
    super(options)
    this.src = options.src
    this.swfPath = (options.swfBasepath ||
            "http://cdn.clappr.io/latest/assets") + "/HLSPlayer.swf"
    this.flushLiveURLCache = (options.flushLiveURLCache === undefined)? true: options.flushLiveURLCache
    this.capLevelToStage = (options.capLevelToStage === undefined)? false: options.capLevelToStage
    this.highDefinition = false
    this.autoPlay = options.autoPlay
    this.defaultSettings = {
      left: ["playstop"],
      default: ['seekbar'],
      right: ["fullscreen", "volume", "hd-indicator"],
      seekEnabled: false
    }
    this.settings = _.extend({}, this.defaultSettings)
    this.playbackType = 'live'
    this.addListeners()
  }

  addListeners() {
    Mediator.on(this.uniqueId + ':flashready', () => this.bootstrap())
    Mediator.on(this.uniqueId + ':timeupdate', () => this.updateTime())
    Mediator.on(this.uniqueId + ':playbackstate', (state) => this.setPlaybackState(state))
    Mediator.on(this.uniqueId + ':highdefinition', (isHD) => this.updateHighDefinition(isHD))
    Mediator.on(this.uniqueId + ':playbackerror', () => this.flashPlaybackError())
  }

  stopListening() {
    super()
    Mediator.off(this.uniqueId + ':flashready')
    Mediator.off(this.uniqueId + ':timeupdate')
    Mediator.off(this.uniqueId + ':playbackstate')
    Mediator.off(this.uniqueId + ':highdefinition')
    Mediator.off(this.uniqueId + ':playbackerror')
  }

  bootstrap() {
    this.el.width = "100%"
    this.el.height = "100%"
    this.isReady = true
    this.trigger('playback:ready', this.name)
    this.currentState = "IDLE"
    this.setFlashSettings()
    this.autoPlay && this.play()
  }

  setFlashSettings() {
    this.el.globoPlayerSetflushLiveURLCache(this.flushLiveURLCache)
    this.el.globoPlayerCapLeveltoStage(this.capLevelToStage)
    this.el.globoPlayerSetmaxBufferLength(0)
  }

  updateHighDefinition(isHD) {
    this.highDefinition = (isHD === "true");
    this.trigger('playback:highdefinitionupdate')
    this.trigger('playback:bitrate', {'bitrate': this.getCurrentBitrate()})
  }

  updateTime() {
    var duration = this.getDuration()
    var position = Math.min(Math.max(this.el.globoGetPosition(), 0), duration)
    var previousDVRStatus = this.dvrEnabled
    var livePlayback = (this.playbackType === 'live')
    this.dvrEnabled = (livePlayback && duration > 240)

    if (duration === 100 || livePlayback === undefined) {
      return;
    }

    if (this.dvrEnabled !== previousDVRStatus) {
      this.updateSettings()
      this.trigger('playback:settingsupdate', this.name)
    }

    if (livePlayback && (!this.dvrEnabled || !this.dvrInUse)) {
      position = duration
    }

    this.trigger('playback:timeupdate', position, duration, this.name)
  }

  play() {
    if(this.currentState === 'PAUSED') {
      this.el.globoPlayerResume()
    } else if (this.currentState !== "PLAYING") {
      this.firstPlay()
    }
    this.trigger('playback:play', this.name)
  }

  getPlaybackType() {
    return this.playbackType? this.playbackType: null
  }

  getCurrentBitrate() {
    var currentLevel = this.getLevels()[this.el.globoGetLevel()]
    return currentLevel.bitrate
  }

  getLastProgramDate() {
    var programDate = this.el.globoGetLastProgramDate()
    // normalizing for BRT
    return programDate - 1.08e+7
  }

  isHighDefinitionInUse() {
    return this.highDefinition
  }

  getLevels() {
    if (!this.levels || this.levels.length === 0) {
      this.levels = this.el.globoGetLevels()
    }
    return this.levels
  }

  setPlaybackState(state) {
    var bufferLength = this.el.globoGetbufferLength()
    if (state === "PLAYING_BUFFERING" && bufferLength < 1)  {
      this.trigger('playback:buffering', this.name)
      this.updateCurrentState(state)
    } else if (state === "PLAYING") {
      if (_.contains(["PLAYING_BUFFERING", "PAUSED", "IDLE"], this.currentState)) {
        this.trigger('playback:bufferfull', this.name)
        this.updateCurrentState(state)
      }
    } else if (state === "PAUSED") {
      this.updateCurrentState(state)
    } else if (state === "IDLE") {
      this.trigger('playback:ended', this.name)
      this.trigger('playback:timeupdate', 0, this.el.globoGetDuration(), this.name)
      this.updateCurrentState(state)
    }
    this.lastBufferLength = bufferLength
  }

  updateCurrentState(state) {
    this.currentState = state
    this.updatePlaybackType()
  }

  updatePlaybackType() {
    this.playbackType = this.el.globoGetType()
    if (this.playbackType) {
      this.playbackType = this.playbackType.toLowerCase()
      if (this.playbackType === 'vod') {
        this.startReportingProgress()
      } else {
        this.stopReportingProgress()
      }
    }
    this.trigger('playback:playbackstate')
  }

  startReportingProgress() {
    if (!this.reportingProgress) {
      this.reportingProgress = true
      Mediator.on(this.uniqueId + ':fragmentloaded', this.onFragmentLoaded)
    }
  }

  stopReportingProgress() {
    Mediator.off(this.uniqueId + ':fragmentloaded', this.onFragmentLoaded, this)
  }

  onFragmentLoaded() {
    var buffered = this.el.globoGetPosition() + this.el.globoGetbufferLength()
    this.trigger('playback:progress', this.el.globoGetPosition(), buffered, this.getDuration(), this.name)
  }

  firstPlay() {
    this.el.globoPlayerLoad(this.src)
    this.el.globoPlayerPlay()
  }

  volume(value) {
    if (this.isReady) {
      this.el.globoPlayerVolume(value)
    } else {
      this.listenToOnce(this, 'playback:bufferfull', () => this.volume(value))
    }
  }

  pause() {
    if (this.playbackType !== 'live' || this.dvrEnabled) {
      this.el.globoPlayerPause()
      if (this.playbackType === 'live' && this.dvrEnabled) {
        this.updateDvr(true)
      }
    }
  }

  stop() {
    this.el.globoPlayerStop()
    this.trigger('playback:timeupdate', 0, this.name)
  }

  isPlaying() {
    if (this.currentState) {
      return !!(this.currentState.match(/playing/i))
    }
    return false
  }

  getDuration() {
    var duration = this.el.globoGetDuration()
    if (this.playbackType === 'live') {
      // estimate 10 seconds of buffer time for live streams for seek positions
      duration = duration - 10
    }
    return duration
  }

  seek(time) {
    var duration = this.getDuration()
    if (time > 0) {
      time = duration * time / 100
    }

    if (this.playbackType === 'live') {
      // seek operations to a time within 5 seconds from live stream will position playhead back to live
      var dvrInUse = (time >= 0 && duration - time > 5)
      if (!dvrInUse) {
        time = -1
      }
      this.updateDvr(dvrInUse)
    }
    this.el.globoPlayerSeek(time)
    this.trigger('playback:timeupdate', time, duration, this.name)
  }

  updateDvr(dvrInUse) {
    var previousDvrInUse = !!this.dvrInUse
    this.dvrInUse = dvrInUse
    if (this.dvrInUse !== previousDvrInUse) {
      this.updateSettings()
      this.trigger('playback:dvr', this.dvrInUse)
      this.trigger('playback:stats:add', {'dvr': this.dvrInUse})
    }
  }

  flashPlaybackError() {
    this.trigger('playback:stop')
  }

  timeUpdate(time, duration) {
    this.trigger('playback:timeupdate', time, duration, this.name)
  }

  destroy() {
    this.stopListening()
    this.$el.remove()
  }

  setupFirefox() {
    var $el = this.$('embed')
    $el.attr('data-hls', '')
    this.setElement($el)
  }

  setupIE() {
    this.setElement($(_.template(objectIE)({cid: this.cid, swfPath: this.swfPath, playbackId: this.uniqueId})))
  }

  updateSettings() {
    this.settings = _.extend({}, this.defaultSettings)
    if (this.playbackType === "vod" || this.dvrInUse) {
      this.settings.left = ["playpause", "position", "duration"]
      this.settings.seekEnabled = true
    } else if (this.dvrEnabled) {
      this.settings.left = ["playpause"]
      this.settings.seekEnabled = true
    } else {
      this.settings.seekEnabled = false
    }
  }

  setElement(element) {
    this.$el = element
    this.el = element[0]
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    if(Browser.isLegacyIE) {
      this.setupIE()
    } else {
      this.$el.html(this.template({cid: this.cid, swfPath: this.swfPath, playbackId: this.uniqueId}))
      if(Browser.isFirefox) {
        this.setupFirefox()
      } else if (Browser.isIE) {
        this.$('embed').remove()
      }
    }
    this.el.id = this.cid
    this.$el.append(style)
    return this
  }
}

HLS.canPlay = function(resource) {
  return !!resource.match(/^http(.*).m3u8?/)
}

module.exports = HLS
