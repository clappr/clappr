// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {isNumber, seekStringToSeconds, DomRecycler} from '../../base/utils'

import Playback from '../../base/playback'
import Browser from '../../components/browser'
import Events from '../../base/events'
import $ from 'clappr-zepto'
import template from '../../base/template'
import tracksHTML from './public/tracks.html'
import './public/style.scss'

const MIMETYPES = {
  'mp4': ['avc1.42E01E', 'avc1.58A01E', 'avc1.4D401E', 'avc1.64001E', 'mp4v.20.8', 'mp4v.20.240', 'mp4a.40.2'].map(
    (codec) => { return 'video/mp4; codecs="' + codec + ', mp4a.40.2"'}),
  'ogg': ['video/ogg; codecs="theora, vorbis"', 'video/ogg; codecs="dirac"', 'video/ogg; codecs="theora, speex"'],
  '3gpp': ['video/3gpp; codecs="mp4v.20.8, samr"'],
  'webm': ['video/webm; codecs="vp8, vorbis"'],
  'mkv': ['video/x-matroska; codecs="theora, vorbis"'],
  'm3u8': ['application/x-mpegurl']
}
MIMETYPES['ogv'] = MIMETYPES['ogg']
MIMETYPES['3gp'] = MIMETYPES['3gpp']

const AUDIO_MIMETYPES = {
  'wav': ['audio/wav'],
  'mp3': ['audio/mp3', 'audio/mpeg;codecs="mp3"'],
  'aac': ['audio/mp4;codecs="mp4a.40.5"'],
  'oga': ['audio/ogg']
}

const KNOWN_AUDIO_MIMETYPES = Object.keys(AUDIO_MIMETYPES).reduce((acc, k) => [...acc, ...AUDIO_MIMETYPES[k]], [])

// TODO: rename this Playback to HTML5Playback (breaking change, only after 0.3.0)
export default class HTML5Video extends Playback {
  get name() { return 'html5_video' }
  get tagName() { return this.isAudioOnly ? 'audio' : 'video' }

  get isAudioOnly() {
    const resourceUrl = this.options.src
    let mimeTypes = HTML5Video._mimeTypesForUrl(resourceUrl, AUDIO_MIMETYPES, this.options.mimeType)
    return this.options.playback && this.options.playback.audioOnly || this.options.audioOnly || KNOWN_AUDIO_MIMETYPES.indexOf(mimeTypes[0]) >= 0
  }

  get attributes() {
    return {
      'data-html5-video': ''
    }
  }

  get events() {
    return {
      'canplay': '_onCanPlay',
      'canplaythrough': '_handleBufferingEvents',
      'durationchange': '_onDurationChange',
      'ended': '_onEnded',
      'error': '_onError',
      'loadeddata': '_onLoadedData',
      'loadedmetadata': '_onLoadedMetadata',
      'pause': '_onPause',
      'playing': '_onPlaying',
      'progress': '_onProgress',
      'seeking': '_handleBufferingEvents',
      'seeked': '_onSeeked',
      'stalled': '_handleBufferingEvents',
      'timeupdate': '_onTimeUpdate',
      'waiting': '_onWaiting'
    }
  }

  /**
   * Determine if the playback has ended.
   * @property ended
   * @type Boolean
   */
  get ended() {
    return this.el.ended
  }

  /**
   * Determine if the playback is having to buffer in order for
   * playback to be smooth.
   * This is related to the PLAYBACK_BUFFERING and PLAYBACK_BUFFERFULL events
   * @property buffering
   * @type Boolean
   */
  get buffering() {
    return this._isBuffering
  }

