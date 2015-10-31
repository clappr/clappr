import {HTML5Video, Log, Events} from 'clappr'
import shaka from 'shaka-player'

export default class ClapprDashShaka extends HTML5Video {

  constructor(options) {
    super(options)
    this._setup()
  }

  // skipping ready event on video tag in favor of ready on shaka
  ready() {}

  // skipping buffering handling on video tag in favor of buffering on shaka
  bufferFull() {}

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
      then(this._destroy).
      catch(() => Log.error('shaka could not be destroyed'))
  }

  version() {return shaka.player.Player.version}

  _setup() {
    var frequencyToSendStats = 60 * 1000

    this._player = new shaka.player.Player(this.el)
    this._player.addEventListener('bufferingStart', this._bufferingHandler)
    this._player.addEventListener('bufferingEnd', this._bufferingFullHandler)
    this._player.addEventListener('error', this._error)
    this._player.addEventListener('adaptation', this._onAdaptation);

    var shakaLoaded = this._player.load(new shaka.player.DashVideoSource(this.options.src))

    shakaLoaded.then(this._loaded).catch(this._setupError)
  }

  _loaded() {
    this._ready()

    this.sendStats = setInterval(() => {
      this.trigger(Events.PLAYBACK_STATS_ADD, this._player.getStats())
    }, frequencyToSendStats)
  }

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

      Log.debug('an adaptation happened: ', event)
      this.highDefinition = (event.size.height >= 720)
      // define expected object from this event
      this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition)
      // define expected object from this event
      this.trigger(Events.PLAYBACK_BITRATE, {bitrate: event.size.height})
  }

  _destroy() {
    super.destroy()
    Log.debug('shaka was destroyed')
  }

  _ready() { super.ready() }
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

