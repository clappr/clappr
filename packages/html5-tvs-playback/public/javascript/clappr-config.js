/* eslint-disable */
var mp4Resource = 'http://clappr.io/highline.mp4';
var hlsResource = 'https://playertest.longtailvideo.com/adaptive/elephants_dream_v4/index.m3u8';
var mssResource = 'http://test.playready.microsoft.com/smoothstreaming/SSWSS720H264/SuperSpeedway_720.ism/Manifest';
var mssResourceWithPlayReady = 'http://playready.directtaps.net/smoothstreaming/SSWSS720H264PR/SuperSpeedway_720.ism/Manifest';

Clappr.Log.setLevel(Clappr.Log.LEVEL_INFO);

var onReadyCallback = function() {
  var _hideTimeout;

  this.core.listenTo(this.core, Clappr.Events.Custom.CORE_SMART_TV_KEY_PRESSED, function(_, data) {
    Clappr.Log.info('keyName', data.keyName);
    clearTimeout(_hideTimeout);
    document.querySelector('.snackbar').innerText = 'The key pressed has the code ' + data.keyEvent.keyCode + ' and is mapped to the "' + data.keyName + '" value.';
    document.querySelector('.snackbar').className += ' show';
    _hideTimeout = setTimeout(function() { document.querySelector('.snackbar').className = 'snackbar' }, 3000);

    if (data.keyName === window.TVsKeyMappingPlugin.KeyNames.KEY_CODE_PLAY) player.core.activePlayback.play();
    if (data.keyName === window.TVsKeyMappingPlugin.KeyNames.KEY_CODE_PAUSE) player.core.activePlayback.pause();
    if (data.keyName === window.TVsKeyMappingPlugin.KeyNames.KEY_CODE_STOP) player.core.activePlayback.stop();
  });

  this.core.activePlayback.listenTo(this.core.activePlayback, Clappr.Events.PLAYBACK_BUFFERING, function() { document.querySelector('.loading-hint').className += ' show'; });
  this.core.activePlayback.listenTo(this.core.activePlayback, Clappr.Events.PLAYBACK_BUFFERFULL, function() { document.querySelector('.loading-hint').className = 'loading-hint'; });
};

var searchParams;
window.URLSearchParams && (searchParams = new window.URLSearchParams(window.location.search));

var player = new Clappr.Player({
  source: searchParams && searchParams.get('source') || hlsResource,
  height: searchParams && searchParams.get('height') || '100%',
  width: searchParams && searchParams.get('width') || '100%',
  tvsKeyMapping: { deviceToMap: 'panasonic' },
  playback: { controls: true },
  // html5TvsPlayback: { drm: {
  //   fullChallenge: true,
  //   xmlLicenceAcquisition: '<WRMHEADER xmlns="http://schemas.microsoft.com/DRM/2007/03/PlayReadyHeader" version="4.0.0.0"><DATA><PROTECTINFO><KEYLEN>16</KEYLEN><ALGID>AESCTR</ALGID></PROTECTINFO><KID>AAAAEAAQABAQABAAAAAAAQ==</KID><CHECKSUM>5TzIYQ2hrOY=</CHECKSUM><LA_URL>http://test.playready.microsoft.com/service/rightsmanager.asmx</LA_URL></DATA></WRMHEADER>',
  //   licenseServerURL: 'http://test.playready.microsoft.com/service/rightsmanager.asmx',
  // } },
  plugins: [window.TVsKeyMappingPlugin.Watcher, window.HTML5TVsPlayback],
  events: { onReady: onReadyCallback },
});

player.attachTo(document.body);
