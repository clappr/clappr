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
    Mediator.on(this.uniqueId + ':timeupdate', (params) => this.updateTime(params))
    Mediator.on(this.uniqueId + ':playbackstate', (state) => this.setPlaybackState(state))
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

  updateTime(params) {
    var duration = this.getDuration()
    var position = this.el.globoGetPosition()
    if (this.playbackType === 'live' && position >= duration) {
      position = duration
    }
    this.trigger('playback:timeupdate', position, duration, this.name)

    var previousDVRStatus = this.dvrEnabled
    this.dvrEnabled = (this.playbackType === 'live' && duration > 240)
    if (this.dvrEnabled !== previousDVRStatus) {
      this.updateSettings()
    } else {
      this.trigger('playback:timeupdate', this.el.globoGetPosition(), duration, this.name)
    }
  }

  play() {
    if(this.el.currentState === 'PAUSED') {
      this.el.globoPlayerResume()
    } else {
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
      this.updatePlaybackType()
    } else if (state === "PLAYING") {
      if ((this.currentState === "PLAYING_BUFFERING" || this.currentState === "IDLE") && bufferLength !== this.lastBufferLength) {
        this.trigger('playback:bufferfull', this.name)
        this.updatePlaybackType()
      }
    } else if (state === "IDLE") {
      this.trigger('playback:ended', this.name)
      this.trigger('playback:timeupdate', 0, this.el.globoGetDuration(), this.name)
      this.updatePlaybackType()
    }
    this.lastBufferLength = bufferLength
    this.currentState = state;
  }

  updatePlaybackType() {
    if (!this.playbackType) {
      this.playbackType = this.el.globoGetType()
      if (this.playbackType) {
        this.playbackType = this.playbackType.toLowerCase()
      }
      this.trigger('playback:playbackstate');
    }
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
    if (time < 0) {
      this.el.globoPlayerSeek(time)
    } else {
      var duration = this.getDuration()
      time = duration * time / 100
      // seek operations to a time within 2 seconds from live stream will position playhead back to live
      if (this.playbackType === 'live' && duration - time < 2)
        time = -1
      this.el.globoPlayerSeek(time)
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
