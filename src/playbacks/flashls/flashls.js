// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import BaseFlashPlayback from 'playbacks/base_flash_playback'
import Events from 'base/events'
import template from 'base/template'
import Playback from 'base/playback'
import Mediator from 'components/mediator'
import Browser from 'components/browser'
import HLSEvents from './flashls_events'
import hlsSwf from './public/HLSPlayer.swf'
import $ from 'clappr-zepto'


var MAX_ATTEMPTS = 60

export default class FlasHLS extends BaseFlashPlayback {
  get name() { return 'flashls' }
  get swfPath() { return template(hlsSwf)({baseUrl: this.baseUrl}) }

  get levels() { return (this.el && this.el.getLevels()) || [] }
  get currentLevel() { return (this.el && this.el.getCurrentLevel()) || -1 }
  set currentLevel(level) { this.el && this.el.playerSetCurrentLevel(level) }

  constructor(options) {
    super(options)
    this.src = options.src
    this.baseUrl = options.baseUrl
    this.initHlsParameters(options)
    this.highDefinition = false
    this.autoPlay = options.autoPlay
    this.loop = options.loop
    this.defaultSettings = {
      left: ["playstop"],
      default: ['seekbar'],
      right: ["fullscreen", "volume", "hd-indicator"],
      seekEnabled: false
    }
    this.settings = $.extend({}, this.defaultSettings)
    this.playbackType = Playback.LIVE
    this.addListeners()
  }

  initHlsParameters(options) {
    this.flushLiveURLCache = (options.flushLiveURLCache === undefined) ? true : options.flushLiveURLCache
    this.capLevelToStage = (options.capLevelToStage === undefined) ? false : options.capLevelToStage
    this.useHardwareVideoDecoder = (options.useHardwareVideoDecoder === undefined) ? true : options.useHardwareVideoDecoder
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
      if (this.autoPlay || this._shouldPlayOnBootstrap) {
          this.play()
      }
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
    this.startFromBitrate = startFromBitrate
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
    var currentLevel = this.levels[level]
    if (currentLevel) {
      this.highDefinition = (currentLevel.height >= 720 || (currentLevel.bitrate / 1000) >= 2000);
      this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition)
      this.trigger(Events.PLAYBACK_BITRATE, {
        height: currentLevel.height,
        width: currentLevel.width,
        bandwidth: currentLevel.bandwidth,
        bitrate: currentLevel.bitrate,
        level: level
      })
    }
  }

  updateTime(timeMetrics) {
    if (this.currentState === 'IDLE') {
        return
    }

    var duration = this.normalizeDuration(timeMetrics.duration)
    var position = Math.min(Math.max(timeMetrics.position, 0), duration)
    var previousDVRStatus = this.dvrEnabled
    var livePlayback = (this.playbackType === Playback.LIVE)
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

    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: position, total: duration}, this.name)
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
    return this.currentLevel
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel]
  }

  getCurrentBitrate() {
    return this.levels[this.currentLevel].bitrate
  }

  setCurrentLevel(level) {
    this.currentLevel = level
  }

  isHighDefinitionInUse() {
    return this.highDefinition
  }

  getLevels() {
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
      this.srcLoaded = false
      if (this.loop && ["PLAYING_BUFFERING", "PLAYING"].indexOf(this.currentState) >= 0) {
        this.play()
        this.seek(0)
      } else {
        this.updateCurrentState(state)
        this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 0, total: this.el.getDuration()}, this.name)
        this.trigger(Events.PLAYBACK_ENDED, this.name)
      }
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
      if (this.playbackType === Playback.VOD) {
        this.startReportingProgress()
      } else {
        this.stopReportingProgress()
      }
    }
    this.trigger(Events.PLAYBACK_PLAYBACKSTATE, {type: this.playbackType})
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
      this.trigger(Events.PLAYBACK_PROGRESS, {
        start: this.el.getPosition(),
        current: buffered,
        total: this.el.getDuration()
      })
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
    if (this.playbackType !== Playback.LIVE || this.dvrEnabled) {
      this.el.playerPause()
      if (this.playbackType === Playback.LIVE && this.dvrEnabled) {
        this.updateDvr(true)
      }
    }
  }

  stop() {
    this.srcLoaded = false
    this.el.playerStop()
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 0, total: 0}, this.name)
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
    if (this.playbackType === Playback.LIVE) {
      // estimate 10 seconds of buffer time for live streams for seek positions
      duration = duration - 10
    }
    return duration
  }

  seekPercentage(percentage) {
    var duration = this.el.getDuration()
    if (percentage > 0 ) {
      var time = percentage * 60 / duration
    }
    this.seek(time)
  }

  seek(time) {
    var duration = this.el.getDuration()
    if (this.playbackType === Playback.LIVE) {
      // seek operations to a time within 5 seconds from live stream will position playhead back to live
      var dvrInUse = (time >= 0 && duration - time > 5)
      if (!dvrInUse) {
        time = -1
      }
      this.updateDvr(dvrInUse)
    }
    this.el.playerSeek(time)
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: time, total: duration}, this.name)
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
    this.trigger(Events.PLAYBACK_LOADEDMETADATA, {duration: duration, data: loadmetrics})
  }

  timeUpdate(time, duration) {
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: time, total: duration}, this.name)
  }

  destroy() {
    this.stopListening()
    this.$el.remove()
  }

  updateSettings() {
    this.settings = $.extend({}, this.defaultSettings)
    if (this.playbackType === Playback.VOD || this.dvrInUse) {
      this.settings.left = ["playpause", "position", "duration"]
      this.settings.seekEnabled = true
    } else if (this.dvrEnabled) {
      this.settings.left = ["playpause"]
      this.settings.seekEnabled = true
    } else {
      this.settings.seekEnabled = false
    }
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
    super.render()
    this.createCallbacks()
    return this
  }
}

FlasHLS.canPlay = function(resource, mimeType) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  return Browser.hasFlash &&
        ((resourceParts.length > 1 && resourceParts[1] === "m3u8") ||
          mimeType === 'application/x-mpegURL' || mimeType === 'application/vnd.apple.mpegurl')
}
