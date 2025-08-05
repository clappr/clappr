// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import ClickToPause from './plugins/click_to_pause'
import ClosedCaptions from './plugins/closed_captions'
import DVRControls from './plugins/dvr_controls'
import EndVideo from './plugins/end_video'
import ErrorScreen from './plugins/error_screen'
import Favicon from './plugins/favicon'
import GoogleAnalytics from './plugins/google_analytics'
import MediaControl from './plugins/media_control'
import Poster from './plugins/poster'
import SeekTime from './plugins/seek_time'
import SpinnerThreeBounce from './plugins/spinner_three_bounce'
import Stats from './plugins/stats'
import WaterMark from './plugins/watermark'

import Vendor from './vendor'

const version = VERSION

const Plugins = {
  ClickToPause,
  ClosedCaptions,
  DVRControls,
  EndVideo,
  ErrorScreen,
  Favicon,
  GoogleAnalytics,
  MediaControl,
  Poster,
  SeekTime,
  SpinnerThreeBounce,
  Stats,
  WaterMark
}

export {
  ClickToPause,
  ClosedCaptions,
  DVRControls,
  EndVideo,
  ErrorScreen,
  Favicon,
  GoogleAnalytics,
  MediaControl,
  Poster,
  SeekTime,
  SpinnerThreeBounce,
  Stats,
  WaterMark,
  Vendor,
  Plugins,
  version
}
