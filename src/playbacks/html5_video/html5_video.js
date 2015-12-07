// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {seekStringToSeconds} from 'base/utils'

import Playback from 'base/playback'
import template from 'base/template'
import Styler from 'base/styler'
import Browser from 'components/browser'
import Events from 'base/events'
import tagStyle from './public/style.scss'
import sourceHTML from './public/index.html'
import find from 'lodash.find'

const MIMETYPES = {
  'mp4': ["avc1.42E01E", "avc1.58A01E", "avc1.4D401E", "avc1.64001E", "mp4v.20.8", "mp4v.20.240", "mp4a.40.2"].map(
    (codec) => { return 'video/mp4; codecs="' + codec + ', mp4a.40.2"'}),
  'ogg': ['video/ogg; codecs="theora, vorbis"', 'video/ogg; codecs="dirac"', 'video/ogg; codecs="theora, speex"'],
  '3gpp': ['video/3gpp; codecs="mp4v.20.8, samr"'],
  'webm': ['video/webm; codecs="vp8, vorbis"'],
  'mkv': ['video/x-matroska; codecs="theora, vorbis"'],
  'm3u8': ['application/x-mpegurl']
}
MIMETYPES['ogv'] = MIMETYPES['ogg']
MIMETYPES['3gp'] = MIMETYPES['3gpp']

export default class HTML5Video extends Playback {
  get name() { return 'html5_video' }
  get tagName() { return 'video' }
  get template() { return template(sourceHTML) }

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
      'durationchange': 'durationChange',
      'error': 'error',
      'playing': 'playing',
      'pause': 'paused'
    }
  }


  constructor(options) {
    super(options)
    this.options = options
    this.setupSrc(options.src)
    this.el.loop = options.loop
    this.firstBuffer = true
    this.settings = {default: ['seekbar']}
    if (Browser.isSafari) {
      this.setupSafari()
    } else {
      this.el.preload = options.preload ? options.preload: 'metadata'
      this.settings.seekEnabled = true
    }
    this.settings.left = ["playpause", "position", "duration"]
    this.settings.right = ["fullscreen", "volume", "hd-indicator"]
  }

  setupSrc(srcUrl) {
    //avoid to set el.src of an "invalid" source since we're extending video tag with MSE
    if (HTML5Video.canPlay(srcUrl)) {
      this.src = srcUrl
      this.el.src = srcUrl
    }
  }

  setupSafari() {
    this.el.preload = 'auto'
  }

  loadedMetadata(e) {
    this.durationChange()
    this.trigger(Events.PLAYBACK_LOADEDMETADATA, {duration: e.target.duration, data: e})
    if (this.getPlaybackType() !== Playback.LIVE) {
      this.checkInitialSeek()
    }
  }

  durationChange() {
    // we can't figure out if hls resource is VoD or not until it is being loaded or duration has changed.
    // that's why we check it again and update media control accordingly.
    if (this.getPlaybackType() === Playback.VOD) {
      this.settings.left = ["playpause", "position", "duration"]
    } else {
      this.settings.left = ["playstop"]
    }
    this.settings.seekEnabled = this.isSeekEnabled()
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  isSeekEnabled() {
    return isFinite(this.getDuration())
  }

  getPlaybackType() {
    return [0, undefined, Infinity].indexOf(this.el.duration) >= 0 ? Playback.LIVE : Playback.VOD
  }

  isHighDefinitionInUse() {
    return false
  }

  play() {
    this.el.play()
  }

  pause() {
    this.el.pause()
  }

  stop() {
    this.pause()
    if (this.el.readyState !== 0) {
      this.el.currentTime = 0
      this.trigger(Events.PLAYBACK_STOP)
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

  playing() {
    this.trigger(Events.PLAYBACK_PLAY);
  }

  paused() {
    this.trigger(Events.PLAYBACK_PAUSE);
  }

  ended() {
    this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
    this.trigger(Events.PLAYBACK_ENDED, this.name)
    this.trigger(Events.PLAYBACK_TIMEUPDATE, { current: 0, total: this.el.duration }, this.name)
  }

  stalled() {
    if (this.getPlaybackType() === Playback.VOD && this.el.readyState < this.el.HAVE_FUTURE_DATA) {
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

  error(event) {
    this.trigger(Events.PLAYBACK_ERROR, this.el.error, this.name)
  }

  destroy() {
    this.stop()
    this.el.src = ''
    this.$el.remove()
  }

  seek(time) {
    this.el.currentTime = time
  }

  seekPercentage(percentage) {
    var time = this.el.duration * (percentage / 100)
    this.seek(time)
  }

  checkInitialSeek() {
    var seekTime = seekStringToSeconds(window.location.href)
    this.seek(seekTime)
  }

  getCurrentTime() {
    return this.el.currentTime
  }

  getDuration() {
    return this.el.duration
  }

  timeUpdated() {
    if (this.getPlaybackType() === Playback.LIVE) {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 1, total: 1}, this.name)
    } else {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: this.el.currentTime, total: this.el.duration}, this.name)
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
    this.checkBufferState(this.el.buffered.end(bufferedPos))
    this.trigger(Events.PLAYBACK_PROGRESS, {
      start: this.el.buffered.start(bufferedPos),
      current: this.el.buffered.end(bufferedPos),
      total: this.el.duration
    })
  }

  checkBufferState(bufferedPos) {
    var playbackPos = this.el.currentTime + 0.05; // 50 ms threshold
    if (this.isPlaying() && playbackPos >= bufferedPos) {
      this.trigger(Events.PLAYBACK_BUFFERING, this.name)
      this.buffering = true
    } else if (this.buffering) {
      this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
      this.buffering = false
    }
  }

  typeFor(src) {
    return (src.indexOf('.m3u8') > 0) ? 'application/vnd.apple.mpegurl' : 'video/mp4'
  }

  ready() {
    this.trigger(Events.PLAYBACK_READY, this.name)
  }

  render() {
    var style = Styler.getStyleFor(tagStyle)

    this.src && this.$el.html(this.template({ src: this.src, type: this.typeFor(this.src) }))

    if (this.options.useVideoTagDefaultControls) {
      this.$el.attr('controls', 'controls')
    }

    if (this.options.disableVideoTagContextMenu) {
      this.$el.on("contextmenu", () => {
        return false
      })
    }

    this.$el.append(style)

    process.nextTick(() => this.options.autoPlay && this.play())
    if (this.el.readyState === this.el.HAVE_ENOUGH_DATA) {
      this.ready()
    }
    return this
  }
}

HTML5Video._canPlay = function(type, mimeTypesByExtension, resourceUrl, mimeType) {
  var extension = (resourceUrl.split('?')[0].match(/.*\.(.*)$/) || [])[1]
  var mimeTypes = mimeType || mimeTypesByExtension[extension] || []
  mimeTypes = (mimeTypes.constructor === Array) ? mimeTypes : [mimeTypes]

  var media = document.createElement(type)
  return !!find(mimeTypes, (mediaType) => !!media.canPlayType(mediaType).replace(/no/, ''))
}

HTML5Video.canPlay = function(resourceUrl, mimeType) {
  return HTML5Video._canPlay('video', MIMETYPES, resourceUrl, mimeType)
}

module.exports = HTML5Video
