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

var HLSEvents = require('./flashls_events')

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
    this.flushLiveURLCache = (options.flushLiveURLCache === undefined) ? true : options.flushLiveURLCache
    this.capLevelToStage = (options.capLevelToStage === undefined) ? false : options.capLevelToStage
    this.useHardwareVideoDecoder = (options.useHardwareVideoDecoder === undefined) ? !Browser.isChrome : options.useHardwareVideoDecoder
    this.maxBufferLength = (options.maxBufferLength === undefined) ? 120 : options.maxBufferLength
    this.hlsMinimumDvrSize = (options.hlsMinimumDvrSize == undefined) ? 60 : options.hlsMinimumDvrSize
    this.hlsLogEnabled = (options.hlsLogEnabled == undefined) ? true : options.hlsLogEnabled
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
    Mediator.on(this.cid + ':flashready', () => this.bootstrap())
    Mediator.on(this.cid + ':timeupdate', (timeMetrics) => this.updateTime(timeMetrics))
    Mediator.on(this.cid + ':playbackstate', (state) => this.setPlaybackState(state))
    Mediator.on(this.cid + ':levelchanged', (level) => this.updateHighDefinition(level))
    Mediator.on(this.cid + ':playbackerror', () => this.flashPlaybackError())
  }

  stopListening() {
    super.stopListening()
    Mediator.off(this.cid + ':flashready')
    Mediator.off(this.cid + ':timeupdate')
    Mediator.off(this.cid + ':playbackstate')
    Mediator.off(this.cid + ':levelchanged')
    Mediator.off(this.cid + ':playbackerror')
  }

  bootstrap() {
    this.el.width = "100%"
    this.el.height = "100%"
    this.isReady = true
    this.srcLoaded = false
    this.currentState = "IDLE"
    this.setFlashSettings()
    this.updatePlaybackType()
    this.autoPlay && this.play()
    this.trigger(Events.PLAYBACK_READY, this.name)
  }

  setFlashSettings() {
    this.el.playerSetflushLiveURLCache(this.flushLiveURLCache)
    this.el.playerCapLeveltoStage(this.capLevelToStage)
    this.el.playerSetmaxBufferLength(this.maxBufferLength)
    this.el.playerSetUseHardwareVideoDecoder(this.useHardwareVideoDecoder)
    this.el.playerSetLogInfo(this.hlsLogEnabled)
  }

  updateHighDefinition(level) {
    var currentLevel = this.getLevels()[level]
    this.highDefinition = (currentLevel.height >= 720 || (currentLevel.bitrate / 1000) >= 2000);
    this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE)
    this.trigger(Events.PLAYBACK_BITRATE, {'bitrate': this.getCurrentBitrate()})
  }

  updateTime(timeMetrics) {
    if (this.currentState === 'IDLE') return

    var duration = this.normalizeDuration(timeMetrics.duration)
    var position = Math.min(Math.max(timeMetrics.position, 0), duration)
    var previousDVRStatus = this.dvrEnabled
    var livePlayback = (this.playbackType === 'live')
    this.dvrEnabled = (livePlayback && duration > this.hlsMinimumDvrSize)

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
      this.el.playerResume()
    } else if (!this.srcLoaded && this.currentState !== "PLAYING") {
      this.firstPlay()
    } else {
      this.el.playerPlay()
    }
  }

  getPlaybackType() {
    return this.playbackType? this.playbackType: null
  }

  getCurrentBitrate() {
    var currentLevel = this.getLevels()[this.el.getLevel()]
    return currentLevel.bitrate
  }

  isHighDefinitionInUse() {
    return this.highDefinition
  }

  getLevels() {
    if (!this.levels || this.levels.length === 0) {
      this.levels = this.el.getLevels()
    }
    return this.levels
  }

  setPlaybackState(state) {
    if (["PLAYING_BUFFERING", "PAUSED_BUFFERING"].indexOf(state) >= 0)  {
      this.trigger(Events.PLAYBACK_BUFFERING, this.name)
      this.updateCurrentState(state)
    } else if (["PLAYING", "PAUSED"].indexOf(state) >= 0) {
      if (["PLAYING_BUFFERING", "PAUSED_BUFFERING", "IDLE"].indexOf(this.currentState) >= 0) {
        this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
      }
      this.updateCurrentState(state)
    } else if (state === "IDLE") {
      this.updateCurrentState(state)
      this.trigger(Events.PLAYBACK_TIMEUPDATE, 0, this.el.getDuration(), this.name)
      this.trigger(Events.PLAYBACK_ENDED, this.name)
    }
  }

  updateCurrentState(state) {
    this.currentState = state
    this.updatePlaybackType()
    if (state === "PLAYING") {
      this.trigger(Events.PLAYBACK_PLAY, this.name)
    } else if (state === "PAUSED") {
      this.trigger(Events.PLAYBACK_PAUSE, this.name)
    }
  }

  updatePlaybackType() {
    this.playbackType = this.el.getType()
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
      Mediator.on(this.cid + ':fragmentloaded',() => this.onFragmentLoaded())
    }
  }

  stopReportingProgress() {
    Mediator.off(this.cid + ':fragmentloaded', this.onFragmentLoaded, this)
  }

  onFragmentLoaded() {
    var buffered = this.el.getPosition() + this.el.getbufferLength()
    this.trigger(Events.PLAYBACK_PROGRESS, this.el.getPosition(), buffered, this.el.getDuration(), this.name)
  }

  firstPlay() {
    this.setFlashSettings() //ensure flushLiveURLCache will work (#327)
    this.el.playerLoad(this.src)
    Mediator.once(this.cid + ':manifestloaded',() => this.el.playerPlay())
    this.srcLoaded = true
  }

  volume(value) {
    if (this.isReady) {
      this.el.playerVolume(value)
    } else {
      this.listenToOnce(this, Events.PLAYBACK_BUFFERFULL, () => this.volume(value))
    }
  }

  pause() {
    if (this.playbackType !== 'live' || this.dvrEnabled) {
      this.el.playerPause()
      if (this.playbackType === 'live' && this.dvrEnabled) {
        this.updateDvr(true)
      }
    }
  }

  stop() {
    this.el.playerStop()
    this.trigger(Events.PLAYBACK_TIMEUPDATE, 0, this.name)
  }

  isPlaying() {
    if (this.currentState) {
      return !!(this.currentState.match(/playing/i))
    }
    return false
  }

  getDuration() {
    return this.normalizeDuration(this.el.getDuration())
  }

  normalizeDuration(duration) {
    if (this.playbackType === 'live') {
      // estimate 10 seconds of buffer time for live streams for seek positions
      duration = duration - 10
    }
    return duration
  }

  seek(time) {
    var duration = this.el.getDuration()
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
    this.el.playerSeek(time)
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

  createCallbacks() {
    if (!window.Clappr.flashlsCallbacks) {
      window.Clappr.flashlsCallbacks = {}
    }
    this.flashlsEvents = new HLSEvents(this.cid)
    window.Clappr.flashlsCallbacks[this.cid] = (eventName, args) => {
      this.flashlsEvents[eventName].apply(this.flashlsEvents, args)
    }
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    if(Browser.isLegacyIE) {
      this.setupIE()
    } else {
      var callbackName = this.createCallbacks()
      this.$el.html(this.template({cid: this.cid, baseUrl: this.baseUrl, playbackId: this.uniqueId, callbackName: `window.Clappr.flashlsCallbacks.${this.cid}`}))
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

HLS.canPlay = function(resource, mimeType) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  return Browser.hasFlash &&
        ((resourceParts.length > 1 && resourceParts[1] == "m3u8") ||
          mimeType === 'application/x-mpegURL' || mimeType === 'application/vnd.apple.mpegurl')
}

module.exports = HLS
