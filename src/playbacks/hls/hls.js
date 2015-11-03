// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import HTML5VideoPlayback from 'playbacks/html5_video'
import HLSJS from 'hls.js'
import Events from 'base/events'
import Playback from 'base/playback'
import Browser from 'components/browser'

export default class HLS extends HTML5VideoPlayback {
  get name() { return 'hls' }

  getPlayableStartTime() {
    if (this.hls && this.hls.levels[this.hls.currentLevel] && this.hls.levels[this.hls.currentLevel].details) {
      return super.getDuration() - this.hls.levels[this.hls.currentLevel].details.totalduration
    }
    return 0
  }

  constructor(options) {
    super(options)
    this.minDvrSize = options.hlsMinimumDvrSize ? options.hlsMinimumDvrSize : 60
    this.playbackType = Playback.VOD
    this.dvrInUse = false
  }

  setupHls() {
    this.hls = new HLSJS(this.options.hlsjsConfig || {})
    this.hls.on(HLSJS.Events.MSE_ATTACHED, () => this.hls.loadSource(this.options.src))
    this.hls.on(HLSJS.Events.MANIFEST_PARSED, () => { this.options.autoPlay && this.play() })
    this.hls.on(HLSJS.Events.LEVEL_LOADED, (evt, data) => this.updatePlaybackType(evt, data))
    this.hls.attachVideo(this.el)
  }

  getCurrentTime() {
    return this.el.currentTime - this.getPlayableStartTime()
  }

  getDuration() {
    if (this.hls && this.hls.levels[this.hls.currentLevel] && this.hls.levels[this.hls.currentLevel].details) {
      return this.hls.levels[this.hls.currentLevel].details.totalduration
    }
    return 0
  }

  seek(seekBarValue) {
    var seekTo = 0
    if (seekBarValue > 0) {
      seekTo = this.getDuration() * (seekBarValue / 100)
    }
    var onDvr = this.dvrEnabled && seekBarValue > 0 && seekBarValue < 100
    seekTo += this.getPlayableStartTime()
    super.seekSeconds(seekTo)
    this.updateDvr(onDvr)
  }

  updateDvr(status) {
    this.dvrInUse = status
    this.trigger(Events.PLAYBACK_DVR, this.dvrInUse)
    this.trigger(Events.PLAYBACK_STATS_ADD, {'dvr': this.dvrInUse})
  }

  durationChange() {
    if (this.playbackType === Playback.VOD) {
      this.settings.left = ["playpause", "position", "duration"]
    } else if (this.dvrEnabled) {
      this.settings.left = ["playpause"]
    } else {
      this.settings.left = ["playstop"]
    }
    this.settings.seekEnabled = this.isSeekEnabled()
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  timeUpdated() {
    if (this.dvrEnabled) {
      this.trigger(Events.PLAYBACK_TIMEUPDATE, this.dvrInUse ? this.getCurrentTime() : this.getDuration(), this.getDuration(), this.name)
    } else {
      super.timeUpdated()
    }
  }

  play() {
    if (!this.hls) {
      this.setupHls()
    }
    super.play()
  }

  pause() {
    super.pause()
    if (this.dvrEnabled) {
      this.updateDvr(true)
    }
  }

  stop() {
    if (this.hls) {
      this.hls.detachVideo()
      delete this.hls
    }
  }

  updatePlaybackType(evt, data) {
    this.playbackType = data.details.live ? Playback.LIVE : Playback.VOD
  }

  get dvrEnabled() {
    return (this.getDuration() >= this.minDvrSize && this.getPlaybackType() === Playback.LIVE)
  }

  getPlaybackType() {
    return this.playbackType
  }

  isSeekEnabled() {
    return (this.playbackType === Playback.VOD || this.dvrEnabled)
  }
}

HLS.canPlay = function(resource, mimeType) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  var isHls = ((resourceParts.length > 1 && resourceParts[1] === "m3u8") ||
        mimeType === 'application/x-mpegURL' || mimeType === 'application/vnd.apple.mpegurl')
  var ignoredBrowser = Browser.isSafari || Browser.isFirefox

  return !!(HLSJS.isSupported() && isHls && !ignoredBrowser)
}
