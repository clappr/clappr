// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')
var _ = require("underscore")
var Mediator = require('../../components/mediator')
var Browser = require('../../components/browser')

var objectIE = '<object type="application/x-shockwave-flash" id="<%= cid %>" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" data-hls=""><param name="movie" value="<%= swfPath %>"> <param name="quality" value="autohigh"> <param name="swliveconnect" value="true"> <param name="allowScriptAccess" value="always"> <param name="bgcolor" value="#001122"> <param name="allowFullScreen" value="false"> <param name="wmode" value="transparent"> <param name="tabindex" value="1"> </object>'

class HLS extends UIPlugin {
  get name() { return 'hls' }
  get tagName() { return 'object' }
  get template() { return JST.hls }
  get attributes() {
    return {
      'data-hls': '',
      'type': 'application/x-shockwave-flash'
    }
  }

  constructor(options) {
    super(options)
    this.src = options.src
    this.swfPath = options.swfPath || "http://cdn.clappr.io/latest/assets/HLSPlayer.swf"
    this.highDefinition = false
    this.autoPlay = options.autoPlay
    this.defaultSettings = {
      left: ["playstop", "volume"],
      default: ['seekbar'],
      right: ["fullscreen", "hd-indicator"],
      seekEnabled: true
    }
    this.settings = _.extend({}, this.defaultSettings)
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
    this.trigger('playback:ready', this.name)
    this.currentState = "IDLE"
    this.el.globoPlayerSetflushLiveURLCache(true)
    this.autoPlay && this.play()
  }

  updateHighDefinition(isHD) {
    this.highDefinition = (isHD === "true");
    this.trigger('playback:highdefinitionupdate')
  }

  updateTime() {
    var duration = this.getDuration()
    var position = this.el.globoGetPosition()
    var livePlayback = this.playbackType === 'live'
    if (livePlayback && (position >= duration || position < 0)) {
      position = duration
    }

    var previousDVRStatus = this.dvrEnabled
    this.dvrEnabled = (livePlayback && duration > 240)
    if (this.dvrEnabled !== previousDVRStatus) {
      this.updateSettings()
    }

    var previousDvrInUse = !!this.dvrInUse
    this.dvrInUse = this.dvrEnabled && (duration - position >= 5)
    if (this.dvrInUse !== previousDvrInUse) {
      this.trigger('playback:dvr', this.dvrInUse)
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
    if (this.playbackType)
      return this.playbackType
    return null
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
      if (_.contains(["PLAYING_BUFFERING", "IDLE"], this.currentState) && bufferLength !== this.lastBufferLength) {
        this.trigger('playback:bufferfull', this.name)
        this.updateCurrentState(state)
      }
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
    }
    this.trigger('playback:playbackstate');
  }

  firstPlay() {
    this.el.globoPlayerLoad(this.src)
    this.el.globoPlayerPlay()
  }

  volume(value) {
    this.el.globoPlayerVolume(value)
  }

  pause() {
    this.el.globoPlayerPause()
    if (this.playbackType === 'live' && this.dvrEnabled) {
      this.trigger('playback:dvr', true);
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
    // seek operations to a time within 5 seconds from live stream will position playhead back to live
    if (this.playbackType === 'live' && duration - time < 5) {
      time = -1
    }
    this.el.globoPlayerSeek(time)
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
    this.setElement($el[0])
  }

  setupIE() {
    this.setElement($(_.template(objectIE)({cid: this.cid, swfPath: this.swfPath})))
  }

  updateSettings() {
    this.settings = _.extend({}, this.defaultSettings)
    if (this.playbackType === "vod" || this.dvrEnabled) {
      this.settings.left = ["playpause", "position", "duration"]
      this.settings.default = ["seekbar"]
    } else {
      this.settings.seekEnabled = false
    }
    this.trigger('playback:settingsupdate', this.name)
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template({cid: this.cid, swfPath: this.swfPath, playbackId: this.uniqueId}))
    this.$el.append(style)
    this.el.id = this.cid
    if(Browser.isFirefox) {
      this.setupFirefox()
    } else if(Browser.isLegacyIE) {
      this.setupIE()
    }
    return this
  }
}

HLS.canPlay = function(resource) {
  return !!resource.match(/^http(.*).m3u8/)
}

module.exports = HLS
