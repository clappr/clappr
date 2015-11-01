import {HTML5Video, Log, Events} from 'clappr'
import shaka from 'shaka-player'

const SEND_STATS_AT = 10 * 1000

export default class ClapprDashShaka extends HTML5Video {

  //where is this enforced? maybe we should take it to base_object or each individual
  name() {return 'clappr_dash_shaka'}

  constructor(options) {
    super(options)
    this._readyToPlay = false
    this._setup()
    //var checkIsReady = (fn) => { () => { this._readyToPlay && fn() } }
  }

  enableTextTrack(enable=true){
   this._readyToPlay && this._player.enableTextTrack(enable)
  }

  //maybe we should use this in Playback or AudioSubVideoPlayback ...
  audioTracks() {return this._readyToPlay && this._player.getAudioTracks()}

  selectAudioTrack(id) {this._readyToPlay && this._player.selectAudioTrack(id)}

  textTracks() {return this._readyToPlay && this._player.getTextTracks()}

  selectTextTrack(id) {this._readyToPlay && this._player.selectTextTrack(id)}

  videoTracks() {return this._readyToPlay && this._player.getVideoTracks()}

  selectVideoTrack(id) {this._readyToPlay && this._player.selectVideoTrack(id)}

  // skipping ready event on video tag in favor of ready on shaka
  ready() {}

  // skipping buffering handling on video tag in favor of buffering on shaka
  // bufferFull() {}

  // skipping error handling on video tag in favor of error on shaka
  error(event) { Log.error('an error was raised by the video tag', event, this.el.error)}

  // shouldn't we be open to 4k 8k ... something like isDefinitionInUse("HD" || VideoDefinition.V4K)
  isHighDefinitionInUse() { return !!this.highDefinition }

  // I think we should enforce PlaybackType.LIVE and VOD (maybe) I documented it wront as it was for name
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

    this._player = new shaka.player.Player(this.el)
    this._player.addEventListener('bufferingStart', this._bufferingHandler.bind(this))
    this._player.addEventListener('bufferingEnd', this._bufferingFullHandler.bind(this))
    this._player.addEventListener('error', this._error.bind(this))
    this._player.addEventListener('adaptation', this._onAdaptation.bind(this));

    var shakaLoaded = this._player.load(new shaka.player.DashVideoSource(this.options.src))

    shakaLoaded.then(this._loaded.bind(this)).catch(this._setupError.bind(this))
  }

  _loaded() {
    this._ready()

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
    console.log('error')
    Log.error('an error was raised by shaka player', error.detail)
    this.trigger(Events.PLAYBACK_ERROR, error.detail, this.name)
  }

  _onAdaptation(event) {
    console.log('adaptation', event)
    if (!!event.size) return

      Log.debug('an adaptation happened: ', event)
      this.highDefinition = (event.size.height >= 720)
      // define expected object from this event
      this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition)
      // define expected object from this event
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

