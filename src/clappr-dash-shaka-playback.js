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

  constructor (...args) {
    super(...args)
    this._levels = []
    this._pendingAdaptationEvent = false
    this._isShakaReadyState = false
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
        throw new Error('Unhandled track type:', track.type);
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

  _setup () {
    this._isShakaReadyState = false
    this._ccIsSetup = false
    this._player = this._createPlayer()
    this._options.shakaConfiguration && this._player.configure(this._options.shakaConfiguration)
    this._options.shakaOnBeforeLoad && this._options.shakaOnBeforeLoad(this._player)

    let playerLoaded = this._player.load(this._options.src)
    playerLoaded.then(() => this._loaded())
      .catch((e) => this._setupError(e))
  }

  _createPlayer () {
    let player = new shaka.Player(this.el)
    player.addEventListener('error', this._onError.bind(this))
    player.addEventListener('adaptation', this._onAdaptation.bind(this))
    player.addEventListener('buffering', this._onBuffering.bind(this))
    return player
  }

  _onBuffering (e) {
    if (this._stopped) return
    let event = e.buffering ? Events.PLAYBACK_BUFFERING : Events.PLAYBACK_BUFFERFULL
    this.trigger(event)
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
      level: activeVideo.id
    })
  }

  _destroy () {
    this._isShakaReadyState = false
    Log.debug('shaka was destroyed')
  }
}

export default DashShakaPlayback
