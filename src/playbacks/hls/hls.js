// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Playback = require('../../base/playback')
var JST = require('../../base/jst')
var assign = require('lodash.assign')
var template = require('../../base/template')

var Mediator = require('../../components/mediator')
var Browser = require('../../components/browser')
var Events = require('../../base/events')
var Styler = require('../../base/styler')
var $ = require('clappr-zepto')

var objectIE = '<object type="application/x-shockwave-flash" id="<%= cid %>" class="hls-playback" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" data-hls="" width="100%" height="100%"><param name="movie" value="<%= baseUrl %>/assets/HLSPlayer.swf"> <param name="quality" value="autohigh"> <param name="swliveconnect" value="true"> <param name="allowScriptAccess" value="always"> <param name="bgcolor" value="#001122"> <param name="allowFullScreen" value="false"> <param name="wmode" value="transparent"> <param name="tabindex" value="1"> <param name=FlashVars value="playbackId=<%= playbackId %>" /> </object>'

class HLS extends Playback {
  get name() { return 'hls' }
  get tagName() { return 'object' }
  get template() { return JST.hls }
  get attributes() {
    return {
      'class': 'hls-playback',
      'data-hls': '',
      'type': 'application/x-shockwave-flash',
      'width': '100%',
      'height': '100%'
    }
  }

  constructor(options) {
    super(options)
    this.src = options.src
    this.baseUrl = options.baseUrl;
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
    this.settings = assign({}, this.defaultSettings)
    this.playbackType = 'live'
    this.addListeners()
  }

  addListeners() {
    Mediator.on(this.uniqueId + ':flashready', () => this.bootstrap())
    Mediator.on(this.uniqueId + ':timeupdate', () => this.updateTime())
    Mediator.on(this.uniqueId + ':playbackstate', (state) => this.setPlaybackState(state))
    Mediator.on(this.uniqueId + ':levelchanged', (isHD) => this.updateHighDefinition(isHD))
    Mediator.on(this.uniqueId + ':playbackerror', () => this.flashPlaybackError())
  }

  stopListening() {
    super.stopListening()
    Mediator.off(this.uniqueId + ':flashready')
    Mediator.off(this.uniqueId + ':timeupdate')
    Mediator.off(this.uniqueId + ':playbackstate')
    Mediator.off(this.uniqueId + ':levelchanged')
    Mediator.off(this.uniqueId + ':playbackerror')
  }

  bootstrap() {
    this.el.width = "100%"
    this.el.height = "100%"
    this.isReady = true
    this.currentState = "IDLE"
    this.setFlashSettings()
    this.updatePlaybackType()
    this.autoPlay && this.play()
    this.trigger(Events.PLAYBACK_READY, this.name)
  }

  setFlashSettings() {
    this.el.globoPlayerSetflushLiveURLCache(this.flushLiveURLCache)
    this.el.globoPlayerCapLeveltoStage(this.capLevelToStage)
    this.el.globoPlayerSetmaxBufferLength(0)
  }

  updateHighDefinition(isHD) {
    this.highDefinition = (isHD === "hd");
    this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE)
    this.trigger(Events.PLAYBACK_BITRATE, {'bitrate': this.getCurrentBitrate()})
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
      this.trigger(Events.PLAYBACK_SETTINGSUPDATE, this.name)
    }

    if (livePlayback && (!this.dvrEnabled || !this.dvrInUse)) {
      position = duration
    }

    this.trigger(Events.PLAYBACK_TIMEUPDATE, position, duration, this.name)
  }

  play() {
    if(this.currentState === 'PAUSED') {
      this.el.globoPlayerResume()
    } else if (this.currentState !== "PLAYING") {
      this.firstPlay()
    }
    this.trigger(Events.PLAYBACK_PLAY, this.name)
  }

  getPlaybackType() {
    return this.playbackType? this.playbackType: null
  }

  getCurrentBitrate() {
    var currentLevel = this.getLevels()[this.el.globoGetLevel()]
    return currentLevel.bitrate
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
      this.trigger(Events.PLAYBACK_BUFFERING, this.name)
      this.updateCurrentState(state)
    } else if (state === "PLAYING") {
      if (["PLAYING_BUFFERING", "PAUSED", "IDLE"].indexOf(this.currentState) >= 0) {
        this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
        this.updateCurrentState(state)
      }
    } else if (state === "PAUSED") {
      this.updateCurrentState(state)
    } else if (state === "IDLE") {
      this.trigger(Events.PLAYBACK_ENDED, this.name)
      this.trigger(Events.PLAYBACK_TIMEUPDATE, 0, this.el.globoGetDuration(), this.name)
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
    this.trigger(Events.PLAYBACK_PLAYBACKSTATE)
  }

  startReportingProgress() {
    if (!this.reportingProgress) {
      this.reportingProgress = true
      Mediator.on(this.uniqueId + ':fragmentloaded',() => this.onFragmentLoaded())
    }
  }

  stopReportingProgress() {
    Mediator.off(this.uniqueId + ':fragmentloaded', this.onFragmentLoaded, this)
  }

  onFragmentLoaded() {
    var buffered = this.el.globoGetPosition() + this.el.globoGetbufferLength()
    this.trigger(Events.PLAYBACK_PROGRESS, this.el.globoGetPosition(), buffered, this.getDuration(), this.name)
  }

  firstPlay() {
    this.setFlashSettings() //ensure flushLiveURLCache will work (#327)
    this.el.globoPlayerLoad(this.src)
    this.el.globoPlayerPlay()
  }

  volume(value) {
    if (this.isReady) {
      this.el.globoPlayerVolume(value)
    } else {
      this.listenToOnce(this, Events.PLAYBACK_BUFFERFULL, () => this.volume(value))
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
    this.trigger(Events.PLAYBACK_TIMEUPDATE, 0, this.name)
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
    this.trigger(Events.PLAYBACK_TIMEUPDATE, time, duration, this.name)
    this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE)
  }

  updateDvr(dvrInUse) {
    var previousDvrInUse = !!this.dvrInUse
    this.dvrInUse = dvrInUse
    if (this.dvrInUse !== previousDvrInUse) {
      this.updateSettings()
      this.trigger(Events.PLAYBACK_DVR, this.dvrInUse)
      this.trigger(Events.PLAYBACK_STATS_ADD, {'dvr': this.dvrInUse})
    }
  }

  flashPlaybackError() {
    this.trigger(Events.PLAYBACK_STOP)
  }

  timeUpdate(time, duration) {
    this.trigger(Events.PLAYBACK_TIMEUPDATE, time, duration, this.name)
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
    this.setElement($(template(objectIE)({cid: this.cid, baseUrl: this.baseUrl, playbackId: this.uniqueId})))
  }

  updateSettings() {
    this.settings = assign({}, this.defaultSettings)
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
      this.$el.html(this.template({cid: this.cid, baseUrl: this.baseUrl, playbackId: this.uniqueId}))
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
  return !!(resource.match(/^http(.*).m3u8?/) && Browser.hasFlash)
}

module.exports = HLS
