// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import MediaControl from './plugins/media_control'
import ClickToPausePlugin from './plugins/click_to_pause'
import DVRControls from './plugins/dvr_controls'
import ErrorScreen from './plugins/error_screen'
import Favicon from './plugins/favicon'
import Poster from './plugins/poster'
import SpinnerThreeBouncePlugin from './plugins/spinner_three_bounce'
import WaterMarkPlugin from './plugins/watermark'
import Vendor from './vendor'

const version = VERSION

export default {
  Plugins: {
    MediaControl,
    ClickToPausePlugin,
    DVRControls,
    ErrorScreen,
    Favicon,
    Poster,
    SpinnerThreeBouncePlugin,
    WaterMarkPlugin,
  },
  Vendor,
  version,
}
