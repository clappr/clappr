package
{
  import flash.external.ExternalInterface;
  import flash.display.*;
  import flash.events.*;
  import flash.geom.Rectangle;
  import flash.media.StageVideoAvailability;
  import flash.media.StageVideo;
  import flash.media.SoundTransform;
  import flash.media.Video;
  import flash.net.NetConnection;
  import flash.net.NetStream;
  import flash.system.Security;
  import flash.utils.Timer;
  import flash.utils.setTimeout;

  public class Player extends MovieClip {
    private var _video:Video;
    private var _stageVideo:StageVideo;
    private var _ns:NetStream;
    private var _nc:NetConnection;
    private var totalTime:Number;
    private var playbackId:String;
    private var playbackState:String;
    private var videoVolumeTransform:SoundTransform;
    private var isOnStageVideo:Boolean = false;
    private var heartbeat:Timer = new Timer(500);
    private var source:String;

    public function Player() {
      Security.allowDomain('*');
      Security.allowInsecureDomain('*');
      playbackId = LoaderInfo(this.root.loaderInfo).parameters.playbackId;
      playbackState = "IDLE";
      _video = new Video();
      setupCallbacks();
      setupStage();
    }
    private function flashReady(): void {
      _triggerEvent('flashready');
    }
    private function onConnectionStatus(e:NetStatusEvent):void {
      if (e.info.code == "NetConnection.Connect.Success"){
        setupNetStream();
      }
    }
    private function setupNetStream():void {
      videoVolumeTransform = new SoundTransform();
      videoVolumeTransform.volume = 1;
      createNetStream();
      _stageVideo.attachNetStream(_ns);
      _ns.play(source);
    }
    private function createNetStream():void {
      _ns = new NetStream(_nc);
      _ns.client = this;
      _ns.soundTransform = videoVolumeTransform;
      _ns.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
      _ns.bufferTime = 10;
      _ns.inBufferSeek = true;
      _ns.maxPauseBufferTime = 3600;
      _ns.backBufferTime = 3600;
    }
    private function setupStage():void {
      stage.scaleMode = StageScaleMode.NO_SCALE;
      stage.align = StageAlign.TOP_LEFT;
      stage.fullScreenSourceRect = new Rectangle(0, 0, stage.stageWidth, stage.stageHeight);
      stage.displayState = StageDisplayState.NORMAL;
      stage.addEventListener(StageVideoAvailabilityEvent.STAGE_VIDEO_AVAILABILITY, _onStageVideoAvailability);
      stage.addEventListener(Event.RESIZE, _onResize);
    }
    private function setupNetConnection():void {
      _nc = new NetConnection();
      _nc.client = this;
      _nc.addEventListener(AsyncErrorEvent.ASYNC_ERROR, asyncErrorHandler);
      _nc.addEventListener(NetStatusEvent.NET_STATUS, onConnectionStatus);
      _nc.connect(null);
    }
    private function setupCallbacks():void {
      ExternalInterface.addCallback("setVideoSize", setVideoSize);
      ExternalInterface.addCallback("playerPlay", playerPlay);
      ExternalInterface.addCallback("playerPause", playerPause);
      ExternalInterface.addCallback("playerStop", playerStop);
      ExternalInterface.addCallback("playerSeek", playerSeek);
      ExternalInterface.addCallback("playerVolume", playerVolume);
      ExternalInterface.addCallback("playerResume", playerResume);
      ExternalInterface.addCallback("getState", getState);
      ExternalInterface.addCallback("getPosition", getPosition);
      ExternalInterface.addCallback("getDuration", getDuration);
      ExternalInterface.addCallback("getBytesLoaded", getBytesLoaded);
      ExternalInterface.addCallback("getBytesTotal", getBytesTotal);
    }
    private function getBytesTotal():Number {
      return _ns.bytesTotal;
    }
    private function getBytesLoaded():Number {
      return _ns.bytesLoaded;
    }
    private function netStatusHandler(event:NetStatusEvent):void {
      if (event.info.code === "NetStream.Buffer.Full") {
        playbackState = "PLAYING";
        _ns.bufferTime = 15;
      } else if (isBuffering(event.info.code)) {
        playbackState = "PLAYING_BUFFERING";
      } else if (event.info.code == "NetStream.Video.DimensionChange") {
        setVideoSize(stage.stageWidth, stage.stageHeight);
      } else if (event.info.code == "NetStream.Play.Stop") {
        playbackState = "ENDED";
        heartbeat.stop();
      } else if (event.info.code == "NetStream.Buffer.Empty") {
        _ns.bufferTime = 5;
      }
      _triggerEvent('statechanged');
    }
    private function isBuffering(code:String):Boolean {
      return Boolean(code == "NetStream.Buffer.Empty" && playbackState != "ENDED" ||
                     code == "NetStream.SeekStart.Notify" ||
                     code == "NetStream.Play.Start");
    }
    private function _onResize(event:Event):void {
      setVideoSize(stage.stageWidth, stage.stageHeight);
    }
    private function onHeartbeat( event:TimerEvent ):void {
      _triggerEvent('progress');
      _triggerEvent('timeupdate');
    }
    private function playerPlay(url:String):void {
      source = url;
      setupNetConnection();
      heartbeat.addEventListener( TimerEvent.TIMER, onHeartbeat );
    }
    private function playerPause():void {
      _ns.pause();
      if (_ns.bytesLoaded == _ns.bytesTotal) {
        heartbeat.stop();
      }
      playbackState = "PAUSED";
    }
    private function playerStop():void {
      _ns.pause();
      _ns.seek(0);
      heartbeat.stop();
      playbackState = "IDLE";
    }
    private function playerSeek(position:Number):void {
      _ns.seek(position);
    }
    private function playerResume():void {
      playbackState = "PLAYING";
      _ns.resume();
      heartbeat.start();
    }
    private function playerVolume(level:Number):void {
      videoVolumeTransform.volume = level/100;
      _ns.soundTransform = videoVolumeTransform;
    }
    private function getState():String {
      return playbackState;
    }
    private function getPosition():Number {
      return _ns.time;
    }
    private function getDuration():Number {
      return totalTime;
    }
    private function setVideoSize(width:Number, height:Number):void {
      stage.fullScreenSourceRect = new Rectangle(0, 0, width, height);
      var rect:Rectangle = new Rectangle(0,0, width, height);// resizeRectangle(stage.stageWidth, stage.stageHeight, width, height);
      _video.width = rect.width;
      _video.height = rect.height;
      _video.x = rect.x;
      _video.y = rect.y;
      if (isOnStageVideo) {
        _stageVideo.viewPort = rect;
      }
    }
    public static function resizeRectangle(videoWidth : Number, videoHeight : Number, containerWidth : Number, containerHeight : Number) : Rectangle {
      var rect : Rectangle = new Rectangle();
      var xscale : Number = containerWidth / videoWidth;
      var yscale : Number = containerHeight / videoHeight;
      if (xscale >= yscale) {
          rect.width = Math.min(videoWidth * yscale, containerWidth);
          rect.height = videoHeight * yscale;
      } else {
          rect.width = Math.min(videoWidth * xscale, containerWidth);
          rect.height = videoHeight * xscale;
      }
      rect.width = Math.ceil(rect.width);
      rect.height = Math.ceil(rect.height);
      rect.x = Math.round((containerWidth - rect.width) / 2);
      rect.y = Math.round((containerHeight - rect.height) / 2);
      return rect;
    }
    private function _triggerEvent(name: String):void {
      ExternalInterface.call('Clappr.Mediator.trigger("' + playbackId + ':' + name +'")');
    }
    private function _enableStageVideo():void {
      if (_stageVideo == null) {
        _stageVideo = stage.stageVideos[0];
        _stageVideo.viewPort = new Rectangle(0, 0, stage.stageWidth, stage.stageHeight);
      }
      if (_video.parent) {
          removeChild(_video);
      }
      _stageVideo.attachNetStream(_ns);
    }
    private function _disableStageVideo():void {
      _video.attachNetStream(_ns);
      _video.smoothing = true;
      addChild(_video);
    }
    private function _onStageVideoAvailability(evt:StageVideoAvailabilityEvent):void {
      if (evt.availability && stage.stageVideos.length > 0) {
        _enableStageVideo();
        isOnStageVideo = true;
      } else {
        _disableStageVideo();
      }
      flashReady();
    }
    public function onMetaData(info:Object):void {
      totalTime = info.duration;
      _triggerEvent('timeupdate');
      receivedMeta(info);
      heartbeat.start();
    }
    public function receivedMeta(data:Object):void {
        setVideoSize(stage.stageWidth, stage.stageHeight);
    }
    public function onBWDone(...rest):void {
        setVideoSize(stage.stageWidth, stage.stageHeight);
    }
    public function asyncErrorHandler(event:AsyncErrorEvent):void {
    }
    public function onFCSubscribe(info:Object):void {
    }
    public function cuePointHandler(infoObject:Object):void {
    }
    public function onFI(infoObject:Object):void {
    }
	public function onPlayStatus(infoObject:Object):void {
	}
  }
}
