// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Playback from 'base/playback'
import Events from 'base/events'
import find from 'lodash.find'

export default class HTML5Audio extends Playback {
  get name() { return 'html5_audio' }
  get tagName() { return 'audio' }
  get events() {
    return {
      'loadedmetadata': 'loadedMetadata',
      'stalled': 'stalled',
      'waiting': 'waiting',
      'timeupdate': 'timeUpdated',
      'ended': 'ended',
      'canplaythrough': 'bufferFull',
      'playing': 'playing',
      'pause': 'paused'
    }
  }

  constructor(params) {
    super(params)
    this.options = params
    this.settings = {
      left: ['playpause', 'position', 'duration'],
      right: ['fullscreen', 'volume'],
      default: ['seekbar'],
      seekEnabled: true
    }
    this.render()
    params.autoPlay && this.play()
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.play)
    this.listenTo(this.container, Events.CONTAINER_PAUSE, this.pause)
    this.listenTo(this.container, Events.CONTAINER_SEEK, this.seek)
    this.listenTo(this.container, Events.CONTAINER_VOLUME, this.volume)
    this.listenTo(this.container, Events.CONTAINER_STOP, this.stop)
  }

  loadedMetadata(e) {
    this.durationChange()
    this.trigger(Events.PLAYBACK_LOADEDMETADATA, e.target.duration)
  }

  durationChange() {
    // we can't figure out if hls resource is VoD or not until it is being loaded or duration has changed.
    // that's why we check it again and update media control accordingly.
    if (this.getPlaybackType() === 'aod') {
      this.settings.left = ["playpause", "position", "duration"]
    } else {
      this.settings.left = ["playstop"]
    }
    this.settings.seekEnabled = isFinite(this.getDuration())
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  getPlaybackType() {
    return [0, undefined, Infinity].indexOf(this.el.duration) >= 0 ? 'live' : 'aod'
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

  play() {
    if (this.el.src !== this.options.src) {
      this.el.src = this.options.src
    }
    this.el.play()
    this.trigger(Events.PLAYBACK_PLAY);
  }

  pause() {
    this.el.pause()
  }

  stop() {
    this.pause()
    this.el.currentTime = 0
    this.el.src = ''
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
    this.trigger(Events.CONTAINER_TIMEUPDATE, 0)
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

  playing() {
    this.trigger(Events.PLAYBACK_PLAY);
  }

  paused() {
    this.trigger(Events.PLAYBACK_PAUSE);
  }

  timeUpdated() {
    if (this.getPlaybackType() === 'live') {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, 1, 1, this.name)
    } else {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, this.el.currentTime, this.el.duration, this.name)
    }
  }

  bufferFull() {
    this.trigger(Events.PLAYBACK_TIMEUPDATE, this.el.currentTime, this.el.duration, this.name)
    this.trigger(Events.PLAYBACK_BUFFERFULL)
  }

  render() {
    this.trigger(Events.PLAYBACK_READY, this.name)
    return this
  }
 }

HTML5Audio.canPlay = function(resource, mimeType) {
  var mimetypes = {
    'wav': ['audio/wav'],
    'mp3': ['audio/mp3', 'audio/mpeg;codecs="mp3"'],
    'aac': ['audio/mp4;codecs="mp4a.40.5"'],
    'oga': ['audio/ogg']
  }
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  if ((resourceParts.length > 1) && (mimetypes[resourceParts[1]] !== undefined)) {
    var a = document.createElement('audio')
    return !!find(mimetypes[resourceParts[1]], (ext) => { return !!a.canPlayType(ext).replace(/no/, '') })
  } else if (mimeType && !/m3u8/.test(resourceParts[1])) {
    var a = document.createElement('audio')
    return !!a.canPlayType(mimeType).replace(/no/, '')
  }
  return false
}
