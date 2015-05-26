// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Playback = require('../../base/playback')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')
var Mediator = require('../../components/mediator')
var template = require('../../base/template')
var $ = require('clappr-zepto')
var Browser = require('../../components/browser')
var seekStringToSeconds = require('../../base/utils').seekStringToSeconds
var Events = require('../../base/events')

var objectIE = '<object type="application/x-shockwave-flash" id="<%= cid %>" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" data-flash-vod=""><param name="movie" value="<%= baseUrl %>/assets/Player.swf"> <param name="quality" value="autohigh"> <param name="swliveconnect" value="true"> <param name="allowScriptAccess" value="always"> <param name="bgcolor" value="#001122"> <param name="allowFullScreen" value="false"> <param name="wmode" value="gpu"> <param name="tabindex" value="1"> <param name=FlashVars value="playbackId=<%= playbackId %>" /> </object>'

class Flash extends Playback {
  get name() { return 'flash' }
  get tagName() { return 'object' }
  get template() { return JST.flash }

  constructor(options) {
    super(options)
    this.src = options.src
    this.baseUrl = options.baseUrl
    this.autoPlay = options.autoPlay
    this.settings = {default: ['seekbar']}
    this.settings.left = ["playpause", "position", "duration"]
    this.settings.right = ["fullscreen", "volume"]
    this.settings.seekEnabled = true
    this.isReady = false
    this.addListeners()
  }


  bootstrap() {
    this.el.width = "100%"
    this.el.height = "100%"
    this.isReady = true
    if (this.currentState === 'PLAYING') {
      this.firstPlay()
    } else {
      this.currentState = "IDLE"
      this.autoPlay && this.play()
    }
    $('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" />').insertAfter(this.$el)
    this.trigger(Events.PLAYBACK_READY, this.name)
  }

  getPlaybackType() {
    return 'vod'
  }

  setupFirefox() {
    var $el = this.$('embed')
    $el.attr('data-flash', '')
    this.setElement($el[0])
  }

  isHighDefinitionInUse() {
    return false
  }

  updateTime() {
    this.trigger(Events.PLAYBACK_TIMEUPDATE, this.el.getPosition(), this.el.getDuration(), this.name)
  }

  addListeners() {
    Mediator.on(this.uniqueId + ':progress', this.progress, this)
    Mediator.on(this.uniqueId + ':timeupdate', this.updateTime, this)
    Mediator.on(this.uniqueId + ':statechanged', this.checkState, this)
    Mediator.on(this.uniqueId + ':flashready', this.bootstrap, this)
  }

  stopListening() {
    super.stopListening()
    Mediator.off(this.uniqueId + ':progress')
    Mediator.off(this.uniqueId + ':timeupdate')
    Mediator.off(this.uniqueId + ':statechanged')
    Mediator.off(this.uniqueId + ':flashready')
  }

  checkState() {
    if (this.currentState === "PAUSED") {
      return
    } else if (this.currentState !== "PLAYING_BUFFERING" && this.el.getState() === "PLAYING_BUFFERING") {
      this.trigger(Events.PLAYBACK_BUFFERING, this.name)
      this.currentState = "PLAYING_BUFFERING"
    } else if (this.el.getState() === "PLAYING") {
      this.trigger(Events.PLAYBACK_BUFFERFULL, this.name)
      this.currentState = "PLAYING"
    } else if (this.el.getState() === "IDLE") {
      this.currentState = "IDLE"
    } else if (this.el.getState() === "ENDED") {
      this.trigger(Events.PLAYBACK_ENDED, this.name)
      this.trigger(Events.PLAYBACK_TIMEUPDATE, 0, this.el.getDuration(), this.name)
      this.currentState = "ENDED"
    }
  }

  progress() {
    if (this.currentState !== "IDLE" && this.currentState !== "ENDED") {
      this.trigger(Events.PLAYBACK_PROGRESS, 0, this.el.getBytesLoaded(), this.el.getBytesTotal(), this.name)
    }
  }

  firstPlay() {
    if (this.el.playerPlay) {
      this.el.playerPlay(this.src)
      this.listenToOnce(this, Events.PLAYBACK_BUFFERFULL, () => this.checkInitialSeek())
      this.currentState = "PLAYING"
    } else {
      this.listenToOnce(this, Events.PLAYBACK_READY, this.firstPlay)
    }
  }

  checkInitialSeek() {
    var seekTime = seekStringToSeconds(window.location.href)
    if (seekTime !== 0) {
      this.seekSeconds(seekTime)
    }
  }

  play() {
    if (this.el.getState() === 'PAUSED' || this.el.getState() === 'PLAYING_BUFFERING') {
      this.currentState = "PLAYING"
      this.el.playerResume()
    } else if (this.el.getState() !== 'PLAYING') {
      this.firstPlay()
    }
    this.trigger(Events.PLAYBACK_PLAY, this.name)
  }

  volume(value) {
    if (this.isReady) {
      this.el.playerVolume(value)
    } else {
      this.listenToOnce(this, Events.PLAYBACK_BUFFERFULL, () => this.volume(value))
    }
  }

  pause() {
    this.currentState = "PAUSED"
    this.el.playerPause()
    this.trigger(Events.PLAYBACK_PAUSE, this.name)
  }

  stop() {
    this.el.playerStop()
    this.trigger(Events.PLAYBACK_TIMEUPDATE, 0, this.name)
  }

  isPlaying() {
    return !!(this.isReady && this.currentState.indexOf("PLAYING") > -1)
  }

  getDuration() {
    return this.el.getDuration()
  }

  seek(seekBarValue) {
    var seekTo = this.el.getDuration() * (seekBarValue / 100)
    this.seekSeconds(seekTo)
  }

  seekSeconds(seekTo) {
    this.el.playerSeek(seekTo)
    this.trigger(Events.PLAYBACK_TIMEUPDATE, seekTo, this.el.getDuration(), this.name)
    if (this.currentState === "PAUSED") {
      this.el.playerPause()
    }
  }

  destroy() {
    clearInterval(this.bootstrapId)
    super.stopListening()
    this.$el.remove()
  }

  setupIE() {
    this.setElement($(template(objectIE)({ cid: this.cid, baseUrl: this.baseUrl, playbackId: this.uniqueId })))
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template({ cid: this.cid, baseUrl: this.baseUrl, playbackId: this.uniqueId }))
    if(Browser.isFirefox) {
      this.setupFirefox()
    } else if(Browser.isLegacyIE) {
      this.setupIE()
    }
    this.$el.append(style)
    return this
  }
}

Flash.canPlay = function(resource) {
  if (!Browser.hasFlash || !resource || resource.constructor !== String) {
    return false
  } else {
    var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
    if ((!Browser.isMobile && Browser.isFirefox) || Browser.isLegacyIE) {
      return resourceParts.length > 1 && resourceParts[1].match(/^(mp4|mov|f4v|3gpp|3gp)$/)
    } else {
      return resourceParts.length > 1 && resourceParts[1].match(/^(mov|f4v|3gpp|3gp)$/)
    }
  }
}

module.exports = Flash
