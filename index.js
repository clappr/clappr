import {HTML5Video, Log, Events} from 'clappr'
import shaka from 'shaka-player'

const SEND_STATS_AT = 30 * 1000
const AUTO = -1

export default class DashShakaPlayback extends HTML5Video {
  get name() {return 'dash_shaka_playback'}

  get shakaVersion() {return shaka.player.Player.version}

  get levels() { return this._levels }

  set currentLevel(id) {
    this._currentLevelId = id
    var isAuto = this._currentLevelId === AUTO

    this._player.configure({abr: {enable: !isAuto}})
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_START)
    if (!isAuto) {
      this.selectTrack(this.videoTracks.filter((t) => t.id === this._currentLevelId)[0])
    }
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_END)
  }
  get currentLevel() { return this._currentLevelId || AUTO }

  constructor(options) {
    super(options)
    this.isReadyState = false
    this._levels = []
    options.autoPlay && this.play()
  }

  play() {
    !this._player && this._setup()

    if (!this.isReady) {
      this.once(Events.PLAYBACK_READY, this.play)
      return
    }
    super.play()
  }

  // skipping setup `setupSrc` on tag video
  setupSrc() {}

  // skipping ready event on video tag in favor of ready on shaka
  ready() {}

  get isReady() {return this.isReadyState}

  // skipping error handling on video tag in favor of error on shaka
  error(event) { Log.error('an error was raised by the video tag', event, this.el.error)}

  isHighDefinitionInUse() { return !!this.highDefinition }

  stop() {
    clearInterval(this.sendStatsId)
    this.trigger(Events.PLAYBACK_STOP, this.name)
    this._sendStats()

    this._player.unload().
      then(() => {
        this._player = null
        this.isReadyState = false
      }).
      catch(() => { Log.error('shaka could not be unloaded') })
  }

  get textTracks() {return this._player.getTracks().filter((t) => t.type === "text")}
  get audioTracks() {return this._player.getTracks().filter((t) => t.type === "audio")}
  get videoTracks() {return this._player.getTracks().filter((t) => t.type === "video")}
  getPlaybackType() {return this._player.isLive()?'live':'vod'}

  selectTrack(track) {
    this._player.selectTrack(track)
    this._onAdaptation()
  }

  destroy() {
    clearInterval(this.sendStatsId)

    this._player.destroy().
      then(() => this._destroy()).
      catch(() => {
        this._destroy()
        Log.error('shaka could not be destroyed')
      })
  }


  _setup() {
    this._player = this._createPlayer()
    this.options.shakaConfiguration && this._player.configure(this.options.shakaConfiguration)

    var playerLoaded = this._player.load(this.options.src)
    playerLoaded.then(() => this._loaded())
      .catch((e) => this._setupError(e))
  }

  _createPlayer() {
    var player = new shaka.Player(this.el)
    player.addEventListener('error', (type, shakaError) => this._error(type, shakaError))
    player.addEventListener('adaptation', () => this._onAdaptation())
    return player
  }

  _loaded() {
    this._ready()
    this._startToSendStats()
    this._fillLevels()
  }

  _fillLevels(){
    if (this._levels.length === 0) {
      this._levels = this.videoTracks.map((videoTrack) => { return {id: videoTrack.id, label: `${videoTrack.height}p`}}).reverse()
      this.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, this.levels)
    }
  }

  _startToSendStats() {
    this.sendStatsId = setInterval(() => this._sendStats(), SEND_STATS_AT)
  }

  _sendStats() {this.trigger(Events.PLAYBACK_STATS_ADD, this._player.getStats())}

  _setupError(e) { this._error('error', {detail: e.detail}) }

  _error(type, shakaError) {
    Log.error('an error was raised by shaka player', shakaError.detail)
    this.trigger(Events.PLAYBACK_ERROR, shakaError.detail, this.name)
  }

  _onAdaptation() {
    var activeVideo = this.videoTracks.filter((t) => t.active === true)[0]

    this._fillLevels()

    Log.debug('an adaptation has happened:', activeVideo)
    this.highDefinition = (activeVideo.height >= 720)
    this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition)
    this.trigger(Events.PLAYBACK_BITRATE, {
      bandwidth: activeVideo.bandwidth,
      width: activeVideo.width,
      height: activeVideo.height,
      level: activeVideo.id
    })
  }

  _destroy() {
    super.destroy()
    this.isReadyState = false
    Log.debug('shaka was destroyed')
  }

  _ready() {
    super.ready()
  }
}

DashShakaPlayback.canPlay = (resource, mimeType = '') => {
  shaka.polyfill.installAll()

  shaka.Player.support().then((support) => { Log.debug(`TODO: Clappr is sync -> #{support.supported}`) })

  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  return ('mpd' === resourceParts[1]) || mimeType.indexOf('application/dash+xml') > -1
}

