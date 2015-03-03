var UICorePlugin = require('ui_core_plugin')
var Container = require('container')
var ChromecastPlayback = require('./chromecast_playback')
var assign = require('lodash.assign')

var Log = require('../log').getInstance()

var Browser = require('../../components/browser');

var DEVICE_STATE = {
  'IDLE' : 0,
  'ACTIVE' : 1,
  'WARNING' : 2,
  'ERROR' : 3,
};

var DEFAULT_CLAPPR_APP_ID = '6BF3C808'

class Chromecast extends UICorePlugin {
  get name() { return 'chromecast' }
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
    if (!window.chrome.cast.isAvailable) {
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
    var options = assign({'currentMedia': mediaSession}, this.originalPlayback.options)
    this.playbackProxy = new ChromecastPlayback(options)
    this.playbackProxy.settings = this.originalPlayback.settings
    this.playbackProxy.render()

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

    if (this.core.mediaControl.container.isPlaying()) {
      this.loadMedia()
    }
  }

  loadMedia() {
    var src = this.core.mediaControl.container.playback.src
    console.log("loading... " + src)
    var mediaInfo = new chrome.cast.media.MediaInfo(src)
    mediaInfo.contentType = 'video/mp4'
    var request = new chrome.cast.media.LoadRequest(mediaInfo)
    request.autoplay = true
    request.currentTime = 0
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

  render() {
    this.$el.html('<button>Chromecast</button>')
    this.$el.click(() => this.click())
    this.core.mediaControl.$el.find('.media-control-right-panel[data-media-control]').append(this.$el)
    this.hide()
    return this
  }
}

module.exports = Chromecast
