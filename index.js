const {HTML5Video, Log, Events} = window.Clappr;
const shaka = window.shaka;

const SEND_STATS_AT = 30 * 1000;
const AUTO = -1;

class DashShakaPlayback extends HTML5Video {

  static get Events() {
    return {
      SHAKA_READY: 'shaka:ready'
    };
  }

  static canPlay(resource, mimeType = '') {
    shaka.polyfill.installAll();
    var browserSupported = shaka.Player.isBrowserSupported();
    var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || [];
    return browserSupported && (('mpd' === resourceParts[1]) || mimeType.indexOf('application/dash+xml') > -1);
  }

  get name() {
    return 'DashShakaPlayback'
  }

  get shakaVersion() {
    return shaka.player.Player.version
  }

  get levels() { 
    return this._levels 
  }

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

  get currentLevel() { 
    return this._currentLevelId || AUTO 
  }

  constructor(options) {
    super(options)
    this._levels = []
    options.autoPlay && this.play()
  }

  play() {
    if (!this._player) {
        this._setup();
    }

    if (!this.isReady) {
      this.once(DashShakaPlayback.Events.SHAKA_READY, this.play)
      return
    }

    this._src = this.el.src;
    super.play()
  }

  // skipping setup `setupSrc` on tag video
  setupSrc() {}

  // skipping ready event on video tag in favor of ready on shaka
  _ready() {}

  get isReady() {
    return this._isShakaReadyState
  }

  // skipping error handling on video tag in favor of error on shaka
  error(event) {
    Log.error('an error was raised by the video tag', event, this.el.error)
  }

  isHighDefinitionInUse() { 
    return !!this.highDefinition 
  }

  stop() {
    clearInterval(this.sendStatsId)
    this._sendStats()

    this._player.unload().then(() => {
        super.stop()
        this._player = null
        this._isShakaReadyState = false
    }).catch(() => { 
      Log.error('shaka could not be unloaded') 
    });
  }

  get textTracks() { 
    return this._player && this._player.getTracks().filter((t) => t.type === 'text');
  }
  
  get audioTracks() { 
    return this._player && this._player.getTracks().filter((t) => t.type === 'audio');
  }
  
  get videoTracks() {
    return this._player && this._player.getTracks().filter((t) => t.type === 'video');
  }

  getPlaybackType() {
    return (this._player && this._player.isLive() ? 'live' : 'vod') || '';
  }

  selectTrack(track) {
    this._player.selectTrack(track);
    this._onAdaptation();
  }

  destroy() {
    clearInterval(this.sendStatsId);

    if (this._player) {
      this._destroy()
    } else {
      this._player.destroy().
        then(() => this._destroy()).
        catch(() => {
          this._destroy()
          Log.error('shaka could not be destroyed');
        })
    }
  }


  _setup() {
    this._isShakaReadyState = false;
    this._player = this._createPlayer();
    this._options.shakaConfiguration && this._player.configure(this._options.shakaConfiguration);
    this._options.shakaOnBeforeLoad && this._options.shakaOnBeforeLoad(this._player);

    var playerLoaded = this._player.load(this._options.src);
    playerLoaded.then(() => this._loaded())
      .catch((e) => this._setupError(e));
  }

  _createPlayer() {
    var player = new shaka.Player(this.el);
    player.addEventListener('error', this._error);
    player.addEventListener('adaptation', this._onAdaptation);
    player.addEventListener('buffering', this._onBuffering);
    return player
  }

  _onBuffering(e) {
    var event = e.buffering ? Events.PLAYBACK_BUFFERING : Events.PLAYBACK_BUFFERFULL;
    this.trigger(event);
  }

  _loaded() {
    this._isShakaReadyState = true;
    this.trigger(DashShakaPlayback.Events.SHAKA_READY);
    this._shakaReady();
    this._startToSendStats();
    this._fillLevels();
  }

  _fillLevels(){
    if (this._levels.length === 0) {
      this._levels = this.videoTracks.map((videoTrack) => { return {id: videoTrack.id, label: `${videoTrack.height}p`}}).reverse();
      this.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, this.levels);
    }
  }

  _startToSendStats() {
    this.sendStatsId = setInterval(() => this._sendStats(), SEND_STATS_AT);
  }

  _sendStats() {
    this.trigger(Events.PLAYBACK_STATS_ADD, this._player.getStats());
  }

  _setupError(e) { 
    this._error('error', {detail: e.detail}); 
  }

  _onError(event) {
    Log.error('Shaka error event:', event);
    this.trigger(Events.PLAYBACK_ERROR, event.detail, this.name);
  }

  _onAdaptation() {
    var activeVideo = this.videoTracks.filter((t) => t.active === true)[0];

    this._fillLevels()

    Log.debug('an adaptation has happened:', activeVideo)
    this.highDefinition = (activeVideo.height >= 720)
    this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition)
    this.trigger(Events.PLAYBACK_BITRATE, {
      bandwidth: activeVideo.bandwidth,
      width: activeVideo.width,
      height: activeVideo.height,
      level: activeVideo.id
    });
  }

  _destroy() {
    super.destroy();
    this._isShakaReadyState = false;
    Log.debug('shaka was destroyed');
  }

  _shakaReady() {
    super._ready();
  }
};

export default DashShakaPlayback;
