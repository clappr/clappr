var UICorePlugin = require('ui_core_plugin')
var Events = require('events')
var Container = require('container')
var ChromecastPlayback = require('./chromecast_playback')
var Styler = require('../../base/styler')
var assign = require('lodash.assign')

var Log = require('../log').getInstance()

var Browser = require('../../components/browser');

var DEVICE_STATE = {
  'IDLE' : 0,
  'ACTIVE' : 1,
  'WARNING' : 2,
  'ERROR' : 3,
};

var DEFAULT_CLAPPR_APP_ID = '9DFB77C0'

class Chromecast extends UICorePlugin {
  get name() { return 'chromecast' }
  get tagName() { return 'button' }
  get attributes() {
    return {
      'class' : 'chromecast-button chromecast-icon icon-cast'
    }
  }
  constructor(core) {
    super(core)
    if (Browser.isChrome) {
      this.appId = core.options.chromecastAppId
      this.deviceState = DEVICE_STATE.IDLE
      this.embedScript()
    } else {
      this.disable()
    }
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.settingsUpdate)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_TIMEUPDATE, this.containerTimeUpdate)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_PLAY, this.containerPlay)
  }

  embedScript() {
    if (!window.chrome.cast || !window.chrome.cast.isAvailable) {
      var script = document.createElement('script')
      script.setAttribute("type", "text/javascript")
      script.setAttribute("async", "async")
      script.setAttribute("src", "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js")
      script.onload = () => this.bootstrapCastApi()
      document.body.appendChild(script)
    } else {
      this.bootstrapCastApi()
    }
  }

  bootstrapCastApi() {
    if (!window.chrome.cast || !window.chrome.cast.isAvailable) {
      window['__onGCastApiAvailable'] = (loaded, errorInfo) => {
        if (!!loaded) {
          this.appId = this.appId || DEFAULT_CLAPPR_APP_ID
          this.initializeCastApi()
        } else {
          console.error('GCastApi error', errorInfo)
          this.disable()
        }
      }
    }
  }

  initializeCastApi() {
    var autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    var sessionRequest = new chrome.cast.SessionRequest(this.appId)
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      (session) => this.sessionListener(session), (e) => this.receiverListener(e), autoJoinPolicy)
    chrome.cast.initialize(apiConfig, () => console.log('init success'), () => console.log('init error'))
  }

  sessionListener(session) {
    console.log('new session id:' + session.sessionId)
    this.newSession(session)
  }

  sessionUpdateListener() {
    console.log(this.session)
    if (this.session.status === chrome.cast.SessionStatus.STOPPED) {
      this.sessionStopped()
    }
  }

  receiverListener(e) {
    if ( e === chrome.cast.ReceiverAvailability.AVAILABLE ) {
      console.log("receiver found")
      this.show()
    } else {
      console.log("receiver list empty");
      this.hide()
    }
  }

  launchSuccess(session) {
    console.log('launch success - session: ' + session.sessionId)
    this.newSession(session)
  }

  launchError(e) {
    console.log('error on launch', e)
  }

  loadMediaSuccess(how, mediaSession) {
    console.log('new media session', mediaSession, '(', how , ')');

    this.originalPlayback = this.core.mediaControl.container.playback

    var options = assign({}, this.originalPlayback.options, {currentMedia: mediaSession, mediaControl: this.core.mediaControl})
    this.playbackProxy = new ChromecastPlayback(options)
    this.playbackProxy.settings = this.originalPlayback.settings
    this.playbackProxy.render()

    this.mediaSession = mediaSession
    this.listenTo(this.playbackProxy, Events.PLAYBACK_TIMEUPDATE, this.playbackTimeUpdate)

    this.originalPlayback.$el.remove()
    this.core.mediaControl.container.$el.append(this.playbackProxy.$el)

    var container = this.core.mediaControl.container
    container.stopListening()
    container.playback = this.playbackProxy
    container.bindEvents()
    container.settingsUpdate()
  }

  loadMediaError(e) {
    console.log("media error", e);
  }

  newSession(session) {
    this.session = session
    this.deviceState = DEVICE_STATE.ACTIVE
    this.$el.removeClass('icon-cast')
    this.$el.addClass('icon-cast-connected')

    session.addUpdateListener(() => this.sessionUpdateListener())

    if (this.core.mediaControl.container.isPlaying()) {
      this.loadMedia()
    }
  }

  sessionStopped() {
    this.$el.addClass('icon-cast')
    this.$el.removeClass('icon-cast-connected')

    this.session = null

    this.core.load(this.playbackProxy.src)
    if (this.playbackProxy.isPlaying() || this.mediaSession.playerState === 'PAUSED') {
      var time = this.currentTime
      setTimeout(() => {
        this.core.mediaControl.container.setCurrentTime(100.0 * time / this.mediaSession.media.duration)
        this.core.mediaControl.container.play()
      }, 100)
    }

    this.playbackProxy.stop()
  }

  loadMedia() {
    this.core.mediaControl.container.playback.pause()
    var src = this.core.mediaControl.container.playback.src
    console.log("loading... " + src)
    var mediaInfo = new chrome.cast.media.MediaInfo(src)
    mediaInfo.contentType = 'video/mp4'
    var request = new chrome.cast.media.LoadRequest(mediaInfo)
    request.autoplay = true
    request.currentTime = this.currentTime
    this.session.loadMedia(request, (mediaSession) => this.loadMediaSuccess('loadMedia', mediaSession), (e) => this.loadMediaError(e))
  }

  show() {
    this.$el.show()
  }

  hide() {
    this.$el.hide()
  }

  click() {
    chrome.cast.requestSession((session) => this.launchSuccess(session), (e) => this.launchError(e))
  }

  settingsUpdate() {
    this.core.mediaControl.$el.find('.media-control-right-panel[data-media-control]').append(this.$el)
  }

  containerChanged() {
    this.stopListening()
    this.bindEvents()
    this.currentTime = 0
  }

  containerTimeUpdate(position, duration) {
    this.currentTime = position
  }

  playbackTimeUpdate(position, duration) {
    this.currentTime = position
  }

  containerPlay() {
    console.log(this.session, this.mediaSession)
    if (!!this.session && (!this.mediaSession || this.mediaSession.playerStatus === 'IDLE')) {
      console.log('load media')
      this.currentTime = 0
      this.loadMedia()
    }
  }

  render() {
    this.$el.click(() => this.click())
    this.core.mediaControl.$el.find('.media-control-right-panel[data-media-control]').append(this.$el)
    this.hide()
    var style = Styler.getStyleFor('chromecast')
    this.core.$el.append(style)
    return this
  }
}

module.exports = Chromecast
