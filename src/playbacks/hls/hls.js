// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import HTML5VideoPlayback from 'playbacks/html5_video'
import HLSJS from 'hls.js'
import Events from 'base/events'

export default class HLS extends HTML5VideoPlayback {
  get name() { return 'hls' }

  constructor(options) {
    super(options)
    this.setupHls()
    this.minDvrSize = options.hlsMinimumDvrSize ? options.hlsMinimumDvrSize : 60
    this.playbackType = 'vod'
    this.dvrInUse = false
  }

  setupHls() {
    this.hls = new HLSJS(this.options.hlsjsConfig || {})
    this.hls.on(HLSJS.Events.MSE_ATTACHED, () => this.hls.loadSource(this.options.source))
    this.hls.on(HLSJS.Events.MANIFEST_PARSED, () => { this.options.autoPlay && this.play() })
    this.hls.on(HLSJS.Events.LEVEL_LOADED, (evt, data) => this.updatePlaybackType(evt, data))
    this.hls.attachVideo(this.el)
  }

  seek(seekBarValue) {
    var seekTo = (seekBarValue === -1 )? 0 : seekBarValue
    super.seek(seekTo)
    if (this.dvrEnabled && seekTo > 0) {
      this.updateDvr(true)
    } else {
      this.updateDvr(false)
    }
  }

  updateDvr(status) {
    this.dvrInUse = status
    this.trigger(Events.PLAYBACK_DVR, this.dvrInUse)
    this.trigger(Events.PLAYBACK_STATS_ADD, {'dvr': this.dvrInUse})
  }

  durationChange() {
    if (this.playbackType === "vod") {
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
      this.trigger(Events.PLAYBACK_TIMEUPDATE, this.getCurrentTime(), this.getDuration(), this.name)
    } else {
      super.timeUpdated()
    }
  }

  pause() {
    super.pause()
    if (this.dvrEnabled) {
      this.updateDvr(true)
    }
  }

  updatePlaybackType(evt, data) {
    this.playbackType = data.details.live ? 'live' : 'vod'
  }

  get dvrEnabled() {
    return (this.getDuration() >= this.minDvrSize && this.getPlaybackType() === 'live')
  }

  getPlaybackType() {
    return this.playbackType
  }

  isSeekEnabled() {
    return (this.playbackType === 'vod' || this.dvrEnabled)
  }
}

HLS.canPlay = function(resource, mimeType) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  var isHls = ((resourceParts.length > 1 && resourceParts[1] === "m3u8") ||
        mimeType === 'application/x-mpegURL' || mimeType === 'application/vnd.apple.mpegurl')

  return !!(HLSJS.isSupported() && isHls)
}
