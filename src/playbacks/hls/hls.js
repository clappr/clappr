// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Playback from 'base/playback'
import Events from 'base/events'
import Styler from 'base/styler'
import template from 'base/template'
import Mediator from 'components/mediator'
import Browser from 'components/browser'
import HLSEvents from './flashls_events'
import hlsStyle from './public/style.scss'
import hlsHTML from './public/hls_playback.html'
import hlsSwf from './public/HLSPlayer.swf'

import assign from 'lodash.assign'
import $ from 'clappr-zepto'

var MAX_ATTEMPTS = 60

var objectIE = '<object type="application/x-shockwave-flash" id="<%= cid %>" class="hls-playback" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" data-hls="" width="100%" height="100%"><param name="movie" value="<%= swfPath %>"> <param name="quality" value="autohigh"> <param name="swliveconnect" value="true"> <param name="allowScriptAccess" value="always"> <param name="bgcolor" value="#001122"> <param name="allowFullScreen" value="false"> <param name="wmode" value="transparent"> <param name="tabindex" value="1"> <param name=FlashVars value="playbackId=<%= playbackId %>&callback=<%= callbackName %>" /> </object>'

export default class HLS extends Playback {
  get name() { return 'hls' }
  get tagName() { return 'object' }
  get template() { return template(hlsHTML) }
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
    this.baseUrl = options.baseUrl
    this.initHlsParameters(options)
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

  initHlsParameters(options) {
    this.flushLiveURLCache = (options.flushLiveURLCache === undefined) ? true : options.flushLiveURLCache
    this.capLevelToStage = (options.capLevelToStage === undefined) ? false : options.capLevelToStage
    this.useHardwareVideoDecoder = (options.useHardwareVideoDecoder === undefined) ? false : options.useHardwareVideoDecoder
    this.maxBufferLength = (options.maxBufferLength === undefined) ? 120 : options.maxBufferLength
    this.seekMode = (options.seekMode === undefined) ? "ACCURATE" : options.seekMode
    this.startFromLevel = (options.startFromLevel === undefined) ? -1 : options.startFromLevel
    this.startFromBitrate = (options.startFromBitrate === undefined) ? -1 : options.startFromBitrate
    this.hlsMinimumDvrSize = (options.hlsMinimumDvrSize === undefined) ? 60 : options.hlsMinimumDvrSize
    this.hlsLogEnabled = (options.hlsLogEnabled === undefined) ? true : options.hlsLogEnabled
    this.keyLoadMaxRetry = (options.keyLoadMaxRetry === undefined) ? 3 : options.keyLoadMaxRetry
    this.keyLoadMaxRetryTimeout = (options.keyLoadMaxRetryTimeout === undefined) ? 64000 : options.keyLoadMaxRetryTimeout
    this.fragmentLoadMaxRetry = (options.fragmentLoadMaxRetry === undefined) ? 3 : options.fragmentLoadMaxRetry
    this.fragmentLoadMaxRetryTimeout = (options.fragmentLoadMaxRetryTimeout === undefined) ? 4000 : options.fragmentLoadMaxRetryTimeout
    this.fragmentLoadSkipAfterMaxRetry = (options.fragmentLoadSkipAfterMaxRetry === undefined) ? false : options.fragmentLoadSkipAfterMaxRetry
    this.capLevelonFpsDrop = (options.capLevelonFpsDrop === undefined) ? false : options.capLevelonFpsDrop
    this.smoothAutoSwitchonFpsDrop = (options.smoothAutoSwitchonFpsDrop === undefined) ? this.capLevelonFpsDrop : options.smoothAutoSwitchonFpsDrop
    this.fpsDroppedMonitoringPeriod = (options.fpsDroppedMonitoringPeriod === undefined) ? 5000 : options.fpsDroppedMonitoringPeriod
    this.fpsDroppedMonitoringThreshold = (options.fpsDroppedMonitoringThreshold === undefined) ? 0.2 : options.fpsDroppedMonitoringThreshold
  }

  addListeners() {
    Mediator.on(this.cid + ':flashready', () => this.bootstrap())
    Mediator.on(this.cid + ':timeupdate', (timeMetrics) => this.updateTime(timeMetrics))
    Mediator.on(this.cid + ':playbackstate', (state) => this.setPlaybackState(state))
    Mediator.on(this.cid + ':levelchanged', (level) => this.levelChanged(level))
    Mediator.on(this.cid + ':error', (code, url, message) => this.flashPlaybackError(code, url, message))
    Mediator.on(this.cid + ':fragmentloaded',(loadmetrics) => this.onFragmentLoaded(loadmetrics))
    Mediator.once(this.cid + ':manifestloaded', (duration, loadmetrics) => this.manifestLoaded(duration, loadmetrics))
  }

  stopListening() {
    super.stopListening()
    Mediator.off(this.cid + ':flashready')
    Mediator.off(this.cid + ':timeupdate')
    Mediator.off(this.cid + ':playbackstate')
    Mediator.off(this.cid + ':levelchanged')
    Mediator.off(this.cid + ':playbackerror')
    Mediator.off(this.cid + ':fragmentloaded')
    Mediator.off(this.cid + ':manifestloaded')
  }

