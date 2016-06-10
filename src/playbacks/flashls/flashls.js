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
  get swfPath() { return template(hlsSwf)({baseUrl: this._baseUrl}) }

  get levels() { return this._levels || [] }
  get currentLevel() {
    if (this._currentLevel === null || this._currentLevel === undefined) {
      return AUTO
    } else {
      return this._currentLevel //0 is a valid level ID
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
    return this._hasEnded
  }

  /**
   * Determine if the playback is buffering.
   * This is related to the PLAYBACK_BUFFERING and PLAYBACK_BUFFERFULL events
   * @property buffering
   * @type Boolean
   */
  get buffering() {
    return !!this._bufferingState && !this._hasEnded
  }

  constructor(options) {
    super(options)
    this._src = options.src
    this._baseUrl = options.baseUrl
    this._initHlsParameters(options)
    // TODO can this be private?
    this.highDefinition = false
    this._autoPlay = options.autoPlay
    this._loop = options.loop
    this._defaultSettings = {
      left: ['playstop'],
      default: ['seekbar'],
      right: ['fullscreen', 'volume', 'hd-indicator'],
      seekEnabled: false
    }
    this.settings = $.extend({}, this._defaultSettings)
    this._playbackType = Playback.LIVE
    this._hasEnded = false
    this._addListeners()
  }

  _initHlsParameters(options) {
    this._autoStartLoad = (options.autoStartLoad === undefined) ? true : options.autoStartLoad
    this._capLevelToStage = (options.capLevelToStage === undefined) ? false : options.capLevelToStage
    this._maxLevelCappingMode = (options.maxLevelCappingMode === undefined) ? 'downscale' : options.maxLevelCappingMode
    this._minBufferLength = (options.minBufferLength === undefined) ? -1 : options.minBufferLength
    this._minBufferLengthCapping = (options.minBufferLengthCapping === undefined) ? -1 : options.minBufferLengthCapping
    this._maxBufferLength = (options.maxBufferLength === undefined) ? 120 : options.maxBufferLength
    this._maxBackBufferLength = (options.maxBackBufferLength === undefined) ? 30 : options.maxBackBufferLength
    this._lowBufferLength = (options.lowBufferLength === undefined) ? 3 : options.lowBufferLength
    this._mediaTimePeriod = (options.mediaTimePeriod === undefined) ? 100 : options.mediaTimePeriod
    this._fpsDroppedMonitoringPeriod = (options.fpsDroppedMonitoringPeriod === undefined) ? 5000 : options.fpsDroppedMonitoringPeriod
    this._fpsDroppedMonitoringThreshold = (options.fpsDroppedMonitoringThreshold === undefined) ? 0.2 : options.fpsDroppedMonitoringThreshold
    this._capLevelonFPSDrop = (options.capLevelonFPSDrop === undefined) ? false : options.capLevelonFPSDrop
    this._smoothAutoSwitchonFPSDrop = (options.smoothAutoSwitchonFPSDrop === undefined) ? this.capLevelonFPSDrop : options.smoothAutoSwitchonFPSDrop
    this._switchDownOnLevelError = (options.switchDownOnLevelError === undefined) ? true : options.switchDownOnLevelError
    this._seekMode = (options.seekMode === undefined) ? 'ACCURATE' : options.seekMode
    this._keyLoadMaxRetry = (options.keyLoadMaxRetry === undefined) ? 3 : options.keyLoadMaxRetry
    this._keyLoadMaxRetryTimeout = (options.keyLoadMaxRetryTimeout === undefined) ? 64000 : options.keyLoadMaxRetryTimeout
    this._fragmentLoadMaxRetry = (options.fragmentLoadMaxRetry === undefined) ? 3 : options.fragmentLoadMaxRetry
    this._fragmentLoadMaxRetryTimeout = (options.fragmentLoadMaxRetryTimeout === undefined) ? 4000 : options.fragmentLoadMaxRetryTimeout
    this._fragmentLoadSkipAfterMaxRetry = (options.fragmentLoadSkipAfterMaxRetry === undefined) ? true : options.fragmentLoadSkipAfterMaxRetry
    this._maxSkippedFragments = (options.maxSkippedFragments === undefined) ? 5 : options.maxSkippedFragments
    this._flushLiveURLCache = (options.flushLiveURLCache === undefined) ? false : options.flushLiveURLCache
    this._initialLiveManifestSize = (options.initialLiveManifestSize === undefined) ? 1 : options.initialLiveManifestSize
    this._manifestLoadMaxRetry = (options.manifestLoadMaxRetry === undefined) ? 3 : options.manifestLoadMaxRetry
    this._manifestLoadMaxRetryTimeout = (options.manifestLoadMaxRetryTimeout === undefined) ? 64000 : options.manifestLoadMaxRetryTimeout
    this._manifestRedundantLoadmaxRetry = (options.manifestRedundantLoadmaxRetry === undefined) ? 3 : options.manifestRedundantLoadmaxRetry
    this._startFromBitrate = (options.startFromBitrate === undefined) ? -1 : options.startFromBitrate
    this._startFromLevel = (options.startFromLevel === undefined) ? -1 : options.startFromLevel
    this._autoStartMaxDuration = (options.autoStartMaxDuration === undefined) ? -1 : options.autoStartMaxDuration
    this._seekFromLevel = (options.seekFromLevel === undefined) ? -1 : options.seekFromLevel
    this._useHardwareVideoDecoder = (options.useHardwareVideoDecoder === undefined) ? false : options.useHardwareVideoDecoder
    this._hlsLogEnabled = (options.hlsLogEnabled === undefined) ? true : options.hlsLogEnabled
    this._logDebug = (options.logDebug === undefined) ? false : options.logDebug
    this._logDebug2 = (options.logDebug2 === undefined) ? false : options.logDebug2
    this._logWarn = (options.logWarn === undefined) ? true : options.logWarn
    this._logError = (options.logError === undefined) ? true : options.logError
    this._hlsMinimumDvrSize = (options.hlsMinimumDvrSize === undefined) ? 60 : options.hlsMinimumDvrSize
  }

  _addListeners() {
    Mediator.on(this.cid + ':flashready', () => this._bootstrap())
    Mediator.on(this.cid + ':timeupdate', (timeMetrics) => this._updateTime(timeMetrics))
    Mediator.on(this.cid + ':playbackstate', (state) => this._setPlaybackState(state))
    Mediator.on(this.cid + ':levelchanged', (level) => this._levelChanged(level))
    Mediator.on(this.cid + ':error', (code, url, message) => this._flashPlaybackError(code, url, message))
    Mediator.on(this.cid + ':fragmentloaded',(loadmetrics) => this._onFragmentLoaded(loadmetrics))
    Mediator.on(this.cid + ':levelendlist', (level) => this._onLevelEndlist(level))
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

  _bootstrap() {
    if (this.el.playerLoad) {
      this.el.width = '100%'
      this.el.height = '100%'
      this._isReadyState = true
      this._srcLoaded = false
      this._currentState = 'IDLE'
      this._setFlashSettings()
      this._updatePlaybackType()
      if (this._autoPlay || this._shouldPlayOnManifestLoaded) {
        this.play()
      }
      this.trigger(Events.PLAYBACK_READY, this.name)
    } else {
      this._bootstrapAttempts = this._bootstrapAttempts || 0
      if (++this._bootstrapAttempts <= MAX_ATTEMPTS) {
        setTimeout(() => this._bootstrap(), 50)
      } else {
        this.trigger(Events.PLAYBACK_ERROR, {message: 'Max number of attempts reached'}, this.name)
      }
    }
  }

  _setFlashSettings() {
    this.el.playerSetAutoStartLoad(this._autoStartLoad)
    this.el.playerSetCapLevelToStage(this._capLevelToStage)
    this.el.playerSetMaxLevelCappingMode(this._maxLevelCappingMode)
    this.el.playerSetMinBufferLength(this._minBufferLength)
    this.el.playerSetMinBufferLengthCapping(this._minBufferLengthCapping)
    this.el.playerSetMaxBufferLength(this._maxBufferLength)
    this.el.playerSetMaxBackBufferLength(this._maxBackBufferLength)
    this.el.playerSetLowBufferLength(this._lowBufferLength)
    this.el.playerSetMediaTimePeriod(this._mediaTimePeriod)
    this.el.playerSetFpsDroppedMonitoringPeriod(this._fpsDroppedMonitoringPeriod)
    this.el.playerSetFpsDroppedMonitoringThreshold(this._fpsDroppedMonitoringThreshold)
    this.el.playerSetCapLevelonFPSDrop(this._capLevelonFPSDrop)
    this.el.playerSetSmoothAutoSwitchonFPSDrop(this._smoothAutoSwitchonFPSDrop)
    this.el.playerSetSwitchDownOnLevelError(this._switchDownOnLevelError)
    this.el.playerSetSeekMode(this._seekMode)
    this.el.playerSetKeyLoadMaxRetry(this._keyLoadMaxRetry)
    this.el.playerSetKeyLoadMaxRetryTimeout(this._keyLoadMaxRetryTimeout)
    this.el.playerSetFragmentLoadMaxRetry(this._fragmentLoadMaxRetry)
    this.el.playerSetFragmentLoadMaxRetryTimeout(this._fragmentLoadMaxRetryTimeout)
    this.el.playerSetFragmentLoadSkipAfterMaxRetry(this._fragmentLoadSkipAfterMaxRetry)
    this.el.playerSetMaxSkippedFragments(this._maxSkippedFragments)
    this.el.playerSetFlushLiveURLCache(this._flushLiveURLCache)
    this.el.playerSetInitialLiveManifestSize(this._initialLiveManifestSize)
    this.el.playerSetManifestLoadMaxRetry(this._manifestLoadMaxRetry)
    this.el.playerSetManifestLoadMaxRetryTimeout(this._manifestLoadMaxRetryTimeout)
    this.el.playerSetManifestRedundantLoadmaxRetry(this._manifestRedundantLoadmaxRetry)
    this.el.playerSetStartFromBitrate(this._startFromBitrate)
    this.el.playerSetStartFromLevel(this._startFromLevel)
    this.el.playerSetAutoStartMaxDuration(this._autoStartMaxDuration)
    this.el.playerSetSeekFromLevel(this._seekFromLevel)
    this.el.playerSetUseHardwareVideoDecoder(this._useHardwareVideoDecoder)
    this.el.playerSetLogInfo(this._hlsLogEnabled)
    this.el.playerSetLogDebug(this._logDebug)
    this.el.playerSetLogDebug2(this._logDebug2)
    this.el.playerSetLogWarn(this._logWarn)
    this.el.playerSetLogError(this._logError)
  }

  setAutoStartLoad(autoStartLoad) {
    this._autoStartLoad = autoStartLoad
    this.el.playerSetAutoStartLoad(this._autoStartLoad)
  }

  setCapLevelToStage(capLevelToStage) {
    this._capLevelToStage = capLevelToStage
    this.el.playerSetCapLevelToStage(this._capLevelToStage)
  }

  setMaxLevelCappingMode(maxLevelCappingMode) {
    this._maxLevelCappingMode = maxLevelCappingMode
    this.el.playerSetMaxLevelCappingMode(this._maxLevelCappingMode)
  }

  setSetMinBufferLength(minBufferLength) {
    this._minBufferLength = minBufferLength
    this.el.playerSetMinBufferLength(this._minBufferLength)
  }

  setMinBufferLengthCapping(minBufferLengthCapping) {
    this._minBufferLengthCapping = minBufferLengthCapping
    this.el.playerSetMinBufferLengthCapping(this._minBufferLengthCapping)
  }

  setMaxBufferLength(maxBufferLength) {
    this._maxBufferLength = maxBufferLength
    this.el.playerSetMaxBufferLength(this._maxBufferLength)
  }

  setMaxBackBufferLength(maxBackBufferLength) {
    this._maxBackBufferLength = maxBackBufferLength
    this.el.playerSetMaxBackBufferLength(this._maxBackBufferLength)
  }

  setLowBufferLength(lowBufferLength) {
    this._lowBufferLength = lowBufferLength
    this.el.playerSetLowBufferLength(this._lowBufferLength)
  }

  setMediaTimePeriod(mediaTimePeriod) {
    this._mediaTimePeriod = mediaTimePeriod
    this.el.playerSetMediaTimePeriod(this._mediaTimePeriod)
  }

  setFpsDroppedMonitoringPeriod(fpsDroppedMonitoringPeriod) {
    this._fpsDroppedMonitoringPeriod = fpsDroppedMonitoringPeriod
    this.el.playerSetFpsDroppedMonitoringPeriod(this._fpsDroppedMonitoringPeriod)
  }

  setFpsDroppedMonitoringThreshold(fpsDroppedMonitoringThreshold) {
    this._fpsDroppedMonitoringThreshold = fpsDroppedMonitoringThreshold
    this.el.playerSetFpsDroppedMonitoringThreshold(this._fpsDroppedMonitoringThreshold)
  }

  setCapLevelonFPSDrop(capLevelonFPSDrop) {
    this._capLevelonFPSDrop = capLevelonFPSDrop
    this.el.playerSetCapLevelonFPSDrop(this._capLevelonFPSDrop)
  }

  setSmoothAutoSwitchonFPSDrop(smoothAutoSwitchonFPSDrop) {
    this._smoothAutoSwitchonFPSDrop = smoothAutoSwitchonFPSDrop
    this.el.playerSetSmoothAutoSwitchonFPSDrop(this._smoothAutoSwitchonFPSDrop)
  }

  setSwitchDownOnLevelError(switchDownOnLevelError) {
    this._switchDownOnLevelError = switchDownOnLevelError
    this.el.playerSetSwitchDownOnLevelError(this._switchDownOnLevelError)
  }

  setSeekMode(seekMode) {
    this._seekMode = seekMode
    this.el.playerSetSeekMode(this._seekMode)
  }

  setKeyLoadMaxRetry(keyLoadMaxRetry) {
    this._keyLoadMaxRetry = keyLoadMaxRetry
    this.el.playerSetKeyLoadMaxRetry(this._keyLoadMaxRetry)
  }

  setKeyLoadMaxRetryTimeout(keyLoadMaxRetryTimeout) {
    this._keyLoadMaxRetryTimeout = keyLoadMaxRetryTimeout
    this.el.playerSetKeyLoadMaxRetryTimeout(this._keyLoadMaxRetryTimeout)
  }

  setFragmentLoadMaxRetry(fragmentLoadMaxRetry) {
    this._fragmentLoadMaxRetry = fragmentLoadMaxRetry
    this.el.playerSetFragmentLoadMaxRetry(this._fragmentLoadMaxRetry)
  }

  setFragmentLoadMaxRetryTimeout(fragmentLoadMaxRetryTimeout) {
    this._fragmentLoadMaxRetryTimeout = fragmentLoadMaxRetryTimeout
    this.el.playerSetFragmentLoadMaxRetryTimeout(this._fragmentLoadMaxRetryTimeout)
  }

  setFragmentLoadSkipAfterMaxRetry(fragmentLoadSkipAfterMaxRetry) {
    this._fragmentLoadSkipAfterMaxRetry = fragmentLoadSkipAfterMaxRetry
    this.el.playerSetFragmentLoadSkipAfterMaxRetry(this._fragmentLoadSkipAfterMaxRetry)
  }

  setMaxSkippedFragments(maxSkippedFragments) {
    this._maxSkippedFragments = maxSkippedFragments
    this.el.playerSetMaxSkippedFragments(this._maxSkippedFragments)
  }

  setFlushLiveURLCache(flushLiveURLCache) {
    this._flushLiveURLCache = flushLiveURLCache
    this.el.playerSetFlushLiveURLCache(this._flushLiveURLCache)
  }

  setInitialLiveManifestSize(initialLiveManifestSize) {
    this._initialLiveManifestSize = initialLiveManifestSize
    this.el.playerSetInitialLiveManifestSize(this._initialLiveManifestSize)
  }

  setManifestLoadMaxRetry(manifestLoadMaxRetry) {
    this._manifestLoadMaxRetry = manifestLoadMaxRetry
    this.el.playerSetManifestLoadMaxRetry(this._manifestLoadMaxRetry)
  }

  setManifestLoadMaxRetryTimeout(manifestLoadMaxRetryTimeout) {
    this._manifestLoadMaxRetryTimeout = manifestLoadMaxRetryTimeout
    this.el.playerSetManifestLoadMaxRetryTimeout(this._manifestLoadMaxRetryTimeout)
  }

  setManifestRedundantLoadmaxRetry(manifestRedundantLoadmaxRetry) {
    this._manifestRedundantLoadmaxRetry = manifestRedundantLoadmaxRetry
    this.el.playerSetManifestRedundantLoadmaxRetry(this._manifestRedundantLoadmaxRetry)
  }

  setStartFromBitrate(startFromBitrate) {
    this._startFromBitrate = startFromBitrate
    this.el.playerSetStartFromBitrate(this._startFromBitrate)
  }

  setStartFromLevel(startFromLevel) {
    this._startFromLevel = startFromLevel
    this.el.playerSetStartFromLevel(this._startFromLevel)
  }

  setAutoStartMaxDuration(autoStartMaxDuration) {
    this._autoStartMaxDuration = autoStartMaxDuration
    this.el.playerSetAutoStartMaxDuration(this._autoStartMaxDuration)
  }

  setSeekFromLevel(seekFromLevel) {
    this._seekFromLevel = seekFromLevel
    this.el.playerSetSeekFromLevel(this._seekFromLevel)
  }

  setUseHardwareVideoDecoder(useHardwareVideoDecoder) {
    this._useHardwareVideoDecoder = useHardwareVideoDecoder
    this.el.playerSetUseHardwareVideoDecoder(this._useHardwareVideoDecoder)
  }

  setSetLogInfo(hlsLogEnabled) {
    this._hlsLogEnabled = hlsLogEnabled
    this.el.playerSetLogInfo(this._hlsLogEnabled)
  }

  setLogDebug(logDebug) {
    this._logDebug = logDebug
    this.el.playerSetLogDebug(this._logDebug)
  }

  setLogDebug2(logDebug2) {
    this._logDebug2 = logDebug2
    this.el.playerSetLogDebug2(this._logDebug2)
  }

  setLogWarn(logWarn) {
    this._logWarn = logWarn
    this.el.playerSetLogWarn(this._logWarn)
  }

  setLogError(logError) {
    this._logError = logError
    this.el.playerSetLogError(this._logError)
  }

  _levelChanged(level) {
    var currentLevel = this.el.getLevels()[level]
    if (currentLevel) {
      this.highDefinition = (currentLevel.height >= 720 || (currentLevel.bitrate / 1000) >= 2000)
      this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition)

      if (!this._levels || this._levels.length === 0) this._fillLevels()

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

  _updateTime(timeMetrics) {
    if (this._currentState === 'IDLE') {
      return
    }

    var duration = this._normalizeDuration(timeMetrics.duration)
    var position = Math.min(Math.max(timeMetrics.position, 0), duration)
    var previousDVRStatus = this._dvrEnabled
    var livePlayback = (this._playbackType === Playback.LIVE)
    this._dvrEnabled = (livePlayback && duration > this._hlsMinimumDvrSize)

    if (duration === 100 || livePlayback === undefined) {
      return
    }

    if (this._dvrEnabled !== previousDVRStatus) {
      this._updateSettings()
      this.trigger(Events.PLAYBACK_SETTINGSUPDATE, this.name)
    }

    if (livePlayback && (!this._dvrEnabled || !this._dvrInUse)) {
      position = duration
    }

    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: position, total: duration}, this.name)
  }

  play() {
    this.trigger(Events.PLAYBACK_PLAY_INTENT)
    if(this._currentState === 'PAUSED') {
      this.el.playerResume()
    } else if (!this._srcLoaded && this._currentState !== 'PLAYING') {
      this._firstPlay()
    } else {
      this.el.playerPlay()
    }
  }

  getPlaybackType() {
    return this._playbackType? this._playbackType: null
  }

  getCurrentLevelIndex() {
    return this._currentLevel
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

  _setPlaybackState(state) {
    if (['PLAYING_BUFFERING', 'PAUSED_BUFFERING'].indexOf(state) >= 0)  {
      this._bufferingState = true
      this.trigger(Events.PLAYBACK_BUFFERING, this.name)
      this._updateCurrentState(state)
    } else if (['PLAYING', 'PAUSED'].indexOf(state) >= 0) {
      if (['PLAYING_BUFFERING', 'PAUSED_BUFFERING', 'IDLE'].indexOf(this._currentState) >= 0) {
        this._bufferingState = false
        this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
      }
      this._updateCurrentState(state)
    } else if (state === 'IDLE') {
      this._srcLoaded = false
      if (this._loop && ['PLAYING_BUFFERING', 'PLAYING'].indexOf(this._currentState) >= 0) {
        this.play()
        this.seek(0)
      } else {
        this._updateCurrentState(state)
        this._hasEnded = true
        this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 0, total: this.getDuration()}, this.name)
        this.trigger(Events.PLAYBACK_ENDED, this.name)
      }
    }
  }

  _updateCurrentState(state) {
    this._currentState = state
    if (state !== 'IDLE') {
      this._hasEnded = false
    }
    this._updatePlaybackType()
    if (state === 'PLAYING') {
      this.trigger(Events.PLAYBACK_PLAY, this.name)
    } else if (state === 'PAUSED') {
      this.trigger(Events.PLAYBACK_PAUSE, this.name)
    }
  }

  _updatePlaybackType() {
    this._playbackType = this.el.getType()
    if (this._playbackType) {
      this._playbackType = this._playbackType.toLowerCase()
      if (this._playbackType === Playback.VOD) {
        this._startReportingProgress()
      } else {
        this._stopReportingProgress()
      }
    }
    this.trigger(Events.PLAYBACK_PLAYBACKSTATE, {type: this._playbackType})
  }

  _startReportingProgress() {
    if (!this._reportingProgress) {
      this._reportingProgress = true
    }
  }

  _stopReportingProgress() {
    this._reportingProgress = false
  }

  _onFragmentLoaded(loadmetrics) {
    this.trigger(Events.PLAYBACK_FRAGMENT_LOADED, loadmetrics)
    if (this._reportingProgress && this.el.getPosition) {
      var buffered = this.el.getPosition() + this.el.getbufferLength()
      this.trigger(Events.PLAYBACK_PROGRESS, {
        start: this.el.getPosition(),
        current: buffered,
        total: this.el.getDuration()
      })
    }
  }

  _onLevelEndlist() {
    this._updatePlaybackType()
  }

  _firstPlay() {
    this._shouldPlayOnManifestLoaded = true
    if (this.el.playerLoad) {
      Mediator.once(this.cid + ':manifestloaded', (duration, loadmetrics) => this._manifestLoaded(duration, loadmetrics))
      this._setFlashSettings() //ensure flushLiveURLCache will work (#327)
      this.el.playerLoad(this._src)
      this._srcLoaded = true
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
    if (this._playbackType !== Playback.LIVE || this._dvrEnabled) {
      this.el.playerPause()
      if (this._playbackType === Playback.LIVE && this._dvrEnabled) {
        this._updateDvr(true)
      }
    }
  }

  stop() {
    this._srcLoaded = false
    this.el.playerStop()
    this.trigger(Events.PLAYBACK_STOP)
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 0, total: 0}, this.name)
  }

  isPlaying() {
    if (this._currentState) {
      return !!(this._currentState.match(/playing/i))
    }
    return false
  }

  get isReady() {
    return this._isReadyState
  }

  getDuration() {
    return this._normalizeDuration(this.el.getDuration())
  }

  _normalizeDuration(duration) {
    if (this._playbackType === Playback.LIVE) {
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
    if (this._playbackType === Playback.LIVE) {
      // seek operations to a time within 3 seconds from live stream will position playhead back to live
      var dvrInUse = duration - time > 3
      this._updateDvr(dvrInUse)
    }
    this.el.playerSeek(time)
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: time, total: duration}, this.name)
  }

  _updateDvr(dvrInUse) {
    var previousDvrInUse = !!this._dvrInUse
    this._dvrInUse = dvrInUse
    if (this._dvrInUse !== previousDvrInUse) {
      this._updateSettings()
      this.trigger(Events.PLAYBACK_DVR, this._dvrInUse)
      this.trigger(Events.PLAYBACK_STATS_ADD, {'dvr': this._dvrInUse})
    }
  }

  _flashPlaybackError(code, url, message) {
    this.trigger(Events.PLAYBACK_ERROR, {code: code, url: url, message: message})
    this.trigger(Events.PLAYBACK_STOP)
  }

  _manifestLoaded(duration, loadmetrics) {
    if (this._shouldPlayOnManifestLoaded) {
      this._shouldPlayOnManifestLoaded = false
      // this method initialises the player (and starts playback)
      // this needs to happen before PLAYBACK_LOADEDMETADATA is fired
      // as the user may call seek() in a LOADEDMETADATA listener.
      /// when playerPlay() is called the player seeks to 0
      this.el.playerPlay()
    }

    this._fillLevels()
    this.trigger(Events.PLAYBACK_LOADEDMETADATA, {duration: duration, data: loadmetrics})
  }

  _fillLevels() {
    var levels = this.el.getLevels()
    var levelsLength = levels.length
    this._levels = []

    for (var index = 0 ; index < levelsLength ; index++) {
      this._levels.push({id: index, label: `${levels[index].height}p`, level: levels[index]})
    }
    this.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, this._levels)
  }

  destroy() {
    this.stopListening()
    this.$el.remove()
  }

  _updateSettings() {
    this.settings = $.extend({}, this._defaultSettings)
    if (this._playbackType === Playback.VOD || this._dvrInUse) {
      this.settings.left = ['playpause', 'position', 'duration']
      this.settings.seekEnabled = true
    } else if (this._dvrEnabled) {
      this.settings.left = ['playpause']
      this.settings.seekEnabled = true
    } else {
      this.settings.seekEnabled = false
    }
  }

  _createCallbacks() {
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
    this._createCallbacks()
    return this
  }
}

FlasHLS.canPlay = function(resource, mimeType) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  return Browser.hasFlash &&
        ((resourceParts.length > 1 && resourceParts[1] === 'm3u8') ||
          mimeType === 'application/x-mpegURL' || mimeType === 'application/vnd.apple.mpegurl')
}
