import {HTML5Video, Log, Events} from 'clappr'
import shaka from 'shaka-player'

const SEND_STATS_AT = 30 * 1000

export default class ClapprDashShaka extends HTML5Video {
  //where is this enforced???
  name() {return 'clappr_dash_shaka'}

  constructor(options) {
    super(options)
    this._readyToPlay = false

    var checkIfIsReady = (fn) => {
      return (arg) => {
        if (this._readyToPlay) return fn(arg)
      }
    }

    this.enableTextTrack = checkIfIsReady((enable) => this._player.enableTextTrack(enable))
    this.textTracks = checkIfIsReady(() => this._player.getTextTracks())
    this.selectTextTrack = checkIfIsReady((id) => this._player.selectTextTrack(id))
    this.audioTracks = checkIfIsReady(() => this._player.getAudioTracks())
    this.selectAudioTrack = checkIfIsReady((id) => this._player.selectAudioTrack(id))
    this.videoTracks = checkIfIsReady(() => this._player.getVideoTracks())
    this.selectVideoTrack = checkIfIsReady((id) => this._player.selectVideoTrack(id))

    this.getPlaybackType = checkIfIsReady(() => (this._player.isLive()?'live':'vod'))
  }

  render() {
    super.render()
    this._setup()
    return this
  }

  play() {
    if (!this._readyToPlay) {
      this.once(Events.PLAYBACK_READY, this.play)
      return
    }
    super.play()
  }

  // skipping ready event on video tag in favor of ready on shaka
  ready() {}

  // skipping buffering handling on video tag in favor of buffering on shaka
  // bufferFull() {}

  // skipping error handling on video tag in favor of error on shaka
  error(event) { Log.error('an error was raised by the video tag', event, this.el.error)}

  isHighDefinitionInUse() { return !!this.highDefinition }

  stop() {
    clearInterval(this.sendStatsId)
    this._sendStats()
    super.stop()
  }
  destroy() {
    clearInterval(this.sendStatsId)
    this._player.destroy().
      then(this._destroy.bind(this)).
      catch(() => Log.error('shaka could not be destroyed'))
  }

  version() {return shaka.player.Player.version}

  _setup() {
    this._player = this._createPlayer()

    // we still need to deal with autoload
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
    this.sendStatsId = setInterval(this._sendStats, SEND_STATS_AT)
  }

  _sendStats() {this.trigger(Events.PLAYBACK_STATS_ADD, this._player.getStats())

  _setupError(e) {
    this._error({detail: 'shaka could not be setup: ' + e})
  }

  _bufferingHandler() { this.trigger(Events.PLAYBACK_BUFFERING, this.name) }

  _bufferingFullHandler() { this.trigger(Events.PLAYBACK_BUFFERFULL, this.name) }

  _error(error) {
    Log.error('an error was raised by shaka player', error.detail)
    this.trigger(Events.PLAYBACK_ERROR, error.detail, this.name)
  }

  _onAdaptation(event) {
    if (!!event.size) return

    Log.debug('an adaptation has happened:', event)
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

