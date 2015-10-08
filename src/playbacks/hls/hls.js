// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import HTML5VideoPlayback from 'playbacks/html5_video'
import HLSJS from 'hls.js'

export default class HLS extends HTML5VideoPlayback {
  get name() { return 'hls' }
  get attributes() { return {'width': '100%', 'height': '100%'} }
  render() { return this }

  constructor(options) {
    super(options)
    var config = {}
    if (options.xhrWithCredentials) {
        config.xhrSetup = function(xhr) { xhr.withCredentials = true; }
        config.debug = true
    }
    this.hls = new HLSJS(config)
    this.playbackType = 'vod'
    this.addListeners()
    this.hls.attachVideo(this.el)
  }

  addListeners() {
    this.hls.on(HLSJS.Events.MSE_ATTACHED, () => this.hls.loadSource(this.options.source))
    this.hls.on(HLSJS.Events.MANIFEST_PARSED, () => { this.options.autoPlay && this.play() })
    this.hls.on(HLSJS.Events.LEVEL_LOADED, (evt, data) => this.updatePlaybackType(evt, data))
    this.hls.on(HLSJS.Events.ERROR, (evt, data) => this.handleError(evt, data))
  }

  handleError(evt, data) {
      console.log("Error!", evt, data)
  }

  updatePlaybackType(evt, data) {
    this.playbackType = data.details.live ? 'live' : 'vod'
  }

  getPlaybackType() {
    return this.playbackType
  }

  isSeekEnabled() {
    return (this.playbackType === 'vod')
  }
}

HLS.canPlay = function(resource) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  var isHls = !!(resourceParts.length > 1 && resourceParts[1] === 'm3u8')
  return !!(HLSJS.isSupported() && isHls)
}