  bootstrap() {
    if (this.el.playerLoad) {
      this.el.width = "100%"
      this.el.height = "100%"
      this.isReady = true
      this.srcLoaded = false
      this.currentState = "IDLE"
      this.setFlashSettings()
      this.updatePlaybackType()
      if (this.autoPlay || this._shouldPlayOnBootstrap) this.play()
      this.trigger(Events.PLAYBACK_READY, this.name)
    } else {
      this._bootstrapAttempts = this._bootstrapAttempts || 0
      if (++this._bootstrapAttempts <= MAX_ATTEMPTS) {
        setTimeout(() => this.bootstrap(), 50)
      } else {
        this.trigger(Events.PLAYBACK_ERROR, {message: "Max number of attempts reached"}, this.name)
      }
    }
  }

  setFlashSettings() {
    this.el.playerSetflushLiveURLCache(this.flushLiveURLCache)
    this.el.playerCapLeveltoStage(this.capLevelToStage)
    this.el.playerSetmaxBufferLength(this.maxBufferLength)
    this.el.playerSetUseHardwareVideoDecoder(this.useHardwareVideoDecoder)
    this.el.playerSetLogInfo(this.hlsLogEnabled)
    this.el.playerSetSeekMode(this.seekMode)
    this.el.playerSetStartFromBitrate(this.startFromBitrate)
    this.el.playerSetstartFromLevel(this.startFromLevel)
    this.el.playerSetKeyLoadMaxRetry(this.keyLoadMaxRetry)
    this.el.playerSetKeyLoadMaxRetryTimeout(this.keyLoadMaxRetryTimeout)
    this.el.playerSetFragmentLoadMaxRetry(this.fragmentLoadMaxRetry)
    this.el.playerSetFragmentLoadMaxRetryTimeout(this.fragmentLoadMaxRetryTimeout)
    this.el.playerSetFragmentLoadSkipAfterMaxRetry(this.fragmentLoadSkipAfterMaxRetry)
    this.el.playerSetCapLevelonFPSDrop(this.capLevelonFpsDrop)
    this.el.playerSetSmoothAutoSwitchonFPSDrop(this.smoothAutoSwitchonFpsDrop)
    this.el.playerSetFpsDroppedMonitoringPeriod(this.fpsDroppedMonitoringPeriod)
    this.el.playerSetFpsDroppedMonitoringThreshold(this.fpsDroppedMonitoringThreshold)
  }

  setFlushLiveUrlCache(flushLiveURLCache) {
    this.flushLiveURLCache = flushLiveURLCache
    this.el.playerSetflushLiveURLCache(this.flushLiveURLCache)
  }

  setCapLeveltoStage(capLevelToStage) {
    this.capLevelToStage = capLevelToStage
    this.el.playerCapLeveltoStage(this.capLevelToStage)
  }

  setMaxBufferLength(maxBufferLength) {
    this.maxBufferLength = maxBufferLength
    this.el.playerSetmaxBufferLength(this.maxBufferLength)
  }

  setUseHardwareVideoDecoder(useHardwareVideoDecoder) {
    this.useHardwareVideoDecoder = useHardwareVideoDecoder
    this.el.playerSetUseHardwareVideoDecoder(this.useHardwareVideoDecoder)
  }

  setHlsLogEnabled(hlsLogEnabled) {
    this.hlsLogEnabled = hlsLogEnabled
    this.el.playerSetLogInfo(this.hlsLogEnabled)
  }

  setSeekMode(seekMode) {
    this.seekMode = seekMode
    this.el.playerSetSeekMode(this.seekMode)
  }

  setStartFromBitrate(startFromBitrate) {
    this.startFromBitrate = setStartFromBitrate
    this.el.playerSetStartFromBitrate(this.startFromBitrate)
  }

  setStartFromLevel(startFromLevel) {
    this.startFromLevel = startFromLevel
    this.el.playerSetstartFromLevel(this.startFromLevel)
  }

  setKeyLoadMaxRetry(keyLoadMaxRetry) {
    this.keyLoadMaxRetry = keyLoadMaxRetry
    this.el.playerSetKeyLoadMaxRetry(this.keyLoadMaxRetry)
  }

  setKeyLoadMaxRetryTimeout(keyLoadMaxRetryTimeout) {
    this.keyLoadMaxRetryTimeout = keyLoadMaxRetryTimeout
    this.el.playerSetKeyLoadMaxRetryTimeout(this.keyLoadMaxRetryTimeout)
  }

  setFragmentLoadMaxRetry(fragmentLoadMaxRetry) {
    this.fragmentLoadMaxRetry = fragmentLoadMaxRetry
    this.el.playerSetFragmentLoadMaxRetry(this.fragmentLoadMaxRetry)
  }

