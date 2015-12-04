// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import HTML5VideoPlayback from 'playbacks/html5_video'
import HLSJS from 'hls.js'
import Events from 'base/events'
import Playback from 'base/playback'
import Browser from 'components/browser'

const AUTO = -1

export default class HLS extends HTML5VideoPlayback {
  get name() { return 'hls' }

  get levels() { return this._levels || [] }
  get currentLevel() { return this._currentLevel || AUTO }
  set currentLevel(id) {
    this._currentLevel = id
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_START)
    this.hls.currentLevel = this._currentLevel
  }

  constructor(options) {
    super(options)
    this.minDvrSize = options.hlsMinimumDvrSize ? options.hlsMinimumDvrSize : 60
    this.playbackType = Playback.VOD
    // for hls streams which have dvr with a sliding window,
    // the content at the start of the playlist is removed as new
    // content is appended at the end.
    // this means the actual playable start time will increase as the
    // start content is deleted
    // For streams with dvr where the entire recording is kept from the
    // beginning this should stay as 0
    this.playableRegionStartTime = 0
    // if content is removed from the beginning then this empty area should
    // be ignored. "playableRegionDuration" does not consider this
    this.playableRegionDuration = 0
  }

  setupHls() {
    this.hls = new HLSJS(this.options.hlsjsConfig || {})
    this.hls.on(HLSJS.Events.MEDIA_ATTACHED, () => this.hls.loadSource(this.options.src))
    this.hls.on(HLSJS.Events.MANIFEST_PARSED, () => { this.options.autoPlay && this.play() })
    this.hls.on(HLSJS.Events.LEVEL_LOADED, (evt, data) => this.updatePlaybackType(evt, data))
    this.hls.on(HLSJS.Events.LEVEL_UPDATED, (evt, data) => this.updateDuration(evt, data))
    this.hls.on(HLSJS.Events.LEVEL_SWITCH, (evt,data) => this.onLevelSwitch(evt, data))
    this.hls.on(HLSJS.Events.FRAG_LOADED, (evt, data) => this.onFragmentLoaded(evt, data))
    this.hls.attachMedia(this.el)
  }

  // the duration on the video element itself should not be used
  // as this does not necesarily represent the duration of the stream
  // https://github.com/clappr/clappr/issues/668#issuecomment-157036678
  getDuration() {
    return this.playableRegionDuration
  }

  getCurrentTime() {
    return this.el.currentTime - this.playableRegionStartTime
  }

  seek(time) {
    var onDvr = this.dvrEnabled && time > 0 && time <= this.playableRegionDuration
    time += this.playableRegionStartTime
    super.seek(time)
    this.updateDvr(onDvr)
  }

  seekPercentage(percentage) {
    var seekTo = this.playableRegionDuration
    if (percentage > 0) {
      seekTo = this.playableRegionDuration * (percentage / 100)
    }
    this.seek(seekTo)
  }

  updateDvr(status) {
    this.trigger(Events.PLAYBACK_DVR, status)
    this.trigger(Events.PLAYBACK_STATS_ADD, {'dvr': status})
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
    this.timeUpdated()
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  timeUpdated() {
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: this.getCurrentTime(), total: this.getDuration()}, this.name)
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
      this.hls.destroy()
      delete this.hls
      this.trigger(Events.PLAYBACK_STOP)
    }
  }

  updatePlaybackType(evt, data) {
    this.playbackType = data.details.live ? Playback.LIVE : Playback.VOD
    this.fillLevels()
  }

  fillLevels() {
    this._levels = this.hls.levels.map((level, index) => { return {id: index , label: `${level.height}p`}})
    this.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, this._levels)
  }

  updateDuration(evt, data) {
    var fragments = data.details.fragments
    if (fragments.length > 0) {
      this.playableRegionStartTime = fragments[0].start
    }
    this.playableRegionDuration = data.details.totalduration
    this.durationChange()
  }

  onFragmentLoaded(evt, data) {
    this.trigger(Events.PLAYBACK_FRAGMENT_LOADED, data)
  }

  onLevelSwitch(evt, data) {
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_END)
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH, data)
    var currentLevel = this.levels[data.level]
    if (currentLevel) {
      this.highDefinition = (currentLevel.height >= 720 || (currentLevel.bitrate / 1000) >= 2000);
      this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition)
      this.trigger(Events.PLAYBACK_BITRATE, {
        height: currentLevel.height,
        width: currentLevel.width,
        bandwidth: currentLevel.bandwidth,
        bitrate: currentLevel.bitrate,
        level: data.level
      })
    }
  }

  get dvrEnabled() {
    return (this.playableRegionDuration >= this.minDvrSize && this.getPlaybackType() === Playback.LIVE)
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

  return !!(HLSJS.isSupported() && isHls && !Browser.isSafari)
}
