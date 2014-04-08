package
{
  import flash.external.ExternalInterface;
  import flash.display.*;
	import flash.geom.Rectangle;
	import flash.events.StageVideoAvailabilityEvent;
	import flash.media.StageVideoAvailability;
	import flash.media.StageVideo;
	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;

	public class Player extends MovieClip {
		private var _video:Video;
		private var _stageVideo:StageVideo;
		private var _ns:NetStream;
		private var _nc:NetConnection;

		public function Player() {
			_nc = new NetConnection();
			_nc.connect(null);
			_ns = new NetStream(_nc);
			_ns.client = this;
			_video = new Video();
      stage.scaleMode = StageScaleMode.NO_SCALE;
      stage.align = StageAlign.TOP_LEFT;
      stage.fullScreenSourceRect = new Rectangle(0, 0, stage.stageWidth, stage.stageHeight);
      stage.displayState = StageDisplayState.NORMAL;
			stage.addEventListener(StageVideoAvailabilityEvent.STAGE_VIDEO_AVAILABILITY, _onStageVideoAvailability);
      setupCallbacks();
		}

    private function setupCallbacks():void {
      ExternalInterface.addCallback("playerPlay", playerPlay);
    }

    private function playerPlay(url:String):void {
      _ns.play(url);
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
			addChild(_video);
		}

		private function _onStageVideoAvailability(evt:StageVideoAvailabilityEvent):void {
			if (evt.availability) {
				_enableStageVideo();
			} else {
				_disableStageVideo();
      }
		}
	}
}