  setFragmentLoadMaxRetryTimeout(fragmentLoadMaxRetryTimeout) {
    this.fragmentLoadMaxRetryTimeout = fragmentLoadMaxRetryTimeout
    this.el.playerSetFragmentLoadMaxRetryTimeout(this.fragmentLoadMaxRetryTimeout)
  }

  setFragmentLoadSkipAfterMaxRetry(fragmentLoadSkipAfterMaxRetry) {
    this.fragmentLoadSkipAfterMaxRetry = fragmentLoadSkipAfterMaxRetry
    this.el.playerSetFragmentLoadSkipAfterMaxRetry(this.fragmentLoadSkipAfterMaxRetry)
  }

  setCapLevelonFPSDrop(capLevelonFpsDrop) {
    this.capLevelonFpsDrop = capLevelonFpsDrop
    this.el.playerSetCapLevelonFPSDrop(this.capLevelonFpsDrop)
  }

  setSmoothAutoSwitchonFPSDrop(smoothAutoSwitchonFpsDrop) {
    this.smoothAutoSwitchonFpsDrop = smoothAutoSwitchonFpsDrop
    this.el.playerSetSmoothAutoSwitchonFPSDrop(this.smoothAutoSwitchonFpsDrop)
  }

  setFpsDroppedMonitoringPeriod(fpsDroppedMonitoringPeriod) {
    this.fpsDroppedMonitoringPeriod = fpsDroppedMonitoringPeriod
    this.el.playerSetFpsDroppedMonitoringPeriod(this.fpsDroppedMonitoringPeriod)
  }

  setFpsDroppedMonitoringThreshold(fpsDroppedMonitoringThreshold) {
    this.fpsDroppedMonitoringThreshold = fpsDroppedMonitoringThreshold
    this.el.playerSetFpsDroppedMonitoringThreshold(this.fpsDroppedMonitoringThreshold)
  }

  levelChanged(level) {
    var currentLevel = this.getLevels()[level]
    if (currentLevel) {
      this.highDefinition = (currentLevel.height >= 720 || (currentLevel.bitrate / 1000) >= 2000);
      this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE)
      this.trigger(Events.PLAYBACK_BITRATE, {bitrate: this.getCurrentBitrate(), level: level})
    }
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

  getCurrentLevelIndex() {
    return this.el.getCurrentLevel()
  }

  getCurrentLevel() {
    return this.getLevels()[this.getCurrentLevelIndex()]
  }

  getCurrentBitrate() {
    return this.getCurrentLevel().bitrate
  }

  setCurrentLevel(level) {
    this.el.playerSetCurrentLevel(level)
  }

  isHighDefinitionInUse() {
    return this.highDefinition
  }

  getLevels() {
    this.levels = this.el.getLevels()
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
    }
  }

  stopReportingProgress() {
    this.reportingProgress = false
  }

  onFragmentLoaded(loadmetrics) {
    this.trigger(Events.PLAYBACK_FRAGMENT_LOADED, loadmetrics)
    if (this.reportingProgress && this.el.getPosition) {
      var buffered = this.el.getPosition() + this.el.getbufferLength()
      this.trigger(Events.PLAYBACK_PROGRESS, this.el.getPosition(), buffered, this.el.getDuration(), this.name)
    }
  }

  firstPlay() {
    if (this.el.playerLoad) {
      this.setFlashSettings() //ensure flushLiveURLCache will work (#327)
      this.el.playerLoad(this.src)
      Mediator.once(this.cid + ':manifestloaded',() => this.el.playerPlay())
      this.srcLoaded = true
    } else {
      this._shouldPlayOnBootstrap = true
    }
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

  flashPlaybackError(code, url, message) {
    this.trigger(Events.PLAYBACK_ERROR, {code: code, url: url, message: message})
    this.trigger(Events.PLAYBACK_STOP)
  }

  manifestLoaded(duration, loadmetrics) {
    this.trigger(Events.PLAYBACK_LOADEDMETADATA, duration, loadmetrics)
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

  setupIE(swfPath) {
    this.setElement($(template(objectIE)({cid: this.cid, swfPath: swfPath, baseUrl: this.baseUrl, playbackId: this.uniqueId, callbackName: `window.Clappr.flashlsCallbacks.${this.cid}`})))
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
    if (!window.Clappr) {
      window.Clappr = {}
    }
    if (!window.Clappr.flashlsCallbacks) {
      window.Clappr.flashlsCallbacks = {}
    }
    this.flashlsEvents = new HLSEvents(this.cid)
    window.Clappr.flashlsCallbacks[this.cid] = (eventName, args) => {
      this.flashlsEvents[eventName].apply(this.flashlsEvents, args)
    }
  }

  render() {
    var style = Styler.getStyleFor(hlsStyle)
    var swfPath = template(hlsSwf)({baseUrl: this.baseUrl})
    if(Browser.isLegacyIE) {
      this.setupIE(swfPath)
    } else {
      this.createCallbacks()
      this.$el.html(this.template({cid: this.cid, swfPath: swfPath, baseUrl: this.baseUrl, playbackId: this.uniqueId, callbackName: `window.Clappr.flashlsCallbacks.${this.cid}`}))
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
