import {HTML5Video, Log, Events} from 'clappr'
import shaka from 'shaka-player'

const SEND_STATS_AT = 10 * 1000

export default class ClapprDashShaka extends HTML5Video {

  //where is this enforced???
  name() {return 'clappr_dash_shaka'}

  constructor(options) {
    super(options)
    this._readyToPlay = false
    this._setup()

    var checkIsReady = (fn) => {
      return (arg) => {
        if (this._readyToPlay) return fn(arg)
      }
    }

    this.enableTextTrack = checkIsReady((enable) => this._player.enableTextTrack(enable))
    this.textTracks = checkIsReady(() => this._player.getTextTracks())
    this.selectTextTrack = checkIsReady((id) => this._player.selectTextTrack(id))
    this.audioTracks = checkIsReady(() => this._player.getAudioTracks())
    this.selectAudioTrack = checkIsReady((id) => this._player.selectAudioTrack(id))
    this.videoTracks = checkIsReady(() => this._player.getVideoTracks())
    this.selectVideoTrack = checkIsReady((id) => this._player.selectVideoTrack(id))
  }

  // skipping ready event on video tag in favor of ready on shaka
  ready() {}

  // skipping buffering handling on video tag in favor of buffering on shaka
  // bufferFull() {}

  // skipping error handling on video tag in favor of error on shaka
  error(event) { Log.error('an error was raised by the video tag', event, this.el.error)}

  isHighDefinitionInUse() { return !!this.highDefinition }

  getPlaybackType() {
    return this._player && (this._player.isLive() ? 'live' : 'vod')
  }

  destroy() {
    // should I do that on stop too? I think so... it's not pause and resume
    clearInterval(this.sendStats)
    this._player.destroy().
      then(this._destroy.bind(this)).
      catch(() => Log.error('shaka could not be destroyed'))
  }

  version() {return shaka.player.Player.version}

  _setup() {
    this._player = this._createPlayer()

    var playerLoaded = this._player.load(new shaka.player.DashVideoSource(this.options.src))
    playerLoaded.then(this._loaded.bind(this)).catch(this._setupError.bind(this))
  }

  _createPlayer() {
    var player = new shaka.player.Player(this.el)
    player.addEventListener('bufferingStart', this._bufferingHandler.bind(this))
    player.addEventListener('bufferingEnd', this._bufferingFullHandler.bind(this))
    player.addEventListener('error', this._error.bind(this))
    player.addEventListener('adaptation', this._onAdaptation.bind(this));
    return player
  }

  _loaded() {
    this._ready()
    this._startToSendStats()
  }

  _startToSendStats() {
    this.sendStats = setInterval(() => {
      console.log(this._player.getStats())
      this.trigger(Events.PLAYBACK_STATS_ADD, this._player.getStats())
    }, SEND_STATS_AT)
  }

  _setupError(e) {
    this._error({detail: 'shaka could not be setup: ' + e})
  }

  _bufferingHandler() { console.log('buf'); this.trigger(Events.PLAYBACK_BUFFERING, this.name) }

  _bufferingFullHandler() { console.log('buf full'); this.trigger(Events.PLAYBACK_BUFFERFULL, this.name) }

  _error(error) {
    console.log('error:', error.detail)
    Log.error('an error was raised by shaka player', error.detail)
    this.trigger(Events.PLAYBACK_ERROR, error.detail, this.name)
  }

  _onAdaptation(event) {
    console.log('adaptation', event)
    if (!!event.size) return

      Log.debug('an adaptation happened: ', event)
      this.highDefinition = (event.size.height >= 720)
      this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition)
      this.trigger(Events.PLAYBACK_BITRATE, {bitrate: event.size.height})
  }

  _destroy() {
    super.destroy()
    this._readyToPlay = false
    Log.debug('shaka was destroyed')
  }

  _ready() {
    this._readyToPlay = true
    super.ready()
  }
}

ClapprDashShaka.canPlay = function(resource, mimeType) {
  shaka.polyfill.installAll()

  if (!shaka.player.Player.isBrowserSupported()) {
    Log.debug('This browser does not support this video')
    return false
  }

  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  return "mpd" === resourceParts[1]
}

