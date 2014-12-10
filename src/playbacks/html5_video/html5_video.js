// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Playback = require('playback')
var JST = require('../../base/jst')
var Styler = require('../../base/styler')
var Browser = require('browser')
var Mousetrap = require('mousetrap')
var seekStringToSeconds = require('../../base/utils').seekStringToSeconds

var _ = require('underscore')

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
      'loadedmetadata': 'loadedMetadata'
    }
  }

  constructor(options) {
    super(options)
    this.options = options
    this.src = options.src
    this.el.src = options.src
    this.el.loop = options.loop
    this.firstBuffer = true
    this.isHLS = (this.src.indexOf('m3u8') > -1)
    this.settings = {default: ['seekbar']}
    if (this.isHLS) {
      this.el.preload = options.preload ? options.preload: 'none'
      this.settings.left = ["playstop"]
      this.settings.right = ["fullscreen", "volume"]
    } else {
      this.el.preload = options.preload ? options.preload: 'metadata'
      this.settings.left = ["playpause", "position", "duration"]
      this.settings.right = ["fullscreen", "volume"]
      this.settings.seekEnabled = true
    }
    this.bindEvents()
  }

  bindEvents() {
    _.each(_.range(1,10), function (i) { Mousetrap.bind([i.toString()], () => this.seek(i * 10)) }.bind(this))
  }

  loadedMetadata(e) {
    this.trigger('playback:loadedmetadata', e.target.duration)
    this.trigger('playback:settingsupdate')
    this.checkInitialSeek()
  }

  getPlaybackType() {
    return this.isHLS && _.contains([0, undefined, Infinity], this.el.duration) ? 'live' : 'vod'
  }

  isHighDefinitionInUse() {
    return false
  }

  play() {
    this.el.play()
    this.trigger('playback:play');
    if (this.isHLS) {
      this.trigger('playback:timeupdate', 1, 1, this.name)
    }
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
    this.trigger('playback:ended', this.name)
    this.trigger('playback:timeupdate', 0, this.el.duration, this.name)
  }

  stalled() {
    if (this.getPlaybackType() === 'vod' && this.el.readyState < this.el.HAVE_FUTURE_DATA) {
      this.trigger('playback:buffering', this.name)
    }
  }

  waiting() {
    if(this.el.readyState < this.el.HAVE_FUTURE_DATA) {
      this.trigger('playback:buffering', this.name)
    }
  }

  bufferFull() {
    if (this.options.poster && this.firstBuffer) {
      this.firstBuffer = false
      this.el.poster = this.options.poster
    } else {
      this.el.poster = ''
    }
    this.trigger('playback:bufferfull', this.name)
  }

  destroy() {
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
    if (this.getPlaybackType() !== 'live') {
      this.trigger('playback:timeupdate', this.el.currentTime, this.el.duration, this.name)
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
    this.trigger('playback:progress', this.el.buffered.start(bufferedPos), this.el.buffered.end(bufferedPos), this.el.duration, this.name)
  }

  typeFor(src) {
    return (src.indexOf('.m3u8') > 0) ? 'application/vnd.apple.mpegurl' : 'video/mp4'
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template({ src: this.src, type: this.typeFor(this.src) }))
    this.$el.append(style)
    this.trigger('playback:ready', this.name)
    process.nextTick(() => this.options.autoPlay && this.play())
    return this
  }
}

HTML5Video.canPlay = function(resource) {
  if (isSupportedBrowser()) {
    return true
  } else if (Browser.isChrome || Browser.isFirefox || Browser.isIE) {
    return (!!resource.match(/(.*).(mp4|webm)/))
  }
}

var isSupportedBrowser = () => {
  return Browser.isSafari || Browser.isMobile || Browser.isWin8App || Browser.isLegacyIE || Browser.isWiiU || Browser.isPS4;
}

module.exports = HTML5Video