  constructor(...args) {
    super(...args)
    this._destroyed = false
    this._loadStarted = false
    this._isBuffering = false
    this._playheadMoving = false
    this._playheadMovingTimer = null
    this._stopped = false
    this._ccTrackId = -1
    this._setupSrc(this.options.src)
    // backwards compatibility (TODO: remove on 0.3.0)
    this.options.playback || (this.options.playback = this.options || {})
    this.options.playback.disableContextMenu = this.options.playback.disableContextMenu || this.options.disableVideoTagContextMenu

    const playbackConfig = this.options.playback
    const preload = playbackConfig.preload || (Browser.isSafari ? 'auto' : this.options.preload)

    let posterUrl // FIXME: poster plugin should always convert poster to object with expected properties ?
    if (this.options.poster) {
      if (typeof this.options.poster === 'string') {
        posterUrl = this.options.poster
      } else if (typeof this.options.poster.url === 'string') {
        posterUrl = this.options.poster.url
      }
    }

    $.extend(this.el, {
      muted: this.options.mute,
      defaultMuted: this.options.mute,
      loop: this.options.loop,
      poster: posterUrl,
      preload: preload || 'metadata',
      controls: (playbackConfig.controls || this.options.useVideoTagDefaultControls) && 'controls',
      crossOrigin: playbackConfig.crossOrigin,
      'x-webkit-playsinline': playbackConfig.playInline
    })

    playbackConfig.playInline && (this.$el.attr({playsinline: 'playsinline'}))
    playbackConfig.crossOrigin && (this.$el.attr({crossorigin: playbackConfig.crossOrigin}))

    // TODO should settings be private?
    this.settings = {default: ['seekbar']}
    this.settings.left = ['playpause', 'position', 'duration']
    this.settings.right = ['fullscreen', 'volume', 'hd-indicator']

    playbackConfig.externalTracks && (this._setupExternalTracks(playbackConfig.externalTracks))

    // https://github.com/clappr/clappr/issues/1076
    this.options.autoPlay && process.nextTick(() => !this._destroyed && this.play())
  }

  _setupExternalTracks(tracks) {
    this._externalTracks = tracks.map(track => {
      return {
        kind: track.kind || 'subtitles', // Default is 'subtitles'
        label: track.label,
        lang: track.lang,
        src: track.src,
      }
    })
  }

  /**
   * Sets the source url on the <video> element, and also the 'src' property.
   * @method setupSrc
   * @private
   * @param {String} srcUrl The source URL.
   */
  _setupSrc(srcUrl) {
    if (this.el.src === srcUrl) {
      return
    }
    this._ccIsSetup = false
    this.el.src = srcUrl
    this._src = this.el.src
  }

