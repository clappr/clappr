// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/* Playback Plugins */
import HTML5VideoPlayback from 'playbacks/html5_video'
import FlashVideoPlayback from 'playbacks/flash'
import HTML5AudioPlayback from 'playbacks/html5_audio'
import FlasHLSVideoPlayback from 'playbacks/flashls'
import HLSVideoPlayback from 'playbacks/hls'
import HTMLImgPlayback from 'playbacks/html_img'
import NoOp from 'playbacks/no_op'

/* Container Plugins */
import SpinnerThreeBouncePlugin from 'plugins/spinner_three_bounce'
import StatsPlugin from 'plugins/stats'
import WaterMarkPlugin from 'plugins/watermark'
import PosterPlugin from 'plugins/poster'
import GoogleAnalyticsPlugin from 'plugins/google_analytics'
import ClickToPausePlugin from 'plugins/click_to_pause'

/* Core Plugins */
import DVRControls from 'plugins/dvr_controls'
import Favicon from 'plugins/favicon'
import SeekTime from 'plugins/seek_time'
import SourcesPlugin from 'plugins/sources'

const PLUGIN_TYPES = ['playback', 'container', 'core']

const PLUGIN_CLASSES_ORDERED = {
   playback: [
      HTML5VideoPlayback,
      HTML5AudioPlayback,
      FlashVideoPlayback,
      HLSVideoPlayback,
      FlasHLSVideoPlayback,
      HTMLImgPlayback,
      NoOp
   ],
   container: [
      SpinnerThreeBouncePlugin,
      WaterMarkPlugin,
      PosterPlugin,
      StatsPlugin,
      GoogleAnalyticsPlugin,
      ClickToPausePlugin
   ],
   core: [
      DVRControls,
      Favicon,
      SeekTime,
      SourcesPlugin
   ]
}

let getPluginName = function(pluginClass) { return pluginClass.prototype.name }

var defaultPlugins = {}

PLUGIN_TYPES.forEach((pluginType) => {
   defaultPlugins[pluginType] = PLUGIN_CLASSES_ORDERED[pluginType].map(getPluginName)
})

export {PLUGIN_TYPES, PLUGIN_CLASSES_ORDERED, defaultPlugins, getPluginName}
