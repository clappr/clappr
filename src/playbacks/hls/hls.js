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
      return AUTO
    } else {
      return this._currentLevel //0 is a valid level ID
    }
  }
  set currentLevel(id) {
    this._currentLevel = id
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_START)
    this._hls.currentLevel = this._currentLevel
  }

  constructor(options) {
    super(options)
    this._minDvrSize = (options.hlsMinimumDvrSize === undefined) ? 60 : options.hlsMinimumDvrSize
    this._playbackType = Playback.VOD
    // for hls streams which have dvr with a sliding window,
    // the content at the start of the playlist is removed as new
    // content is appended at the end.
    // this means the actual playable start time will increase as the
    // start content is deleted
    // For streams with dvr where the entire recording is kept from the
    // beginning this should stay as 0
    this._playableRegionStartTime = 0
    // if content is removed from the beginning then this empty area should
    // be ignored. "playableRegionDuration" does not consider this
    this._playableRegionDuration = 0
    // true when the actual duration is longer than hlsjs's live sync point
    // when this is false playableRegionDuration will be the actual duration
    // when this is true playableRegionDuration will exclude the time after the sync point
    this._durationExcludesAfterLiveSyncPoint = false
    options.autoPlay && this._setupHls()
    this._recoverAttemptsRemaining = options.hlsRecoverAttempts || 16
  }

  _setupHls() {
    this._hls = new HLSJS(this._options.hlsjsConfig || {})
    this._hls.on(HLSJS.Events.MEDIA_ATTACHED, () => this._hls.loadSource(this._options.src))
    this._hls.on(HLSJS.Events.LEVEL_LOADED, (evt, data) => this._updatePlaybackType(evt, data))
    this._hls.on(HLSJS.Events.LEVEL_UPDATED, (evt, data) => this._onLevelUpdated(evt, data))
    this._hls.on(HLSJS.Events.LEVEL_SWITCH, (evt,data) => this._onLevelSwitch(evt, data))
    this._hls.on(HLSJS.Events.FRAG_LOADED, (evt, data) => this._onFragmentLoaded(evt, data))
    this._hls.on(HLSJS.Events.ERROR, (evt, data) => this._onHLSJSError(evt, data))
    this._hls.attachMedia(this.el)
  }

  _recover(evt, data) {
    if (!this._recoveredDecodingError) {
      this._recoveredDecodingError = true
      this._hls.recoverMediaError()
    } else if (!this._recoveredAudioCodecError) {
      this._recoveredAudioCodecError = true
      this._hls.swapAudioCodec()
      this._hls.recoverMediaError()
    } else {
      Log.error('hlsjs: failed to recover')
      this.trigger(Events.PLAYBACK_ERROR, `hlsjs: could not recover from error, evt ${evt}, data ${data} `, this.name)
    }
  }

  // override
  _setupSrc(srcUrl) { // eslint-disable-line no-unused-vars
    // this playback manages the src on the video element itself
  }

  // the duration on the video element itself should not be used
  // as this does not necesarily represent the duration of the stream
  // https://github.com/clappr/clappr/issues/668#issuecomment-157036678
  getDuration() {
    return this._playableRegionDuration
  }

  getCurrentTime() {
    return this.el.currentTime - this._playableRegionStartTime
  }

  // the time that "0" now represents relative to when playback started
  // for a stream with a sliding window this will increase as content is
  // removed from the beginning
  getStartTimeOffset() {
    return this._playableRegionStartTime
  }

  seekPercentage(percentage) {
    var seekTo = this._playableRegionDuration
    if (percentage > 0) {
      seekTo = this._playableRegionDuration * (percentage / 100)
    }
    this.seek(seekTo)
  }

  seek(time) {
    if (time < 0) {
      Log.warn('Attempt to seek to a negative time. Resetting to live point. Use seekToLivePoint() to seek to the live point.')
      time = this.getDuration()
    }
    // assume live if time within 3 seconds of end of stream
    this.dvrEnabled && this._updateDvr(time < this.getDuration()-3)
    time += this._playableRegionStartTime
    super.seek(time)
  }

  seekToLivePoint() {
    this.seek(this.getDuration())
  }

  _updateDvr(status) {
    this.trigger(Events.PLAYBACK_DVR, status)
    this.trigger(Events.PLAYBACK_STATS_ADD, {'dvr': status})
  }

  _updateSettings() {
    if (this._playbackType === Playback.VOD) {
      this.settings.left = ['playpause', 'position', 'duration']
    } else if (this.dvrEnabled) {
      this.settings.left = ['playpause']
    } else {
      this.settings.left = ['playstop']
    }
    this.settings.seekEnabled = this.isSeekEnabled()
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  _onHLSJSError(evt, data) {
    // only report/handle errors if they are fatal
    // hlsjs should automatically handle non fatal errors
    if (data.fatal) {
      if (this._recoverAttemptsRemaining > 0) {
        this._recoverAttemptsRemaining -= 1
        switch (data.type) {
        case HLSJS.ErrorTypes.NETWORK_ERROR:
          Log.warn(`hlsjs: trying to recover from network error, evt ${evt}, data ${data} `)
          this._hls.startLoad()
          break
        case HLSJS.ErrorTypes.MEDIA_ERROR:
          Log.warn(`hlsjs: trying to recover from media error, evt ${evt}, data ${data} `)
          this._recover(evt, data)
          break
        default:
          Log.error(`hlsjs: trying to recover from error, evt ${evt}, data ${data} `)
          this.trigger(Events.PLAYBACK_ERROR, `hlsjs: could not recover from error, evt ${evt}, data ${data} `, this.name)
          break
        }
      } else {
        Log.error(`hlsjs: could not recover from error after maximum number of attempts, evt ${evt}, data ${data} `)
        this.trigger(Events.PLAYBACK_ERROR, {evt, data}, this.name)
      }
    }
    else {
      Log.warn(`hlsjs: non-fatal error occurred, evt ${evt}, data ${data} `)
    }
  }

  _onTimeUpdate() {
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: this.getCurrentTime(), total: this.getDuration()}, this.name)
  }

  _onProgress() {
    if (!this.el.buffered.length) {
      return
    }
    var bufferedPos = 0
    for (var i = 0; i < this.el.buffered.length; i++) {
      if (this.el.currentTime >= this.el.buffered.start(i) && this.el.currentTime <= this.el.buffered.end(i)) {
        bufferedPos = i
        break
      }
    }
    this.trigger(Events.PLAYBACK_PROGRESS, {
      // for a stream with sliding window dvr something that is buffered my slide off the start of the timeline
      start: Math.max(0, this.el.buffered.start(bufferedPos) - this._playableRegionStartTime),
      current: Math.max(0, this.el.buffered.end(bufferedPos) - this._playableRegionStartTime),
      total: this.getDuration()
    })
  }

  play() {
    if (!this._hls) {
      this._setupHls()
    }
    super.play()
  }

  pause() {
    if (!this._hls) {
      return
    }
    super.pause()
    if (this.dvrEnabled) {
      this._updateDvr(true)
    }
  }

  stop() {
    if (this._hls) {
      super.stop()
      this._hls.destroy()
      delete this._hls
    }
  }

  _updatePlaybackType(evt, data) {
    this._playbackType = data.details.live ? Playback.LIVE : Playback.VOD
    this._fillLevels()
    this._onLevelUpdated(evt, data)
  }

  _fillLevels() {
    this._levels = this._hls.levels.map((level, index) => {
      return {id: index, level: level, label: `${level.bitrate/1000}Kbps`
    }})
    this.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, this._levels)
  }

  _onLevelUpdated(evt, data) {
    var startTimeChanged = false
    var durationChanged = false
    var fragments = data.details.fragments
    if (fragments.length > 0 && this._playableRegionStartTime !== fragments[0].start) {
      startTimeChanged = true
      this._playableRegionStartTime = fragments[0].start
    }
    var newDuration = data.details.totalduration
    // if it's a live stream then shorten the duration to remove access
    // to the area after hlsjs's live sync point
    // seeks to areas after this point sometimes have issues
    if (this._playbackType === Playback.LIVE) {
      let currentLevel = this._hls.levels[data.level]
      let fragmentTargetDuration = currentLevel.details.targetduration
      let hlsjsConfig = this._options.hlsjsConfig || {}
      let liveSyncDurationCount = hlsjsConfig.liveSyncDurationCount || HLSJS.DefaultConfig.liveSyncDurationCount
      let hiddenAreaDuration = fragmentTargetDuration * liveSyncDurationCount
      if (hiddenAreaDuration <= newDuration) {
        newDuration -= hiddenAreaDuration
        this._durationExcludesAfterLiveSyncPoint = true
      }
      else {
        this._durationExcludesAfterLiveSyncPoint = false
      }
    }

    if (newDuration !== this._playableRegionDuration) {
      durationChanged = true
      this._playableRegionDuration = newDuration
    }

    // now that the values have been updated call any methods that use on them so they get the updated values
    // immediately
    durationChanged && this._onDurationChange()
    startTimeChanged && this._onProgress()
  }

  _onFragmentLoaded(evt, data) {
    this.trigger(Events.PLAYBACK_FRAGMENT_LOADED, data)
  }

  _onLevelSwitch(evt, data) {
    if (!this.levels.length) {
      this._fillLevels()
    }
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_END)
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH, data)
    var currentLevel = this._hls.levels[data.level]
    if (currentLevel) {
      // TODO should highDefinition be private and maybe have a read only accessor if it's used somewhere
      this.highDefinition = (currentLevel.height >= 720 || (currentLevel.bitrate / 1000) >= 2000)
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
    // enabled when:
    // - the duration does not include content after hlsjs's live sync point
    // - the playable region duration is longer than the configured duration to enable dvr after
    // - the playback type is LIVE.
    return (this._durationExcludesAfterLiveSyncPoint && this._playableRegionDuration >= this._minDvrSize && this.getPlaybackType() === Playback.LIVE)
  }

  getPlaybackType() {
    return this._playbackType
  }

  isSeekEnabled() {
    return (this._playbackType === Playback.VOD || this.dvrEnabled)
  }
}

HLS.canPlay = function(resource, mimeType) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  var isHls = ((resourceParts.length > 1 && resourceParts[1] === 'm3u8') ||
        mimeType === 'application/x-mpegURL' || mimeType === 'application/vnd.apple.mpegurl')

  return !!(HLSJS.isSupported() && isHls && !Browser.isSafari)
}