  _onLoadedMetadata(e) {
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_LOADEDMETADATA, {duration: e.target.duration, data: e})
    this._updateSettings()
    const autoSeekFromUrl = typeof(this._options.autoSeekFromUrl) === 'undefined' || this._options.autoSeekFromUrl
    if (this.getPlaybackType() !== Playback.LIVE && autoSeekFromUrl) {
      this._checkInitialSeek()
    }
  }

  _onDurationChange() {
    this._updateSettings()
    this._onTimeUpdate()
    // onProgress uses the duration
    this._onProgress()
  }

  _updateSettings() {
    // we can't figure out if hls resource is VoD or not until it is being loaded or duration has changed.
    // that's why we check it again and update media control accordingly.
    if (this.getPlaybackType() === Playback.VOD || this.getPlaybackType() === Playback.AOD) {
      this.settings.left = ['playpause', 'position', 'duration']
    } else {
      this.settings.left = ['playstop']
    }
    this.settings.seekEnabled = this.isSeekEnabled()
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  isSeekEnabled() {
    return isFinite(this.getDuration())
  }

  getPlaybackType() {
    const onDemandType = this.tagName === 'audio' ? Playback.AOD : Playback.VOD
    return [0, undefined, Infinity].indexOf(this.el.duration) >= 0 ? Playback.LIVE : onDemandType
  }

  isHighDefinitionInUse() {
    return false
  }

  // On mobile device, HTML5 video element "retains" user action consent if
  // load() method is called. See Player.consent().
  consent() {
    !this.isPlaying() && this.el.load()
  }

  play() {
    this.trigger(Events.PLAYBACK_PLAY_INTENT)
    this._stopped = false
    this._setupSrc(this._src)
    this._handleBufferingEvents()
    let promise = this.el.play()
    // For more details, see https://developers.google.com/web/updates/2016/03/play-returns-promise
    if (promise && promise.catch) {
      promise.catch(() => {})
    }
  }

  pause() {
    this.el.pause()
  }

  stop() {
    this.pause()
    this._stopped = true
    // src will be added again in play()
    this.el.removeAttribute('src')
    this._stopPlayheadMovingChecks()
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_STOP)
  }

  volume(value) {
    if (value === 0) {
      this.$el.attr({muted: 'true'})
      this.el.muted = true
    } else {
      this.$el.attr({muted: null})
      this.el.muted = false
    }
    this.el.volume = value / 100
  }

  /**
   * @deprecated
   * @private
   */
  mute() {
    this.el.muted = true;
  }

  /**
   * @deprecated
   * @private
   */
  unmute() {
    this.el.muted = false;
  }

  isMuted() {
    return !!this.el.volume
  }

  isPlaying() {
    return !this.el.paused && !this.el.ended
  }

  get isReady() {
    return this._isReadyState
  }

  _startPlayheadMovingChecks() {
    if (this._playheadMovingTimer !== null) {
      return
    }
    this._playheadMovingTimeOnCheck = null
    this._determineIfPlayheadMoving()
    this._playheadMovingTimer = setInterval(this._determineIfPlayheadMoving.bind(this), 500)
  }

  _stopPlayheadMovingChecks() {
    if (this._playheadMovingTimer === null) {
      return
    }
    clearInterval(this._playheadMovingTimer)
    this._playheadMovingTimer = null
    this._playheadMoving = false
  }

  _determineIfPlayheadMoving() {
    const before = this._playheadMovingTimeOnCheck
    const now = this.el.currentTime
    this._playheadMoving = before !== now
    this._playheadMovingTimeOnCheck = now
    this._handleBufferingEvents()
  }

  // this seems to happen when the user is having to wait
  // for something to happen AFTER A USER INTERACTION
  // e.g the player might be buffering, but when `play()` is called
  // only at this point will this be called.
  // Or the user may seek somewhere but the new area requires buffering,
  // so it will fire then as well.
  // On devices where playing is blocked until requested with a user action,
  // buffering may start, but never finish until the user initiates a play,
  // but this only happens when play is actually requested
  _onWaiting() {
    this._loadStarted = true
    this._handleBufferingEvents()
  }

  // called after the first frame has loaded
  // note this doesn't fire on ios before the user has requested play
  // ideally the "loadstart" event would be used instead, but this fires
  // before a user has requested play on iOS, and also this is always fired
  // even if the preload setting is "none". In both these cases this causes
  // infinite buffering until the user does something which isn't great.
  _onLoadedData() {
    this._loadStarted = true
    this._handleBufferingEvents()
  }

  // note this doesn't fire on ios before user has requested play
  _onCanPlay() {
    this._handleBufferingEvents()
  }

  _onPlaying() {
    this._checkForClosedCaptions()
    this._startPlayheadMovingChecks()
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_PLAY)
  }

  _onPause() {
    this._stopPlayheadMovingChecks()
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_PAUSE)
  }

  _onSeeked() {
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_SEEKED)
  }

  _onEnded() {
    this._handleBufferingEvents()
    this.trigger(Events.PLAYBACK_ENDED, this.name)
  }

  // The playback should be classed as buffering if the following are true:
  // - the ready state is less then HAVE_FUTURE_DATA or the playhead isn't moving and it should be
  // - the media hasn't "ended",
  // - the media hasn't been stopped
  // - loading has started
  _handleBufferingEvents() {
    const playheadShouldBeMoving = !this.el.ended && !this.el.paused
    const buffering = this._loadStarted && !this.el.ended && !this._stopped && ((playheadShouldBeMoving && !this._playheadMoving) || this.el.readyState < this.el.HAVE_FUTURE_DATA)
    if (this._isBuffering !== buffering) {
      this._isBuffering = buffering
      if (buffering) {
        this.trigger(Events.PLAYBACK_BUFFERING, this.name)
      } else {
        this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
      }
    }
  }

  _onError() {
    this.trigger(Events.PLAYBACK_ERROR, this.el.error, this.name)
  }

  destroy() {
    this._destroyed = true
    this.handleTextTrackChange && this.el.textTracks.removeEventListener('change', this.handleTextTrackChange)
    this.$el.remove()
    this.el.src = ''
    this._src = null
    DomRecycler.garbage(this.$el)
  }

  seek(time) {
    this.el.currentTime = time
  }

  seekPercentage(percentage) {
    const time = this.el.duration * (percentage / 100)
    this.seek(time)
  }

  _checkInitialSeek() {
    const seekTime = seekStringToSeconds()
    if (seekTime !== 0) {
      this.seek(seekTime)
    }
  }

  getCurrentTime() {
    return this.el.currentTime
  }

  getDuration() {
    return this.el.duration
  }

  _onTimeUpdate() {
    if (this.getPlaybackType() === Playback.LIVE) {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 1, total: 1}, this.name)
    } else {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: this.el.currentTime, total: this.el.duration}, this.name)
    }
  }

  _onProgress() {
    if (!this.el.buffered.length) {
      return
    }
    let buffered = []
    let bufferedPos = 0
    for (let i = 0;  i < this.el.buffered.length; i++) {
      buffered = [...buffered, {start: this.el.buffered.start(i), end: this.el.buffered.end(i)}]
      if (this.el.currentTime >= buffered[i].start && this.el.currentTime <= buffered[i].end) {
        bufferedPos = i
      }
    }
    const progress = {
      start: buffered[bufferedPos].start,
      current: buffered[bufferedPos].end,
      total: this.el.duration
    }
    this.trigger(Events.PLAYBACK_PROGRESS, progress, buffered)
  }

  _typeFor(src) {
    let mimeTypes = HTML5Video._mimeTypesForUrl(src, MIMETYPES, this.options.mimeType)
    if (mimeTypes.length == 0) {
      mimeTypes = HTML5Video._mimeTypesForUrl(src, AUDIO_MIMETYPES, this.options.mimeType)
    }
    const mimeType = mimeTypes[0] || ''
    return mimeType.split(';')[0]
  }

  _ready() {
    if (this._isReadyState) {
      return
    }
    this._isReadyState = true
    this.trigger(Events.PLAYBACK_READY, this.name)
  }

  _checkForClosedCaptions() {
    // Check if CC available only if current playback is HTML5Video
    if (this.isHTML5Video && !this._ccIsSetup) {
      if (this.hasClosedCaptionsTracks) {
        this.trigger(Events.PLAYBACK_SUBTITLE_AVAILABLE)
        const trackId = this.closedCaptionsTrackId
        this.closedCaptionsTrackId = trackId
        this.handleTextTrackChange = this._handleTextTrackChange.bind(this)
        this.el.textTracks.addEventListener('change', this.handleTextTrackChange)
      }
      this._ccIsSetup = true
    }
  }

  _handleTextTrackChange() {
    let tracks = this.closedCaptionsTracks
    let track = tracks.find(track => track.track.mode === 'showing') || {id: -1}

    if (this._ccTrackId !== track.id) {
      this._ccTrackId = track.id
      this.trigger(Events.PLAYBACK_SUBTITLE_CHANGED, {
        id: track.id
      })
    }
  }

  get isHTML5Video() {
    return this.name === HTML5Video.prototype.name
  }

  get closedCaptionsTracks() {
    let id = 0
    let trackId = () => { return id++ }
    let textTracks = this.el.textTracks ? Array.from(this.el.textTracks) : []

    return textTracks
      .filter(track => track.kind === 'subtitles' || track.kind === 'captions')
      .map(track => { return {id: trackId(), name: track.label, track: track} })
  }

  get closedCaptionsTrackId() {
    return this._ccTrackId
  }

  set closedCaptionsTrackId(trackId) {
    if (!isNumber(trackId)) {
      return
    }

    let tracks = this.closedCaptionsTracks
    let showingTrack

    // Note: -1 is for hide all tracks
    if (trackId !== -1) {
      showingTrack = tracks.find(track => track.id === trackId)
      if (!showingTrack) {
        return // Track id not found
      }
      if (showingTrack.track.mode === 'showing') {
        return // Track already showing
      }
    }

    // Since it is possible to display multiple tracks,
    // ensure that all tracks are hidden.
    tracks
      .filter(track => track.track.mode !== 'hidden')
      .forEach(track => track.track.mode = 'hidden')

    showingTrack && (showingTrack.track.mode = 'showing')

    this._ccTrackId = trackId
    this.trigger(Events.PLAYBACK_SUBTITLE_CHANGED, {
      id: trackId
    })
  }

  get template() { return template(tracksHTML) }

  render() {
    if (this.options.playback.disableContextMenu) {
      this.$el.on('contextmenu', () => {
        return false
      })
    }

    if (this._externalTracks && this._externalTracks.length > 0) {
      this.$el.html(this.template({
        tracks: this._externalTracks,
      }))
    }

    this._ready()
    return this
  }
}

HTML5Video._mimeTypesForUrl = function(resourceUrl, mimeTypesByExtension, mimeType) {
  const extension = (resourceUrl.split('?')[0].match(/.*\.(.*)$/) || [])[1]
  let mimeTypes = mimeType || (extension && mimeTypesByExtension[extension.toLowerCase()]) || []
  return (mimeTypes.constructor === Array) ? mimeTypes : [mimeTypes]
}

HTML5Video._canPlay = function(type, mimeTypesByExtension, resourceUrl, mimeType) {
  let mimeTypes = HTML5Video._mimeTypesForUrl(resourceUrl, mimeTypesByExtension, mimeType)
  const media = document.createElement(type)
  return !!(mimeTypes.filter(mediaType => !!media.canPlayType(mediaType).replace(/no/, ''))[0])
}

HTML5Video.canPlay = function(resourceUrl, mimeType) {
  return HTML5Video._canPlay('audio', AUDIO_MIMETYPES, resourceUrl, mimeType) ||
         HTML5Video._canPlay('video', MIMETYPES, resourceUrl, mimeType)
}
