
import BaseFlashPlayback from './playbacks/base_flash_playback'
import Flash from './playbacks/flash'
import FlasHLS from './playbacks/flashls'
import HLS from './playbacks/hls'
import HTML5Audio from './playbacks/html5_audio'
import HTMLImg from './playbacks/html_img'

/* Core Plugins */
import DVRControls from './plugins/dvr_controls'
import Favicon from './plugins/favicon'
import SeekTime from './plugins/seek_time'
import SourcesPlugin from './plugins/sources'
import EndVideo from './plugins/end_video'
import Strings from './plugins/strings'

/* Container Plugins */
import StatsPlugin from './plugins/stats'
import WaterMarkPlugin from './plugins/watermark'
import GoogleAnalyticsPlugin from './plugins/google_analytics'
import ClickToPausePlugin from './plugins/click_to_pause'

export {
  // playbacks
  BaseFlashPlayback,
  Flash,
  FlasHLS,
  HLS,
  HTML5Audio,
  HTMLImg,
  // core plugins
  DVRControls,
  Favicon,
  SeekTime,
  SourcesPlugin,
  EndVideo,
  Strings,
  // container plugins
  StatsPlugin,
  WaterMarkPlugin,
  GoogleAnalyticsPlugin,
  ClickToPausePlugin
}
