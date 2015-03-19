// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var ContainerPlugin = require('../../base/container_plugin');
var Events = require('../../base/events')

class GoogleAnalytics extends ContainerPlugin {
  get name() { return 'google_analytics' }
  constructor(options) {
    super(options)
    if (options.gaAccount) {
      this.account = options.gaAccount
      this.trackerName = (options.gaTrackerName) ? options.gaTrackerName + "." : 'Clappr.'
      this.domainName = options.gaDomainName
      this.currentHDState = undefined
      this.embedScript()
    }
  }

  embedScript() {
    if (!window._gat) {
      var script = document.createElement('script')
      script.setAttribute("type", "text/javascript")
      script.setAttribute("async", "async")
      script.setAttribute("src", "http://www.google-analytics.com/ga.js")
      script.onload = () => this.addEventListeners()
      document.body.appendChild(script)
    } else {
      this.addEventListeners()
    }
  }

  addEventListeners() {
    if (this.container) {
      this.listenTo(this.container, Events.CONTAINER_PLAY, this.onPlay)
      this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
      this.listenTo(this.container, Events.CONTAINER_PAUSE, this.onPause)
      this.listenTo(this.container, Events.CONTAINER_ENDED, this.onEnded)
      this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERING, this.onBuffering)
      this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERFULL, this.onBufferFull)
      this.listenTo(this.container, Events.CONTAINER_ENDED, this.onEnded)
      this.listenTo(this.container, Events.CONTAINER_ERROR, this.onError)
      this.listenTo(this.container, Events.CONTAINER_PLAYBACKSTATE, this.onPlaybackChanged)
      this.listenTo(this.container, Events.CONTAINER_VOLUME, (event) => this.onVolumeChanged(event))
      this.listenTo(this.container, Events.CONTAINER_SEEK, (event) => this.onSeek(event))
      this.listenTo(this.container, Events.CONTAINER_FULL_SCREEN, this.onFullscreen)
      this.listenTo(this.container, Events.CONTAINER_HIGHDEFINITIONUPDATE, this.onHD)
      this.listenTo(this.container, Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.onDVR)
    }
    _gaq.push([this.trackerName + '_setAccount', this.account]);
    if (!!this.domainName)
      _gaq.push([this.trackerName + '_setDomainName', this.domainName]);
  }

  onPlay() {
    this.push(["Video", "Play", this.container.playback.src])
  }

  onStop() {
    this.push(["Video", "Stop", this.container.playback.src])
  }

  onEnded() {
    this.push(["Video", "Ended", this.container.playback.src])
  }

  onBuffering() {
    this.push(["Video", "Buffering", this.container.playback.src])
  }

  onBufferFull() {
    this.push(["Video", "Bufferfull", this.container.playback.src])
  }

  onError() {
    this.push(["Video", "Error", this.container.playback.src])
  }

  onHD() {
    var status = this.container.isHighDefinitionInUse()? "ON": "OFF"
    if (status !== this.currentHDState) {
      this.currentHDState = status
      this.push(["Video", "HD - " + status, this.container.playback.src])
    }
  }


  onPlaybackChanged() {
    var type = this.container.getPlaybackType()
    if (type !== null) {
      this.push(["Video", "Playback Type - " + type, this.container.playback.src])
    }
  }

  onDVR(dvrInUse) {
    var status = dvrInUse? "ON": "OFF"
    this.push(["Interaction", "DVR - " + status, this.container.playback.src])
  }

  onPause() {
    this.push(["Video", "Pause", this.container.playback.src])
  }

  onSeek() {
    this.push(["Video", "Seek", this.container.playback.src])
  }

  onVolumeChanged() {
    this.push(["Interaction", "Volume", this.container.playback.src])
  }

  onFullscreen() {
    this.push(["Interaction", "Fullscreen", this.container.playback.src])
  }


  push(array) {
    var res = [this.trackerName + "_trackEvent"].concat(array)
    _gaq.push(res)
  }

}

module.exports = GoogleAnalytics;
