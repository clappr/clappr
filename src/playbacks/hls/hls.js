// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import HTML5VideoPlayback from 'playbacks/html5_video'
import HLSJS from 'hls.js'
import Events from 'base/events'

import assign from 'lodash.assign'

export default class HLS extends HTML5VideoPlayback {
  get name() { return 'hls' }
  get attributes() { return {'width': '100%', 'height': '100%'} } // why we need this?
  render() { return this }

  constructor(options) {
    super(options)
    var config = {}
    if (options.xhrWithCredentials) {
        config.xhrSetup = function(xhr) { xhr.withCredentials = true; }
        config.debug = true
    }
    this.hls = new HLSJS(config)
    this.minDvrSize = options.hlsMinimumDvrSize ? options.hlsMinimumDvrSize : 60
    this.playbackType = 'vod'
    this.dvrInUse = false
    this.addListeners()
    this.hls.attachVideo(this.el)
  }

  addListeners() {
    this.hls.on(HLSJS.Events.MSE_ATTACHED, () => this.hls.loadSource(this.options.source))
    this.hls.on(HLSJS.Events.MANIFEST_PARSED, () => { this.options.autoPlay && this.play() })
    this.hls.on(HLSJS.Events.LEVEL_LOADED, (evt, data) => this.updatePlaybackType(evt, data))
    this.hls.on(HLSJS.Events.ERROR, (evt, data) => console.log('hls error!', evt, data))
  }

  seek(seekBarValue) {
    if (seekBarValue === -1) {
      super.seek(0)
      this.updateDvr(false)
    } else {
      super.seek(seekBarValue)
      this.updateDvr(true)
    }
  }

  updateDvr(status) {
    this.dvrInUse = status
    this.updateSettings()
    this.trigger(Events.PLAYBACK_DVR, this.dvrInUse)
    this.trigger(Events.PLAYBACK_STATS_ADD, {'dvr': this.dvrInUse})
  }

  updateSettings() {
    if (this.playbackType === "vod") {
      this.settings.left = ["playpause", "position", "duration"]
      this.settings.seekEnabled = true
    } else if (this.dvrEnabled) {
      this.settings.left = ["playpause"]
      this.settings.seekEnabled = true
    } else {
      this.settings.seekEnabled = false
    }
  }

  timeUpdated() {
    if (this.dvrEnabled && this.getDuration() - this.getCurrentTime() > 20) { // need to fix this magic number
      this.trigger(Events.PLAYBACK_TIMEUPDATE, this.getCurrentTime(), this.getDuration(), this.name)
    } else {
      super.timeUpdated()
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

HLS.canPlay = function(resource) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  var isHls = !!(resourceParts.length > 1 && resourceParts[1] === 'm3u8')
  return !!(HLSJS.isSupported() && isHls)
}
