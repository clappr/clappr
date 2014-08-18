// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin')
var Styler = require('../../base/styler')
var Browser = require('../../components/browser')

class HTML5Video extends UIPlugin {
  get name() { return 'html5_video' }
  get type() { return 'playback' }
  get tagName() { return 'video' }

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

  initialize(options) {
    this.options = options
    this.src = options.src
    this.el.src = options.src
    this.el.loop = options.loop
    this.settings = {
      left: ['playpause', 'volume'],
      right: ['fullscreen'],
      default: ['position', 'seekbar', 'duration']
    }
  }

  loadedMetadata(e) {
    this.trigger('playback:loadedmetadata', e.target.duration)
  }

  getPlaybackType() {
    var type = this.src.indexOf("m3u8") > -1?'live':'vod'
    return type
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
    this.trigger('playback:timeupdate', this.el.currentTime, this.el.duration, this.name)
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

  playing() {
    this.trigger('playback:play', this.name)
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.append(style)
    this.trigger('playback:ready', this.name)
    this.options.autoPlay && this.play()
    return this
  }
}

HTML5Video.canPlay = function(resource) {
    return (!!resource.match(/(.*).mp4/) || Browser.isSafari)
}

module.exports = HTML5Video
