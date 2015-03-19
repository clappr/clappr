// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Playback = require('../../base/playback')
var JST = require('../../base/jst')
var Kibo = require('../../base/kibo')
var Styler = require('../../base/styler')
var Browser = require('../../components/browser')
var seekStringToSeconds = require('../../base/utils').seekStringToSeconds
var Events = require('../../base/events')
var find = require('lodash.find')

class HTML5Video extends Playback {
  get name() { return 'html5_video' }
  get tagName() { return 'video' }
  get template() { return JST.html5_video }

  get attributes() {
    return {
      'data-html5-video': ''
    }
  }

  get events() {
    return {
      'timeupdate': 'timeUpdated',
      'progress': 'progress',
      'ended': 'ended',
      'stalled': 'stalled',
      'waiting': 'waiting',
      'canplaythrough': 'bufferFull',
      'loadedmetadata': 'loadedMetadata',
      'canplay': 'ready',
      'durationchange': 'durationChange'
    }
  }

  constructor(options) {
    super(options)
    this.kibo = new Kibo()
    this.options = options
    this.src = options.src
    this.el.src = options.src
    this.el.loop = options.loop
    this.firstBuffer = true
    this.isHLS = (this.src.indexOf('m3u8') > -1)
    this.settings = {default: ['seekbar']}
    if (Browser.isSafari) {
      this.setupSafari()
    } else {
      this.el.preload = options.preload ? options.preload: 'metadata'
      this.settings.seekEnabled = true
    }
    this.settings.left = this.isHLS ? ["playstop"] : ["playpause", "position", "duration"]
    this.settings.right = ["fullscreen", "volume"]
    this.bindEvents()
  }

  setupSafari() {
    this.el.preload = 'auto'
  }

  bindEvents() {
    [1,2,3,4,5,6,7,8,9].forEach((i) => { this.kibo.down(i.toString(), () => this.seek(i * 10)) })
  }

  stopListening() {
    this.kibo.off([1,2,3,4,5,6,7,8,9])
  }

  loadedMetadata(e) {
    this.durationChange()
    this.trigger(Events.PLAYBACK_LOADEDMETADATA, e.target.duration)
    this.checkInitialSeek()
  }

  durationChange() {
    // we can't figure out if hls resource is VoD or not until it is being loaded or duration has changed.
    // that's why we check it again and update media control accordingly.
    if (this.getPlaybackType() === 'vod') {
      this.settings.left = ["playpause", "position", "duration"]
      this.settings.seekEnabled = true
    }
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  getPlaybackType() {
    return this.isHLS && [0, undefined, Infinity].indexOf(this.el.duration) >= 0 ? 'live' : 'vod'
  }

  isHighDefinitionInUse() {
    return false
  }

  play() {
    this.el.play()
    this.trigger(Events.PLAYBACK_PLAY);
  }

  pause() {
    this.el.pause()
  }

  stop() {
    this.pause()
    if (this.el.readyState !== 0) {
      this.el.currentTime = 0
    }
  }

  volume(value) {
    this.el.volume = value / 100
  }

  mute() {
    this.el.volume = 0
  }

  unmute() {
    this.el.volume = 1
  }

  isMuted() {
    return !!this.el.volume
  }

  isPlaying() {
    return !this.el.paused && !this.el.ended
  }

  ended() {
    this.trigger(Events.PLAYBACK_ENDED, this.name)
    this.trigger(Events.PLAYBACK_TIMEUPDATE, 0, this.el.duration, this.name)
  }

  stalled() {
    if (this.getPlaybackType() === 'vod' && this.el.readyState < this.el.HAVE_FUTURE_DATA) {
      this.trigger(Events.PLAYBACK_BUFFERING, this.name)
    }
  }

  waiting() {
    if(this.el.readyState < this.el.HAVE_FUTURE_DATA) {
      this.trigger(Events.PLAYBACK_BUFFERING, this.name)
    }
  }

  bufferFull() {
    if (this.options.poster && this.firstBuffer) {
      this.firstBuffer = false
      if (!this.isPlaying()) {
        this.el.poster = this.options.poster
      }
    } else {
      this.el.poster = ''
    }
    this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
  }

  destroy() {
    this.stopListening()
    this.stop()
    this.el.src = ''
    this.$el.remove()
  }

  seek(seekBarValue) {
    var time = this.el.duration * (seekBarValue / 100)
    this.seekSeconds(time)
  }

  seekSeconds(time) {
    this.el.currentTime = time
  }

  checkInitialSeek() {
    var seekTime = seekStringToSeconds(window.location.href)
    this.seekSeconds(seekTime)
  }

  getCurrentTime() {
    return this.el.currentTime
  }

  getDuration() {
    return this.el.duration
  }

  timeUpdated() {
    if (this.getPlaybackType() === 'live') {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, 1, 1, this.name)
    } else {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, this.el.currentTime, this.el.duration, this.name)
    }
  }

  progress() {
    if (!this.el.buffered.length) return
    var bufferedPos = 0
    for (var i = 0;  i < this.el.buffered.length; i++) {
      if (this.el.currentTime >= this.el.buffered.start(i) && this.el.currentTime <= this.el.buffered.end(i)) {
        bufferedPos = i
        break
      }
    }
    this.trigger(Events.PLAYBACK_PROGRESS, this.el.buffered.start(bufferedPos), this.el.buffered.end(bufferedPos), this.el.duration, this.name)
  }

  typeFor(src) {
    return (src.indexOf('.m3u8') > 0) ? 'application/vnd.apple.mpegurl' : 'video/mp4'
  }

  ready() {
    this.trigger(Events.PLAYBACK_READY, this.name)
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template({ src: this.src, type: this.typeFor(this.src) }))
    this.$el.append(style)
    setTimeout(() => this.options.autoPlay && this.play(), 0);
    if (this.el.readyState === this.el.HAVE_ENOUGH_DATA) {
      this.ready()
    }
    return this
  }
}

HTML5Video.canPlay = function(resource) {
  var mimetypes = {
    'mp4': ["avc1.42E01E", "avc1.58A01E", "avc1.4D401E", "avc1.64001E", "mp4v.20.8", "mp4v.20.240", "mp4a.40.2"].map(
      (codec) => { return 'video/mp4; codecs="' + codec + ', mp4a.40.2"'}),
    'ogg': ['video/ogg; codecs="theora, vorbis"', 'video/ogg; codecs="dirac"', 'video/ogg; codecs="theora, speex"'],
    '3gpp': ['video/3gpp; codecs="mp4v.20.8, samr"'],
    'webm': ['video/webm; codecs="vp8, vorbis"'],
    'mkv': ['video/x-matroska; codecs="theora, vorbis"'],
    'm3u8': ['application/x-mpegURL']
  }
  mimetypes['ogv'] = mimetypes['ogg']
  mimetypes['3gp'] = mimetypes['3gpp']

  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  if ((resourceParts.length > 1) && (mimetypes[resourceParts[1]] !== undefined)) {
    var v = document.createElement('video')
    return !!find(mimetypes[resourceParts[1]], (ext) => { return !!v.canPlayType(ext).replace(/no/, '') })
  }
  return false
}

module.exports = HTML5Video
