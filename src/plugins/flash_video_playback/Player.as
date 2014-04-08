package
{
  import flash.external.ExternalInterface;
	import flash.display.MovieClip;
	import flash.geom.Rectangle;
	import flash.events.StageVideoAvailabilityEvent;
	import flash.media.StageVideoAvailability;
	import flash.media.StageVideo;
	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;

	public class Player extends MovieClip {
		private const _videoURL:String = "2698715-web480.mp4";
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
			stage.addEventListener(StageVideoAvailabilityEvent.STAGE_VIDEO_AVAILABILITY, _onStageVideoAvailability);
      setupCallbacks();
		}

    private function setupCallbacks():void {
      ExternalInterface.addCallback("playerPlay", playerPlay);
    }

    private function playerPlay():void {
      _ns.play(_videoURL);
    }

		private function _enableStageVideo():void {
			if (_stageVideo == null) {
				_stageVideo = stage.stageVideos[0];
				_stageVideo.viewPort = new Rectangle(0, 0, 320, 240);
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
