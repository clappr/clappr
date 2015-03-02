var UICorePlugin = require('ui_core_plugin')

var Log = require('../log').getInstance()

var Browser = require('../../components/browser');

var DEVICE_STATE = {
  'IDLE' : 0,
  'ACTIVE' : 1,
  'WARNING' : 2,
  'ERROR' : 3,
};

class Chromecast extends UICorePlugin {
  get name() { return 'chromecast' }
  constructor(core) {
    super(core)
    if (Browser.isChrome) {
      this.appId = core.options.chromecastAppId
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
          console.log(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID)
          this.appId = this.appId || chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
          this.initializeCastApi()
        } else {
          console.error('GCastApi error', errorInfo)
          this.disable()
        }
      }
    }
  }

  initializeCastApi() {
    var sessionRequest = new chrome.cast.SessionRequest(this.appId)
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest, (session) => this.sessionListener(session), (e) => this.receiverListener(e))
    chrome.cast.initialize(apiConfig, () => console.log('init success'), () => console.log('init error'))
  }

  sessionListener(session) {
    console.log('new session id:' + e.sessionId)
    this.session = session
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

  show() {
    this.$el.show()
  }

  hide() {
    this.$el.hide()
  }

  render() {
    this.$el.html('<button>Chromecast</button>')
    this.core.mediaControl.$el.find('.media-control-right-panel[data-media-control]').append(this.$el)
    this.hide()
    return this
  }
}

module.exports = Chromecast
