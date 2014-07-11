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
    this.isLegacyIE = window.ActiveXObject
    this.isChrome = navigator.userAgent.match(/chrome/i)
    this.isFirefox = navigator.userAgent.match(/firefox/i)
    this.isSafari = navigator.userAgent.match(/safari/i)
    this.autoPlay = options.autoPlay
    this.visibility = new Visibility()
    this.visible = true
    this.highDefinition = "unavailable"; // this will be changed on checkHighDefinition()
    this.settings = {
      left: ["playstop", "volume"],
      default: ["position", "seekbar", "duration"],
      right: ["fullscreen", "volume", "hd"]
    }
    console.log("Meu uniqueID: " + this.uniqueId);
    this.addListeners()
  }

  addListeners() {
    Mediator.on(this.uniqueId + ':flashready', () => this.bootstrap())
  }

  stopListening() {
    super()
    Mediator.off(this.uniqueId + ':flashready', () => this.bootstrap())
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
      this.el.globoPlayerSmoothSetLevel(-1)
    })
  }

  bootstrap() {
    this.el.width = "100%"
    this.el.height = "100%"
    this.trigger('playback:ready', this.name)
    this.currentState = "IDLE"
    this.timedCheckState()
    this.el.globoPlayerSetflushLiveURLCache(true)
    this.autoPlay && this.play()
  }

  updateTime(interval) {
    return this.safe(() => {
      return setInterval(() => {
        this.safe(() => {
          var previousDvrEnabled = this.dvrEnabled
          var duration = this.el.globoGetDuration()
          this.dvrEnabled = (this.playbackType === 'live' && duration > 240)
          this.trigger('playback:timeupdate', this.el.globoGetPosition(), duration, this.name)
          if (this.dvrEnabled != previousDvrEnabled) {
            this.updateSettings()
          }
        })
      }, interval)
    })
  }

  play() {
    this.safe(() => {
      if(this.el.globoGetState() === 'IDLE') {
        clearInterval(this.checkStateId)
        this.checkTimeId = this.updateTime(1000)
      }
      if(this.el.globoGetState() === 'PAUSED') {
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

  isHighDefinitionAvailable(levels) {
    return !!(levels.length > 0 && levels[levels.length-1].bitrate >= 2500000)
  }

  isHighDefinitionInUse() {
    return this.highDefinition === "available-in-use"
  }

  checkHighDefinition() {
    this.safe(() => {
      // this function is responsible to change media control settings
      // regarding the availability of HD level and if it's being used or not.
      // highDefinition attribute have 3 states: "available", "available-in-use", "unavailable"
      var changed = false
      this.levels = this.getLevels()
      if (this.isHighDefinitionAvailable(this.levels)) {
        var lastLevel = this.levels.length -1
        var currentLevel = this.el.globoGetLevel()
        if (currentLevel === lastLevel && this.highDefinition !== "available-in-use") {
          this.highDefinition = "available-in-use"
          changed = true
        } else if (currentLevel !== lastLevel && this.highDefinition === "available-in-use") {
          this.highDefinition = "available"
          changed = true
        } else if (this.highDefinition === "unavailable") {
          this.highDefinition = "available"
          changed = true
        }
      }
      if (changed) {
        this.trigger('playback:highdefinitionupdate')
      }
    })
  }

  getLevels() {
    return this.safe(() => {
      if (!this.levels || this.levels.length === 0) {
        this.levels = this.el.globoGetLevels()
      }
      return this.levels
    })
  }

  timedCheckState() {
    this.checkStateId = setInterval(() => this.checkState(), 250)
    this.checkHighDefinitionId = setInterval(() => this.checkHighDefinition(), 3000)
  }

  checkState() {
    this.safe(() => {
      this.updatePlaybackType()
      this.updatePlayerVisibility()
      if (this.el.globoGetState() === "PLAYING_BUFFERING" && this.el.globoGetbufferLength() < 1 && this.currentState !== "PLAYING_BUFFERING") {
        this.trigger('playback:buffering', this.name)
        this.currentState = "PLAYING_BUFFERING"
      } else if (this.currentState === "PLAYING_BUFFERING" && this.el.globoGetState() === "PLAYING") {
        this.trigger('playback:bufferfull', this.name)
        this.currentState = "PLAYING"
      } else if (this.el.globoGetState() === "IDLE") {
        this.trigger('playback:ended', this.name)
        this.trigger('playback:timeupdate', 0, this.el.globoGetDuration(), this.name)
        clearInterval(this.checkStateId)
        this.currentState = "IDLE"
      }
    })
  }

  updatePlayerVisibility() {
    if (this.visible && this.visibility.hidden()) {
      this.visible = false
      this.hiddenCallback()
    } else if (!this.visible && this.visibility.visible()) {
      this.visible = true
      this.visibleCallback()
    }
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
      clearInterval(this.checkStateId)
      this.trigger('playback:timeupdate', 0, this.name)
    })
  }

  isPlaying() {
    return this.safe(() => {
      if (this.el.globoGetState())
        return !!(this.el.globoGetState().match(/playing/i))
      return false
    })
  }

  getDuration() {
    return this.safe(() => this.el.globoGetDuration())
  }

  seek(time) {
    this.safe(() => {
      if (time < 0) {
        this.updateDVRStatus(false)
        this.el.globoPlayerSeek(time)
      } else {
        if (this.getPlaybackType() == "live") {
          this.updateDVRStatus(true)
        }
        this.el.globoPlayerSeek(this.el.globoGetDuration() * time / 100)
      }
      clearInterval(this.checkStateId)
      this.checkTimeId = this.updateTime(1000)
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
    clearInterval(this.checkStateId)
    clearInterval(this.checkTimeId)
    clearInterval(this.checkHighDefinitionId)
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
    this.settings = {
      left: [((this.playbackType === "vod" || this.dvrEnabled) ? "playpause" : "playstop")],
      default: [(this.playbackType === "vod" ? "position" : ""), "seekbar", (this.playbackType === "vod" ? "duration" : "")],
      right: ["fullscreen", "volume", "hd-indicator"]
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
