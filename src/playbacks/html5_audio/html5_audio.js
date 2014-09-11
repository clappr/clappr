// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin')

class HTML5Audio extends UIPlugin {
  get name() { return 'html5_audio' }
  get tagName() { return 'audio' }
  get events() {
    return {
      'timeupdate': 'timeUpdated',
      'ended': 'ended'
    }
  }

  constructor(params) {
    super(params);
    this.el.src = params.src
    this.settings = {
      left: ['playpause', 'position', 'duration'],
      right: ['fullscreen', 'volume'],
      default: ['seekbar']
    }
    this.render() // it should render when the container trigger 'ready'
    params.autoPlay && this.play()
  }

  bindEvents() {
    this.listenTo(this.container, 'container:play', this.play)
    this.listenTo(this.container, 'container:pause', this.pause)
    this.listenTo(this.container, 'container:seek', this.seek)
    this.listenTo(this.container, 'container:volume', this.volume)
    this.listenTo(this.container, 'container:stop', this.stop)
  }

  play() {
    this.el.play()
    this.trigger('playback:play');
  }

  pause() {
    this.el.pause()
  }

  stop() {
    this.pause()
    this.el.currentTime = 0
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

  ended() {
    this.trigger('container:timeupdate', 0)
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

  isPlaying() {
    return !this.el.paused && !this.el.ended
  }

  isHighDefinitionInUse() {
    return false
  }

  timeUpdated() {
    this.trigger('playback:timeupdate', this.el.currentTime, this.el.duration, this.name)
  }

  render() {
    return this
  }
 }

HTML5Audio.canPlay = function(resource) {
  return !!resource.match(/(.*).mp3/)
}


module.exports = HTML5Audio
