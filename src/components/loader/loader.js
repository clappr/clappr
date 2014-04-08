// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * Loader is responsible for parse embed parameters and decide which plugins should
 * be used in order to satisfy the playback.
 */

var BaseObject = require('../../base/base_object');

var HTML5VideoPlaybackPlugin = require('../../plugins/html5_video_playback');
var FlashVideoPlaybackPlugin = require('../../plugins/flash_playback');
var HTML5AudioPlaybackPlugin = require('../../plugins/html5_audio_playback');
var HLSVideoPlaybackPlugin = require('../../plugins/hls_playback');
var SpinnerThreeBouncePlugin = require('../../plugins/spinner_three_bounce');
var StatsPlugin = require('../../plugins/stats');
var WaterMarkPlugin = require('../../plugins/watermark');
var PosterPlugin = require('../../plugins/poster');
var PipPlugin = require('../../plugins/pip');

var Loader = BaseObject.extend({
  initialize: function(params) {
    this.params = params;
    this.playbackPlugins = [FlashVideoPlaybackPlugin, HTML5VideoPlaybackPlugin, HTML5AudioPlaybackPlugin, HLSVideoPlaybackPlugin];
    this.containerPlugins = [SpinnerThreeBouncePlugin, WaterMarkPlugin, PosterPlugin, StatsPlugin];
    this.globalPlugins = [PipPlugin];
  },
});

module.exports = Loader;
