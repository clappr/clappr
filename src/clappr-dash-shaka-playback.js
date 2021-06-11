import {HTML5Video, Log, Events, PlayerError} from 'clappr'
import shaka from 'shaka-player'

const SEND_STATS_INTERVAL_MS = 30 * 1e3
const DEFAULT_LEVEL_AUTO = -1

class DashShakaPlayback extends HTML5Video {
  static get Events () {
    return {
      SHAKA_READY: 'shaka:ready'
    }
  }

  static get shakaPlayer() { return shaka }

  static canPlay (resource, mimeType = '') {
    shaka.polyfill.installAll()
    let browserSupported = shaka.Player.isBrowserSupported()
    let resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
    return browserSupported && ((resourceParts[1] === 'mpd') || mimeType.indexOf('application/dash+xml') > -1)
  }

  get name () {
    return 'dash_shaka_playback'
  }

  get shakaVersion () {
    return shaka.player.Player.version
  }

  get shakaPlayerInstance () {
    return this._player
  }

  get levels () {
    return this._levels
  }

  get seekRange() {
    if (!this.shakaPlayerInstance) return { start: 0, end: 0}

    return this.shakaPlayerInstance.seekRange()
  }

  set currentLevel (id) {
    this._currentLevelId = id
    let isAuto = this._currentLevelId === DEFAULT_LEVEL_AUTO

    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_START)
    if (!isAuto) {
      this._player.configure({abr: {enabled: false}})
      this._pendingAdaptationEvent = true
      this.selectTrack(this.videoTracks.filter((t) => t.id === this._currentLevelId)[0])
    }
    else {
      this._player.configure({abr: {enabled: true}})
      this.trigger(Events.PLAYBACK_LEVEL_SWITCH_END)
    }
  }

  get currentLevel () {
    return this._currentLevelId || DEFAULT_LEVEL_AUTO
  }

  get dvrEnabled() {
    return this._duration >= this._minDvrSize && this.getPlaybackType() === 'live'
  }

  getDuration() {
    return this._duration
  }

  get _duration() {
    if (!this.shakaPlayerInstance) return 0

    return this.seekRange.end - this.seekRange.start
  }

  getCurrentTime() {
    if (!this.shakaPlayerInstance) return 0

    return this.shakaPlayerInstance.getMediaElement().currentTime - this.seekRange.start
  }

  get _startTime() {
    return this.seekRange.start
  }

  get presentationStartTimeAsDate() {
    if (!this.shakaPlayerInstance || !this.shakaPlayerInstance.getPresentationStartTimeAsDate()) return 0

    return new Date(this.shakaPlayerInstance.getPresentationStartTimeAsDate().getTime() + this.seekRange.start * 1000)
  }

  get bandwidthEstimate() {
    if (!this.shakaPlayerInstance) return null
    return this.shakaPlayerInstance.getStats().estimatedBandwidth
  }

  constructor (...args) {
    super(...args)
    this._levels = []
    this._pendingAdaptationEvent = false
    this._isShakaReadyState = false

    this._minDvrSize = typeof (this.options.shakaMinimumDvrSize) === 'undefined' ? 60 : this.options.shakaMinimumDvrSize
  }

  getProgramDateTime() {
    if (!this.shakaPlayerInstance || !this.presentationTimeline) return 0

    return new Date((this.presentationTimeline.getPresentationStartTime() + this.seekRange.start) * 1000)
  }

  _updateDvr(status) {
    this.trigger(Events.PLAYBACK_DVR, status)
    this.trigger(Events.PLAYBACK_STATS_ADD, { 'dvr': status })
  }

  seek(time) {
    if (time < 0) {
      Log.warn('Attempt to seek to a negative time. Resetting to live point. Use seekToLivePoint() to seek to the live point.')
      time = this._duration
    }
    // assume live if time within 3 seconds of end of stream
    this.dvrEnabled && this._updateDvr(time < this._duration-3)
    time += this._startTime
    this.el.currentTime = time
  }

  pause() {
    this.el.pause()
    this.dvrEnabled && this._updateDvr(true)
  }

  play () {
    if (!this._player) {
      this._setup()
    }

    if (!this.isReady) {
      this.once(DashShakaPlayback.Events.SHAKA_READY, this.play)
      return
    }

    this._stopped = false
    this._src = this.el.src
    super.play()
    this._startTimeUpdateTimer()
  }

  _onPlaying() {
    /*
      The `_onPlaying` should not be called while buffering: https://github.com/google/shaka-player/issues/2230
      It will be executed on bufferfull.
    */
    if (this._isBuffering) return
    return super._onPlaying()
  }

  _onSeeking() {
    this._isSeeking = true
    return super._onSeeking()
  }

  _onSeeked() {
    /*
      The `_onSeeked` should not be called while buffering.
      It will be executed on bufferfull.
    */
    if (this._isBuffering) return

    this._isSeeking = false
    return super._onSeeked()
  }

  _startTimeUpdateTimer() {
    this._stopTimeUpdateTimer()
    this._timeUpdateTimer = setInterval(() => {
      this._onTimeUpdate()
    }, 100)
  }

  _stopTimeUpdateTimer() {
    this._timeUpdateTimer && clearInterval(this._timeUpdateTimer)
  }

  // skipping HTML5Video `_setupSrc` (on tag video)
  _setupSrc () {}

  // skipping ready event on video tag in favor of ready on shaka
  _ready () {
    // override with no-op
  }

  _onShakaReady() {
    this._isShakaReadyState = true
    this.trigger(DashShakaPlayback.Events.SHAKA_READY)
    this.trigger(Events.PLAYBACK_READY, this.name)
  }

  get isReady () {
    return this._isShakaReadyState
  }

  // skipping error handling on video tag in favor of error on shaka
  error (event) {
    Log.error('an error was raised by the video tag', event, this.el.error)
  }

  isHighDefinitionInUse () {
    return !!this.highDefinition
  }

  stop () {
    this._stopTimeUpdateTimer()
    clearInterval(this.sendStatsId)
    this._stopped = true

    if (this._player) {
      this._sendStats()

      this._player.unload().then(() => {
        super.stop()
        this._player = null
        this._isShakaReadyState = false
      }).catch(() => {
        Log.error('shaka could not be unloaded')
      })
    } else {
      super.stop()
    }
  }

  get textTracks () {
    return this.isReady && this._player.getTextTracks()
  }

  get audioTracks () {
    return this.isReady && this._player.getVariantTracks().filter((t) => t.mimeType.startsWith('audio/'))
  }

  get videoTracks () {
    return this.isReady && this._player.getVariantTracks().filter((t) => t.mimeType.startsWith('video/'))
  }

  getPlaybackType () {
    return (this.isReady && this._player.isLive() ? 'live' : 'vod') || ''
  }

  selectTrack (track) {
    if (track.type === 'text') {
      this._player.selectTextTrack(track)
    } else if (track.type === 'variant') {
      this._player.selectVariantTrack(track)
      if (track.mimeType.startsWith('video/')) {
        // we trigger the adaptation event here
        // because Shaka doesn't trigger its event on "manual" selection.
        this._onAdaptation()
      }
    } else {
      throw new Error('Unhandled track type:', track.type)
    }
  }

  /**
   * @override
   */
  get closedCaptionsTracks() {
    let id = 0
    let trackId = () => { return id++ }
    let tracks = this.textTracks || []

    return tracks
      .filter(track => track.kind === 'subtitle')
      .map(track => { return {id: trackId(), name: track.label || track.language, track: track} })
  }

  /**
   * @override
   */
  get closedCaptionsTrackId() {
    return super.closedCaptionsTrackId
  }

  /**
   * @override
   */
  set closedCaptionsTrackId(trackId) {
    if (!this._player) {
      return
    }

    let tracks = this.closedCaptionsTracks
    let showingTrack

    // Note: -1 is for hide all tracks
    if (trackId !== -1) {
      showingTrack = tracks.find(track => track.id === trackId)
      if (!showingTrack) {
        Log.warn(`Track id "${trackId}" not found`)
        return
      }
      if (this._shakaTTVisible && showingTrack.track.active === true) {
        Log.info(`Track id "${trackId}" already showing`)
        return
      }
    }

    if (showingTrack) {
      this._player.selectTextTrack(showingTrack.track)
      this._player.setTextTrackVisibility(true)
      this._enableShakaTextTrack(true)
    } else {
      this._player.setTextTrackVisibility(false)
      this._enableShakaTextTrack(false)
    }

    this._ccTrackId = trackId
    this.trigger(Events.PLAYBACK_SUBTITLE_CHANGED, {
      id: trackId
    })
  }

  _enableShakaTextTrack(isEnable) {
    // Shaka player use only one TextTrack object with video element to handle all text tracks
    // It must be enabled or disabled in addition to call selectTextTrack()
    if (!this.el.textTracks) {
      return
    }

    this._shakaTTVisible = isEnable

    Array.from(this.el.textTracks)
      .filter(track => track.kind === 'subtitles')
      .forEach(track => track.mode = isEnable === true ? 'showing' : 'hidden')
  }

  _checkForClosedCaptions() {
    if (this._ccIsSetup) {
      return
    }

    if (this.hasClosedCaptionsTracks) {
      this.trigger(Events.PLAYBACK_SUBTITLE_AVAILABLE)
      const trackId = this.closedCaptionsTrackId
      this.closedCaptionsTrackId = trackId
    }
    this._ccIsSetup = true
  }

  destroy () {
    this._stopTimeUpdateTimer()
    clearInterval(this.sendStatsId)

    if (this._player) {
      this._player.destroy()
        .then(() => this._destroy())
        .catch(() => {
          this._destroy()
          Log.error('shaka could not be destroyed')
        })
    } else {
      this._destroy()
    }

    super.destroy()
  }

  _setup() {
    this._isShakaReadyState = false
    this._ccIsSetup = false

    let runAllSteps = () => {
      this._player = this._createPlayer()
      this._setInitialConfig()
      this._loadSource()
    }

    this._player
      ? this._player.destroy().then(() => runAllSteps())
      : runAllSteps()
  }

  _createPlayer() {
    let player = new shaka.Player(this.el)
    player.addEventListener('error', this._onError.bind(this))
    player.addEventListener('adaptation', this._onAdaptation.bind(this))
    player.addEventListener('buffering', this._handleShakaBufferingEvents.bind(this))
    return player
  }

  _setInitialConfig() {
    this._options.shakaConfiguration && this._player.configure(this._options.shakaConfiguration)
    this._options.shakaOnBeforeLoad && this._options.shakaOnBeforeLoad(this._player)
  }

  _loadSource() {
    this._player.load(this._options.src)
      .then(() => this._loaded())
      .catch((e) => this._setupError(e))
  }

  _onTimeUpdate() {
    if (!this.shakaPlayerInstance) return

    let update = {
      current: this.getCurrentTime(),
      total: this.getDuration(),
      firstFragDateTime: this.presentationStartTimeAsDate
    }
    let isSame = this._lastTimeUpdate && (
      update.current === this._lastTimeUpdate.current &&
      update.total === this._lastTimeUpdate.total)
    if (isSame)
      return

    this._lastTimeUpdate = update
    this.trigger(Events.PLAYBACK_TIMEUPDATE, update, this.name)
  }

  // skipping HTML5 `_handleBufferingEvents` in favor of shaka buffering events
  _handleBufferingEvents() {}

  _handleShakaBufferingEvents(e) {
    if (this._stopped) return

    this._isBuffering = e.buffering
    this._isBuffering ? this._onBuffering() : this._onBufferfull()
  }

  _onBuffering () {
    this.trigger(Events.PLAYBACK_BUFFERING)
  }

  _onBufferfull() {
    this.trigger(Events.PLAYBACK_BUFFERFULL)
    if (this._isSeeking) this._onSeeked()
    if (this.isPlaying()) this._onPlaying()
  }

  _loaded () {
    this._onShakaReady()
    this._startToSendStats()
    this._fillLevels()
    this._checkForClosedCaptions()
  }

  _fillLevels () {
    if (this._levels.length === 0) {
      this._levels = this.videoTracks.map((videoTrack) => { return {id: videoTrack.id, label: `${videoTrack.height}p`} }).reverse()
      this.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, this.levels)
    }
  }

  _startToSendStats () {
    const intervalMs = this._options.shakaSendStatsInterval || SEND_STATS_INTERVAL_MS
    this.sendStatsId = setInterval(() => this._sendStats(), intervalMs)
  }

  _sendStats () {
    this.trigger(Events.PLAYBACK_STATS_ADD, this._player.getStats())
  }

  _setupError (err) {
    this._onError(err)
  }

  _onError (err) {
    const error = {
      shakaError: err,
      videoError: this.el.error
    }

    let { category, code, severity } = error.shakaError.detail || error.shakaError

    if (error.videoError || !code && !category) return super._onError()

    const isCritical = severity === shaka.util.Error.Severity.CRITICAL
    const errorData = {
      code: `${category}_${code}`,
      description: `Category: ${category}, code: ${code}, severity: ${severity}`,
      level: isCritical ? PlayerError.Levels.FATAL : PlayerError.Levels.WARN,
      raw: err
    }
    const formattedError = this.createError(errorData)
    Log.error('Shaka error event:', formattedError)
    this.trigger(Events.PLAYBACK_ERROR, formattedError)
  }


  _onAdaptation () {
    let activeVideo = this.videoTracks.filter((t) => t.active === true)[0]

    this._fillLevels()

    // update stats that may have changed before we trigger event
    // so that user can rely on stats data when handling event
    this._sendStats()

    if (this._pendingAdaptationEvent) {
      this.trigger(Events.PLAYBACK_LEVEL_SWITCH_END)
      this._pendingAdaptationEvent = false
    }

    Log.debug('an adaptation has happened:', activeVideo)
    this.highDefinition = (activeVideo.height >= 720)
    this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition)
    this.trigger(Events.PLAYBACK_BITRATE, {
      bandwidth: activeVideo.bandwidth,
      width: activeVideo.width,
      height: activeVideo.height,
      level: activeVideo.id,
      bitrate: activeVideo.videoBandwidth
    })
  }

  _updateSettings() {
    if (this.getPlaybackType() === 'vod')
      this.settings.left = ['playpause', 'position', 'duration']
    else if (this.dvrEnabled)
      this.settings.left = ['playpause']
    else
      this.settings.left = ['playstop']

    this.settings.seekEnabled = this.isSeekEnabled()
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  _destroy () {
    this._isShakaReadyState = false
    Log.debug('shaka was destroyed')
  }
}

export default DashShakaPlayback
