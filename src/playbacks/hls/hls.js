// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import HTML5VideoPlayback from 'playbacks/html5_video'
import HLSJS from 'hls.js'
import Events from 'base/events'
import Playback from 'base/playback'
import Browser from 'components/browser'
import Log from 'plugins/log'

const AUTO = -1

export default class HLS extends HTML5VideoPlayback {
  get name() { return 'hls' }

  get levels() { return this._levels || [] }
  get currentLevel() {
    if (this._currentLevel === null || this._currentLevel === undefined) {
      return AUTO;
    } else {
      return this._currentLevel; //0 is a valid level ID
    }
  }
  set currentLevel(id) {
    this._currentLevel = id
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_START)
    this.hls.currentLevel = this._currentLevel
  }

  constructor(options) {
    super(options)
    this.minDvrSize = (options.hlsMinimumDvrSize === undefined) ? 60 : options.hlsMinimumDvrSize
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
    options.autoPlay && this.setupHls()
  }

  setupHls() {
    this.hls = new HLSJS(this.options.hlsjsConfig || {})
    this.hls.on(HLSJS.Events.MEDIA_ATTACHED, () => this.hls.loadSource(this.options.src))
    this.hls.on(HLSJS.Events.LEVEL_LOADED, (evt, data) => this.updatePlaybackType(evt, data))
    this.hls.on(HLSJS.Events.LEVEL_UPDATED, (evt, data) => this.onLevelUpdated(evt, data))
    this.hls.on(HLSJS.Events.LEVEL_SWITCH, (evt,data) => this.onLevelSwitch(evt, data))
    this.hls.on(HLSJS.Events.FRAG_LOADED, (evt, data) => this.onFragmentLoaded(evt, data))
    this.hls.attachMedia(this.el)
  }

  // override
  setupSrc(srcUrl) {
    // this playback manages the src on the video element itself
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

  // the time that "0" now represents relative to when playback started
  // for a stream with a sliding window this will increase as content is
  // removed from the beginning
  getStartTimeOffset() {
    return this.playableRegionStartTime
  }

  seekPercentage(percentage) {
    var seekTo = this.playableRegionDuration
    if (percentage > 0) {
      seekTo = this.playableRegionDuration * (percentage / 100)
    }
    this.seek(seekTo)
  }

  seek(time) {
    if (time < 0) {
      Log.warn("Attempt to seek to a negative time. Resetting to live point. Use seekToLivePoint() to seek to the live point.")
      time = this.getDuration()
    }
    // assume live if time within 3 seconds of end of stream
    this.dvrEnabled && this.updateDvr(time < this.getDuration()-3)
    time += this.playableRegionStartTime
    super.seek(time)
  }

  seekToLivePoint() {
    this.seek(this.getDuration())
  }

  updateDvr(status) {
    this.trigger(Events.PLAYBACK_DVR, status)
    this.trigger(Events.PLAYBACK_STATS_ADD, {'dvr': status})
  }

  updateSettings() {
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

  onTimeUpdate() {
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
    super.stop()
    if (this.hls) {
      this.hls.destroy()
      delete this.hls
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

  onLevelUpdated(evt, data) {
    var fragments = data.details.fragments
    if (fragments.length > 0) {
      this.playableRegionStartTime = fragments[0].start
    }
    var newDuration = data.details.totalduration

    // if it's a live stream then shorten the duration to remove access
    // to the area after hlsjs's live sync point
    // seeks to areas after this point sometimes have issues
    if (this.playbackType === Playback.LIVE) {
      let currentLevel = this.hls.levels[data.level]
      let fragmentTargetDuration = currentLevel.details.targetduration
      let hlsjsConfig = this.options.hlsjsConfig || {}
      let liveSyncDurationCount = hlsjsConfig.liveSyncDurationCount || HLSJS.DefaultConfig.liveSyncDurationCount
      let hiddenAreaDuration = fragmentTargetDuration * liveSyncDurationCount
      if (hiddenAreaDuration <= newDuration) {
        newDuration -= hiddenAreaDuration
      }
    }
    if (newDuration !== this.playableRegionDuration) {
      this.playableRegionDuration = newDuration
      this.onDurationChange()
    }
  }

  onFragmentLoaded(evt, data) {
    this.trigger(Events.PLAYBACK_FRAGMENT_LOADED, data)
  }

  onLevelSwitch(evt, data) {
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_END)
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH, data)
    var currentLevel = this.hls.levels[data.level]
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
