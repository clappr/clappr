// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')
var _ = require("underscore")
var Mediator = require('../../components/mediator')
var Visibility = require('visibility')

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

  initialize(options) {
    super(options)
    this.src = options.src
    this.swfPath = options.swfPath || "assets/HLSPlayer.swf"
    this.setupBrowser()
    this.setupVisibility()
    this.highDefinition = false
    this.autoPlay = options.autoPlay
    this.settings = {
      left: ["playstop", "volume"],
      default: ["position", "seekbar", "duration"],
      right: ["fullscreen", "volume", "hd"]
    }
    this.settings = _.extend({}, this.defaultSettings)
    this.addListeners()
  }

  setupBrowser() {
    this.isLegacyIE = window.ActiveXObject
    this.isChrome = navigator.userAgent.match(/chrome/i)
    this.isFirefox = navigator.userAgent.match(/firefox/i)
    this.isSafari = navigator.userAgent.match(/safari/i)
  }

  setupVisibility() {
    this.visibility = new Visibility()
    this.visibility.on('show', () => this.visibleCallback());
    this.visibility.on('hide', () => this.hiddenCallback());
  }

  addListeners() {
    Mediator.on(this.uniqueId + ':flashready', () => this.bootstrap())
    Mediator.on(this.uniqueId + ':timeupdate', (params) => this.updateTime(params))
    Mediator.on(this.uniqueId + ':playbackstate', (params) => this.setPlaybackState(params))
    Mediator.on(this.uniqueId + ':highdefinition', (params) => this.updateHighDefinition(params))
  }

  stopListening() {
    super()
    Mediator.off(this.uniqueId + ':flashready')
    Mediator.off(this.uniqueId + ':timeupdate')
    Mediator.off(this.uniqueId + ':playbackstate')
    Mediator.off(this.uniqueId + ':highdefinition')
  }

  safe(fn) {
    if(this.el.globoGetState && this.el.globoGetDuration && this.el.globoGetPosition &&
       this.el.globoPlayerSmoothSetLevel && this.el.globoPlayerSetflushLiveURLCache) {
      return fn.apply(this)
    }
  }

  hiddenCallback() {
    this.hiddenId = this.safe(() => {
      return setTimeout(() => this.el.globoPlayerSmoothSetLevel(0), 10000)
    })
  }

  visibleCallback() {
    this.safe(() => {
      if (this.hiddenId) {
        clearTimeout(this.hiddenId)
      }
      if (!this.el.globoGetAutoLevel()) {
        this.el.globoPlayerSmoothSetLevel(-1)
      }
    })
  }

  bootstrap() {
    this.el.width = "100%"
    this.el.height = "100%"
    this.trigger('playback:ready', this.name)
    this.currentState = "IDLE"
    this.el.globoPlayerSetflushLiveURLCache(true)
    this.autoPlay && this.play()
  }

  updateHighDefinition(params) {
    this.highDefinition = params.isHD;
    this.trigger('playback:highdefinitionupdate')
  }

  updateTime(params) {
    return this.safe(() => {
      var previousDvrEnabled = this.dvrEnabled
      this.dvrEnabled = (this.playbackType === 'live' && params.duration > 240)
      var duration = this.getDuration()
      if (this.playbackType === 'live') {
        var position = this.el.globoGetPosition()
        if (position >= duration) {
          position = duration
        }
        this.trigger('playback:timeupdate', position, duration, this.name)
      } else {
        this.trigger('playback:timeupdate', this.el.globoGetPosition(), duration, this.name)
      }
      if (this.dvrEnabled != previousDvrEnabled) {
        this.updateSettings()
      }
    })
  }

  play() {
    this.safe(() => {
      if(this.el.currentState === 'PAUSED') {
        this.el.globoPlayerResume()
      } else {
        this.firstPlay()
      }
      this.trigger('playback:play', this.name)
    })
  }

  getPlaybackType() {
    if (this.playbackType)
      return this.playbackType
    return null
  }

  getCurrentBitrate() {
    return this.safe(function() {
      var currentLevel = this.getLevels()[this.el.globoGetLevel()]
      return currentLevel.bitrate
    })
  }

  getLastProgramDate() {
    var programDate = this.el.globoGetLastProgramDate()
    // normalizing for BRT
    return programDate - 1.08e+7
  }

  isHighDefinition() {
    return this.highDefinition
  }

  getLevels() {
    return this.safe(() => {
      if (!this.levels || this.levels.length === 0) {
        this.levels = this.el.globoGetLevels()
      }
      return this.levels
    })
  }

  setPlaybackState(params) {
    if (params.state === "PLAYING_BUFFERING" && this.el.globoGetbufferLength() < 1 && this.currentState !== "PLAYING_BUFFERING")  {
      this.trigger('playback:buffering', this.name)
    } else if (params.state === "PLAYING" && this.currentState === "PLAYING_BUFFERING") {
      this.trigger('playback:bufferfull', this.name)
    } else if (params.state === "IDLE") {
      this.trigger('playback:ended', this.name)
      this.trigger('playback:timeupdate', 0, this.el.globoGetDuration(), this.name)
    }
    this.currentState = params.state;
    this.updatePlaybackType()
  }

  updatePlaybackType() {
    this.safe(() => {
      if (!this.playbackType) {
        this.playbackType = this.el.globoGetType()
        if (this.playbackType) {
          this.playbackType = this.playbackType.toLowerCase()
          this.updateSettings()
        }
      }
    })
  }

  firstPlay() {
    this.safe(() => {
      this.el.globoPlayerLoad(this.src)
      this.el.globoPlayerPlay()
    })
  }

  volume(value) {
    this.safe(() => {
      this.el.globoPlayerVolume(value)
    })
  }

  pause() {
    this.safe(() => {
      this.el.globoPlayerPause()
    })
  }

  stop() {
    this.safe(() => {
      this.el.globoPlayerStop()
      this.trigger('playback:timeupdate', 0, this.name)
    })
  }

  isPlaying() {
    return this.safe(() => {
      if (this.currentState)
        return !!(this.currentState.match(/playing/i))
      return false
    })
  }

  getDuration() {
    return this.safe(() => {
      var duration = this.el.globoGetDuration()
      if (this.playbackType === 'live') {
        // estimate 10 seconds of buffer time for live streams for seek positions
        duration = duration - 10
      }
      return duration
    })
  }

  seek(time) {
    this.safe(() => {
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
    })
  }

  isPip(pipStatus) {
    if (pipStatus == true && this.getCurrentBitrate() > 750000) {
      this.el.globoPlayerSetStageScaleMode("exactFit")
      this.el.globoPlayerSmoothSetLevel(2)
    } else if (!this.el.globoGetAutoLevel()) {
      this.el.globoPlayerSetStageScaleMode("noScale")
      this.el.globoPlayerSetLevel(-1)
    }
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
    }
    this.trigger('playback:settingsupdate', this.name)
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template({cid: this.cid, swfPath: this.swfPath, playbackId: this.uniqueId}))
    this.$el.append(style)
    this.el.id = this.cid
    if(navigator.userAgent.match(/firefox/i)) { //FIXME remove it from here
      this.setupFirefox()
    } else if(window.ActiveXObject) {
      this.setupIE()
    }
    return this
  }
}

HLS.canPlay = function(resource) {
  return !!resource.match(/(.*).m3u8/)
}

module.exports = HLS
