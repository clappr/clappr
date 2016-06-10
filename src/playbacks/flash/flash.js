// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {seekStringToSeconds} from 'base/utils'

import BaseFlashPlayback from 'playbacks/base_flash_playback'
import Browser from 'components/browser'
import Mediator from 'components/mediator'
import template from 'base/template'
import $ from 'clappr-zepto'
import Events from 'base/events'
import Playback from 'base/playback'
import flashSwf from './public/Player.swf'

var MAX_ATTEMPTS = 60

export default class Flash extends BaseFlashPlayback {
  get name() { return 'flash' }
  get swfPath() { return template(flashSwf)({baseUrl: this._baseUrl}) }

  /**
   * Determine if the playback has ended.
   * @property ended
   * @type Boolean
   */
  get ended() {
    return this._currentState === 'ENDED'
  }

  /**
   * Determine if the playback is buffering.
   * This is related to the PLAYBACK_BUFFERING and PLAYBACK_BUFFERFULL events
   * @property buffering
   * @type Boolean
   */
  get buffering() {
    return !!this._bufferingState && this._currentState !== 'ENDED'
  }

  constructor(options) {
    super(options)
    this._src = options.src
    this._baseUrl = options.baseUrl
    this._autoPlay = options.autoPlay
    this.settings = {default: ['seekbar']}
    this.settings.left = ['playpause', 'position', 'duration']
    this.settings.right = ['fullscreen', 'volume']
    this.settings.seekEnabled = true
    this._isReadyState = false
    this._addListeners()
  }


  _bootstrap() {
    if (this.el.playerPlay) {
      this.el.width = '100%'
      this.el.height = '100%'
      if (this._currentState === 'PLAYING') {
        this._firstPlay()
      } else {
        this._currentState = 'IDLE'
        this._autoPlay && this.play()
      }
      $('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" />').insertAfter(this.$el)
      if (this.getDuration() > 0) {
        this._metadataLoaded()
      } else {
        Mediator.once(this.uniqueId + ':timeupdate', this._metadataLoaded, this)
      }
    } else {
      this._attempts = this._attempts || 0
      if (++this._attempts <= MAX_ATTEMPTS) {
        setTimeout(() => this._bootstrap(), 50)
      } else {
        this.trigger(Events.PLAYBACK_ERROR, {message: 'Max number of attempts reached'}, this.name)
      }
    }
  }

  _metadataLoaded() {
    this._isReadyState = true
    this.trigger(Events.PLAYBACK_READY, this.name)
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE, this.name)
  }

  getPlaybackType() {
    return Playback.VOD
  }

  isHighDefinitionInUse() {
    return false
  }

  _updateTime() {
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: this.el.getPosition(), total: this.el.getDuration()}, this.name)
  }

  _addListeners() {
    Mediator.on(this.uniqueId + ':progress', this._progress, this)
    Mediator.on(this.uniqueId + ':timeupdate', this._updateTime, this)
    Mediator.on(this.uniqueId + ':statechanged', this._checkState, this)
    Mediator.on(this.uniqueId + ':flashready', this._bootstrap, this)
  }

  stopListening() {
    super.stopListening()
    Mediator.off(this.uniqueId + ':progress')
    Mediator.off(this.uniqueId + ':timeupdate')
    Mediator.off(this.uniqueId + ':statechanged')
    Mediator.off(this.uniqueId + ':flashready')
  }

  _checkState() {
    if (this._isIdle || this._currentState === 'PAUSED') {
      return
    } else if (this._currentState !== 'PLAYING_BUFFERING' && this.el.getState() === 'PLAYING_BUFFERING') {
      this._bufferingState = true
      this.trigger(Events.PLAYBACK_BUFFERING, this.name)
      this._currentState = 'PLAYING_BUFFERING'
    } else if (this.el.getState() === 'PLAYING') {
      this._bufferingState = false
      this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
      this._currentState = 'PLAYING'
    } else if (this.el.getState() === 'IDLE') {
      this._currentState = 'IDLE'
    } else if (this.el.getState() === 'ENDED') {
      this.trigger(Events.PLAYBACK_ENDED, this.name)
      this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 0, total: this.el.getDuration()}, this.name)
      this._currentState = 'ENDED'
      this._isIdle = true
    }
  }

  _progress() {
    if (this._currentState !== 'IDLE' && this._currentState !== 'ENDED') {
      this.trigger(Events.PLAYBACK_PROGRESS,{
        start: 0,
        current: this.el.getBytesLoaded(),
        total: this.el.getBytesTotal()
      })
    }
  }

  _firstPlay() {
    if (this.el.playerPlay) {
      this._isIdle = false
      this.el.playerPlay(this._src)
      this.listenToOnce(this, Events.PLAYBACK_BUFFERFULL, () => this._checkInitialSeek())
      this._currentState = 'PLAYING'
    } else {
      this.listenToOnce(this, Events.PLAYBACK_READY, this._firstPlay)
    }
  }

  _checkInitialSeek() {
    var seekTime = seekStringToSeconds(window.location.href)
    if (seekTime !== 0) {
      this.seekSeconds(seekTime)
    }
  }

  play() {
    this.trigger(Events.PLAYBACK_PLAY_INTENT)
    if (this._currentState === 'PAUSED' || this._currentState === 'PLAYING_BUFFERING') {
      this._currentState = 'PLAYING'
      this.el.playerResume()
      this.trigger(Events.PLAYBACK_PLAY, this.name)
    } else if (this._currentState !== 'PLAYING') {
      this._firstPlay()
      this.trigger(Events.PLAYBACK_PLAY, this.name)
    }
  }

  volume(value) {
    if (this.isReady) {
      this.el.playerVolume(value)
    } else {
      this.listenToOnce(this, Events.PLAYBACK_BUFFERFULL, () => this.volume(value))
    }
  }

  pause() {
    this._currentState = 'PAUSED'
    this.el.playerPause()
    this.trigger(Events.PLAYBACK_PAUSE, this.name)
  }

  stop() {
    this.el.playerStop()
    this.trigger(Events.PLAYBACK_STOP)
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: 0, total: 0}, this.name)
  }

  isPlaying() {
    return !!(this.isReady && this._currentState.indexOf('PLAYING') > -1)
  }

  get isReady(){
    return this._isReadyState
  }

  getDuration() {
    return this.el.getDuration()
  }

  seekPercentage(percentage) {
    if (this.el.getDuration() > 0) {
      var seekSeconds = this.el.getDuration() * (percentage / 100)
      this.seek(seekSeconds)
    } else {
      this.listenToOnce(this, Events.PLAYBACK_BUFFERFULL, () => this.seekPercentage(percentage))
    }
  }

  seek(time) {
    if (this.isReady && this.el.playerSeek) {
      this.el.playerSeek(time)
      this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: time, total: this.el.getDuration()}, this.name)
      if (this._currentState === 'PAUSED') {
        this.el.playerPause()
      }
    } else {
      this.listenToOnce(this, Events.PLAYBACK_BUFFERFULL, () => this.seek(time))
    }
  }

  destroy() {
    clearInterval(this.bootstrapId)
    super.stopListening()
    this.$el.remove()
  }
}

Flash.canPlay = function(resource) {
  if (!Browser.hasFlash || !resource || resource.constructor !== String) {
    return false
  } else {
    var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
    return resourceParts.length > 1 && !Browser.isMobile && resourceParts[1].match(/^(mp4|mov|f4v|3gpp|3gp)$/)
  }
}
