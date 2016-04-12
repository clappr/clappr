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


const MAX_ATTEMPTS = 60
const AUTO = -1

export default class FlasHLS extends BaseFlashPlayback {
  get name() { return 'flashls' }
  get swfPath() { return template(hlsSwf)({baseUrl: this.baseUrl}) }

  get levels() { return this._levels || [] }
  get currentLevel() {
    if (this._currentLevel === null || this._currentLevel === undefined) {
      return AUTO;
    } else {
      return this._currentLevel; //0 is a valid level ID
    }
  }
  set currentLevel(id) {
    this._currentLevel = id
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_START)
    this.el.playerSetCurrentLevel(id)
  }

  /**
   * Determine if the playback has ended.
   * @property ended
   * @type Boolean
   */
  get ended() {
    return this.hasEnded
  }

  /**
   * Determine if the playback is buffering.
   * This is related to the PLAYBACK_BUFFERING and PLAYBACK_BUFFERFULL events
   * @property buffering
   * @type Boolean
   */
  get buffering() {
    return !!this.bufferingState && !this.hasEnded
  }

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
    this.hasEnded = false
    this.addListeners()
  }

  initHlsParameters(options) {
    this.autoStartLoad = (options.autoStartLoad === undefined) ? true : options.autoStartLoad
    this.capLevelToStage = (options.capLevelToStage === undefined) ? false : options.capLevelToStage
    this.maxLevelCappingMode = (options.maxLevelCappingMode === undefined) ? "downscale" : options.maxLevelCappingMode
    this.minBufferLength = (options.minBufferLength === undefined) ? -1 : options.minBufferLength
    this.minBufferLengthCapping = (options.minBufferLengthCapping === undefined) ? -1 : options.minBufferLengthCapping
    this.maxBufferLength = (options.maxBufferLength === undefined) ? 120 : options.maxBufferLength
    this.maxBackBufferLength = (options.maxBackBufferLength === undefined) ? 30 : options.maxBackBufferLength
    this.lowBufferLength = (options.lowBufferLength === undefined) ? 3 : options.lowBufferLength
    this.mediaTimePeriod = (options.mediaTimePeriod === undefined) ? 100 : options.mediaTimePeriod
    this.fpsDroppedMonitoringPeriod = (options.fpsDroppedMonitoringPeriod === undefined) ? 5000 : options.fpsDroppedMonitoringPeriod
    this.fpsDroppedMonitoringThreshold = (options.fpsDroppedMonitoringThreshold === undefined) ? 0.2 : options.fpsDroppedMonitoringThreshold
    this.capLevelonFPSDrop = (options.capLevelonFPSDrop === undefined) ? false : options.capLevelonFPSDrop
    this.smoothAutoSwitchonFPSDrop = (options.smoothAutoSwitchonFPSDrop === undefined) ? this.capLevelonFPSDrop : options.smoothAutoSwitchonFPSDrop
    this.switchDownOnLevelError = (options.switchDownOnLevelError === undefined) ? true : options.switchDownOnLevelError
    this.seekMode = (options.seekMode === undefined) ? "ACCURATE" : options.seekMode
    this.keyLoadMaxRetry = (options.keyLoadMaxRetry === undefined) ? 3 : options.keyLoadMaxRetry
    this.keyLoadMaxRetryTimeout = (options.keyLoadMaxRetryTimeout === undefined) ? 64000 : options.keyLoadMaxRetryTimeout
    this.fragmentLoadMaxRetry = (options.fragmentLoadMaxRetry === undefined) ? 3 : options.fragmentLoadMaxRetry
    this.fragmentLoadMaxRetryTimeout = (options.fragmentLoadMaxRetryTimeout === undefined) ? 4000 : options.fragmentLoadMaxRetryTimeout
    this.fragmentLoadSkipAfterMaxRetry = (options.fragmentLoadSkipAfterMaxRetry === undefined) ? true : options.fragmentLoadSkipAfterMaxRetry
    this.maxSkippedFragments = (options.maxSkippedFragments === undefined) ? 5 : options.maxSkippedFragments
    this.flushLiveURLCache = (options.flushLiveURLCache === undefined) ? false : options.flushLiveURLCache
    this.initialLiveManifestSize = (options.initialLiveManifestSize === undefined) ? 1 : options.initialLiveManifestSize
    this.manifestLoadMaxRetry = (options.manifestLoadMaxRetry === undefined) ? 3 : options.manifestLoadMaxRetry
    this.manifestLoadMaxRetryTimeout = (options.manifestLoadMaxRetryTimeout === undefined) ? 64000 : options.manifestLoadMaxRetryTimeout
    this.manifestRedundantLoadmaxRetry = (options.manifestRedundantLoadmaxRetry === undefined) ? 3 : options.manifestRedundantLoadmaxRetry
    this.startFromBitrate = (options.startFromBitrate === undefined) ? -1 : options.startFromBitrate
    this.startFromLevel = (options.startFromLevel === undefined) ? -1 : options.startFromLevel
    this.autoStartMaxDuration = (options.autoStartMaxDuration === undefined) ? -1 : options.autoStartMaxDuration
    this.seekFromLevel = (options.seekFromLevel === undefined) ? -1 : options.seekFromLevel
    this.useHardwareVideoDecoder = (options.useHardwareVideoDecoder === undefined) ? false : options.useHardwareVideoDecoder
    this.hlsLogEnabled = (options.hlsLogEnabled === undefined) ? true : options.hlsLogEnabled
    this.logDebug = (options.logDebug === undefined) ? false : options.logDebug
    this.logDebug2 = (options.logDebug2 === undefined) ? false : options.logDebug2
    this.logWarn = (options.logWarn === undefined) ? true : options.logWarn
    this.logError = (options.logError === undefined) ? true : options.logError
    this.hlsMinimumDvrSize = (options.hlsMinimumDvrSize === undefined) ? 60 : options.hlsMinimumDvrSize
  }

  addListeners() {
    Mediator.on(this.cid + ':flashready', () => this.bootstrap())
    Mediator.on(this.cid + ':timeupdate', (timeMetrics) => this.updateTime(timeMetrics))
    Mediator.on(this.cid + ':playbackstate', (state) => this.setPlaybackState(state))
    Mediator.on(this.cid + ':levelchanged', (level) => this.levelChanged(level))
    Mediator.on(this.cid + ':error', (code, url, message) => this.flashPlaybackError(code, url, message))
    Mediator.on(this.cid + ':fragmentloaded',(loadmetrics) => this.onFragmentLoaded(loadmetrics))
    Mediator.on(this.cid + ':levelendlist', (level) => this.onLevelEndlist(level))
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
    Mediator.off(this.cid + ':levelendlist')
  }

  bootstrap() {
    if (this.el.playerLoad) {
      this.el.width = "100%"
      this.el.height = "100%"
      this.isReadyState = true
      this.srcLoaded = false
      this.currentState = "IDLE"
      this.setFlashSettings()
      this.updatePlaybackType()
      if (this.autoPlay || this._shouldPlayOnManifestLoaded) {
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
    this.el.playerSetAutoStartLoad(this.autoStartLoad)
    this.el.playerSetCapLevelToStage(this.capLevelToStage)
    this.el.playerSetMaxLevelCappingMode(this.maxLevelCappingMode)
    this.el.playerSetMinBufferLength(this.minBufferLength)
    this.el.playerSetMinBufferLengthCapping(this.minBufferLengthCapping)
    this.el.playerSetMaxBufferLength(this.maxBufferLength)
    this.el.playerSetMaxBackBufferLength(this.maxBackBufferLength)
    this.el.playerSetLowBufferLength(this.lowBufferLength)
    this.el.playerSetMediaTimePeriod(this.mediaTimePeriod)
    this.el.playerSetFpsDroppedMonitoringPeriod(this.fpsDroppedMonitoringPeriod)
    this.el.playerSetFpsDroppedMonitoringThreshold(this.fpsDroppedMonitoringThreshold)
    this.el.playerSetCapLevelonFPSDrop(this.capLevelonFPSDrop)
    this.el.playerSetSmoothAutoSwitchonFPSDrop(this.smoothAutoSwitchonFPSDrop)
    this.el.playerSetSwitchDownOnLevelError(this.switchDownOnLevelError)
    this.el.playerSetSeekMode(this.seekMode)
    this.el.playerSetKeyLoadMaxRetry(this.keyLoadMaxRetry)
    this.el.playerSetKeyLoadMaxRetryTimeout(this.keyLoadMaxRetryTimeout)
    this.el.playerSetFragmentLoadMaxRetry(this.fragmentLoadMaxRetry)
    this.el.playerSetFragmentLoadMaxRetryTimeout(this.fragmentLoadMaxRetryTimeout)
    this.el.playerSetFragmentLoadSkipAfterMaxRetry(this.fragmentLoadSkipAfterMaxRetry)
    this.el.playerSetMaxSkippedFragments(this.maxSkippedFragments)
    this.el.playerSetFlushLiveURLCache(this.flushLiveURLCache)
    this.el.playerSetInitialLiveManifestSize(this.initialLiveManifestSize)
    this.el.playerSetManifestLoadMaxRetry(this.manifestLoadMaxRetry)
    this.el.playerSetManifestLoadMaxRetryTimeout(this.manifestLoadMaxRetryTimeout)
    this.el.playerSetManifestRedundantLoadmaxRetry(this.manifestRedundantLoadmaxRetry)
    this.el.playerSetStartFromBitrate(this.startFromBitrate)
    this.el.playerSetStartFromLevel(this.startFromLevel)
    this.el.playerSetAutoStartMaxDuration(this.autoStartMaxDuration)
    this.el.playerSetSeekFromLevel(this.seekFromLevel)
    this.el.playerSetUseHardwareVideoDecoder(this.useHardwareVideoDecoder)
    this.el.playerSetLogInfo(this.hlsLogEnabled)
    this.el.playerSetLogDebug(this.logDebug)
    this.el.playerSetLogDebug2(this.logDebug2)
    this.el.playerSetLogWarn(this.logWarn)
    this.el.playerSetLogError(this.logError)
  }

  setAutoStartLoad(autoStartLoad) {
    this.autoStartLoad = autoStartLoad
    this.el.playerSetAutoStartLoad(this.autoStartLoad)
  }

  setCapLevelToStage(capLevelToStage) {
    this.capLevelToStage = capLevelToStage
    this.el.playerSetCapLevelToStage(this.capLevelToStage)
  }

  setMaxLevelCappingMode(maxLevelCappingMode) {
    this.maxLevelCappingMode = maxLevelCappingMode
    this.el.playerSetMaxLevelCappingMode(this.maxLevelCappingMode)
  }

  setSetMinBufferLength(minBufferLength) {
    this.minBufferLength = minBufferLength
    this.el.playerSetMinBufferLength(this.minBufferLength)
  }

  setMinBufferLengthCapping(minBufferLengthCapping) {
    this.minBufferLengthCapping = minBufferLengthCapping
    this.el.playerSetMinBufferLengthCapping(this.minBufferLengthCapping)
  }

  setMaxBufferLength(maxBufferLength) {
    this.maxBufferLength = maxBufferLength
    this.el.playerSetMaxBufferLength(this.maxBufferLength)
  }

  setMaxBackBufferLength(maxBackBufferLength) {
    this.maxBackBufferLength = maxBackBufferLength
    this.el.playerSetMaxBackBufferLength(this.maxBackBufferLength)
  }

  setLowBufferLength(lowBufferLength) {
    this.lowBufferLength = lowBufferLength
    this.el.playerSetLowBufferLength(this.lowBufferLength)
  }

  setMediaTimePeriod(mediaTimePeriod) {
    this.mediaTimePeriod = mediaTimePeriod
    this.el.playerSetMediaTimePeriod(this.mediaTimePeriod)
  }

  setFpsDroppedMonitoringPeriod(fpsDroppedMonitoringPeriod) {
    this.fpsDroppedMonitoringPeriod = fpsDroppedMonitoringPeriod
    this.el.playerSetFpsDroppedMonitoringPeriod(this.fpsDroppedMonitoringPeriod)
  }

  setFpsDroppedMonitoringThreshold(fpsDroppedMonitoringThreshold) {
    this.fpsDroppedMonitoringThreshold = fpsDroppedMonitoringThreshold
    this.el.playerSetFpsDroppedMonitoringThreshold(this.fpsDroppedMonitoringThreshold)
  }

  setCapLevelonFPSDrop(capLevelonFPSDrop) {
    this.capLevelonFPSDrop = capLevelonFPSDrop
    this.el.playerSetCapLevelonFPSDrop(this.capLevelonFPSDrop)
  }

  setSmoothAutoSwitchonFPSDrop(smoothAutoSwitchonFPSDrop) {
    this.smoothAutoSwitchonFPSDrop = smoothAutoSwitchonFPSDrop
    this.el.playerSetSmoothAutoSwitchonFPSDrop(this.smoothAutoSwitchonFPSDrop)
  }

  setSwitchDownOnLevelError(switchDownOnLevelError) {
    this.switchDownOnLevelError = switchDownOnLevelError
    this.el.playerSetSwitchDownOnLevelError(this.switchDownOnLevelError)
  }

  setSeekMode(seekMode) {
    this.seekMode = seekMode
    this.el.playerSetSeekMode(this.seekMode)
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

  setMaxSkippedFragments(maxSkippedFragments) {
    this.maxSkippedFragments = maxSkippedFragments
    this.el.playerSetMaxSkippedFragments(this.maxSkippedFragments)
  }

  setFlushLiveURLCache(flushLiveURLCache) {
    this.flushLiveURLCache = flushLiveURLCache
    this.el.playerSetFlushLiveURLCache(this.flushLiveURLCache)
  }

  setInitialLiveManifestSize(initialLiveManifestSize) {
    this.initialLiveManifestSize = initialLiveManifestSize
    this.el.playerSetInitialLiveManifestSize(this.initialLiveManifestSize)
  }

  setManifestLoadMaxRetry(manifestLoadMaxRetry) {
    this.manifestLoadMaxRetry = manifestLoadMaxRetry
    this.el.playerSetManifestLoadMaxRetry(this.manifestLoadMaxRetry)
  }

  setManifestLoadMaxRetryTimeout(manifestLoadMaxRetryTimeout) {
    this.manifestLoadMaxRetryTimeout = manifestLoadMaxRetryTimeout
    this.el.playerSetManifestLoadMaxRetryTimeout(this.manifestLoadMaxRetryTimeout)
  }

  setManifestRedundantLoadmaxRetry(manifestRedundantLoadmaxRetry) {
    this.manifestRedundantLoadmaxRetry = manifestRedundantLoadmaxRetry
    this.el.playerSetManifestRedundantLoadmaxRetry(this.manifestRedundantLoadmaxRetry)
  }

  setStartFromBitrate(startFromBitrate) {
    this.startFromBitrate = startFromBitrate
    this.el.playerSetStartFromBitrate(this.startFromBitrate)
  }

  setStartFromLevel(startFromLevel) {
    this.startFromLevel = startFromLevel
    this.el.playerSetStartFromLevel(this.startFromLevel)
  }

  setAutoStartMaxDuration(autoStartMaxDuration) {
    this.autoStartMaxDuration = autoStartMaxDuration
    this.el.playerSetAutoStartMaxDuration(this.autoStartMaxDuration)
  }

  setSeekFromLevel(seekFromLevel) {
    this.seekFromLevel = seekFromLevel
    this.el.playerSetSeekFromLevel(this.seekFromLevel)
  }

  setUseHardwareVideoDecoder(useHardwareVideoDecoder) {
    this.useHardwareVideoDecoder = useHardwareVideoDecoder
    this.el.playerSetUseHardwareVideoDecoder(this.useHardwareVideoDecoder)
  }

  setSetLogInfo(hlsLogEnabled) {
    this.hlsLogEnabled = hlsLogEnabled
    this.el.playerSetLogInfo(this.hlsLogEnabled)
  }

  setLogDebug(logDebug) {
    this.logDebug = logDebug
    this.el.playerSetLogDebug(this.logDebug)
  }

  setLogDebug2(logDebug2) {
    this.logDebug2 = logDebug2
    this.el.playerSetLogDebug2(this.logDebug2)
  }

  setLogWarn(logWarn) {
    this.logWarn = logWarn
    this.el.playerSetLogWarn(this.logWarn)
  }

  setLogError(logError) {
    this.logError = logError
    this.el.playerSetLogError(this.logError)
  }

  levelChanged(level) {
    var currentLevel = this.el.getLevels()[level]
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
      this.trigger(Events.PLAYBACK_LEVEL_SWITCH_END)
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
      this.bufferingState = true
      this.trigger(Events.PLAYBACK_BUFFERING, this.name)
      this.updateCurrentState(state)
    } else if (["PLAYING", "PAUSED"].indexOf(state) >= 0) {
      if (["PLAYING_BUFFERING", "PAUSED_BUFFERING", "IDLE"].indexOf(this.currentState) >= 0) {
        this.bufferingState = false
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
        this.hasEnded = true
        this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 0, total: this.getDuration()}, this.name)
        this.trigger(Events.PLAYBACK_ENDED, this.name)
      }
    }
  }

  updateCurrentState(state) {
    this.currentState = state
    if (state !== "IDLE") {
      this.hasEnded = false
    }
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

  onLevelEndlist(level) {
    this.updatePlaybackType()
  }

  firstPlay() {
    this._shouldPlayOnManifestLoaded = true
    if (this.el.playerLoad) {
      Mediator.once(this.cid + ':manifestloaded', (duration, loadmetrics) => this.manifestLoaded(duration, loadmetrics))
      this.setFlashSettings() //ensure flushLiveURLCache will work (#327)
      this.el.playerLoad(this.src)
      this.srcLoaded = true
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
    this.trigger(Events.PLAYBACK_STOP)
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 0, total: 0}, this.name)
  }

  isPlaying() {
    if (this.currentState) {
      return !!(this.currentState.match(/playing/i))
    }
    return false
  }

  get isReady() {
    return this.isReadyState
  }

  getDuration() {
    return this.normalizeDuration(this.el.getDuration())
  }

  normalizeDuration(duration) {
    if (this.playbackType === Playback.LIVE) {
      // estimate 10 seconds of buffer time for live streams for seek positions
      duration = Math.max(0, duration - 10)
    }
    return duration
  }

  seekPercentage(percentage) {
    var duration = this.el.getDuration()
    var time = 0
    if (percentage > 0) {
      time = duration * percentage / 100
    }
    this.seek(time)
  }

  seek(time) {
    var duration = this.getDuration()
    if (this.playbackType === Playback.LIVE) {
      // seek operations to a time within 3 seconds from live stream will position playhead back to live
      var dvrInUse = duration - time > 3
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
    if (this._shouldPlayOnManifestLoaded) {
      this._shouldPlayOnManifestLoaded = false
      // this method initialises the player (and starts playback)
      // this needs to happen before PLAYBACK_LOADEDMETADATA is fired
      // as the user may call seek() in a LOADEDMETADATA listener.
      /// when playerPlay() is called the player seeks to 0
      this.el.playerPlay()
    }

    var levels = this.el.getLevels()
    var levelsLength = levels.length
    this._levels = []

    for (var index = 0 ; index < levelsLength ; index++) {
      this._levels.push({id: index, label: `${levels[index].height}p`, level: levels[index]})
    }
    this.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, this._levels)
    this.trigger(Events.PLAYBACK_LOADEDMETADATA, {duration: duration, data: loadmetrics})
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
