// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Playback = require('../../base/playback')
var JST = require('../../base/jst')
var Styler = require('../../base/styler')
var Browser = require('../../components/browser')

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
      'playing': 'playing',
      'stalled': 'stalled',
      'waiting': 'waiting',
      'canplaythrough': 'bufferFull',
      'loadedmetadata': 'loadedMetadata'
    }
  }

  constructor(options) {
    super(options);
    this.options = options
    this.src = options.src
    this.el.src = options.src
    this.el.loop = options.loop
    this.isHLS = !!(this.src.indexOf('m3u8') > -1)
    this.settings = {default: ['seekbar']}
    if (this.isHLS) {
      this.settings.left = ["playstop", "volume"]
      this.settings.right = ["fullscreen"]
    } else {
      this.settings.left = ["playpause", "position", "duration"]
      this.settings.right = ["fullscreen", "volume"]
    }
  }

  loadedMetadata(e) {
    this.trigger('playback:loadedmetadata', e.target.duration)
  }

  getPlaybackType() {
    return this.isHLS? 'live':'vod'
  }

  isHighDefinitionInUse() {
    return false
  }

  play() {
    this.el.play()
    //FIXME: I don't think playback:{play,pause,etc} events are necessary.
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
    if (this.getPlaybackType() === 'vod') {
      this.trigger('playback:buffering', this.name)
    }
  }

  waiting() {
    this.trigger('playback:buffering', this.name)
  }

  bufferFull() {
    this.trigger('playback:bufferfull', this.name)
  }

  destroy() {
    this.stop()
    this.el.src = ''
    this.$el.remove()
  }

  seek(seekBarValue) {
    var time = this.el.duration * (seekBarValue / 100)
    this.el.currentTime = time
  }

  getCurrentTime() {
    return this.el.currentTime
  }

  getDuration() {
    return this.el.duration
  }

  timeUpdated() {
    if (!this.isHLS) {
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
    this.options.autoPlay && this.play()
    return this
  }
}

HTML5Video.canPlay = function(resource) {
    return (!!resource.match(/(.*).mp4/) || Browser.isSafari || Browser.isMobile || Browser.isWin8App)
}

module.exports = HTML5Video
