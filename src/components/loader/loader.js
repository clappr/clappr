// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * Loader is responsible for parse embed parameters and decide which plugins should
 * be used in order to satisfy the playback.
 */

var BaseObject = require('../../base/base_object');
var _ = require('underscore');

/* Playback Plugins */
var HTML5VideoPlaybackPlugin = require('../../plugins/html5_video_playback');
var FlashVideoPlaybackPlugin = require('../../plugins/flash_playback');
var HTML5AudioPlaybackPlugin = require('../../plugins/html5_audio_playback');
var HLSVideoPlaybackPlugin = require('../../plugins/hls_playback');

/* Container Plugins */
var SpinnerThreeBouncePlugin = require('../../plugins/spinner_three_bounce');
var StatsPlugin = require('../../plugins/stats');
var WaterMarkPlugin = require('../../plugins/watermark');
var PosterPlugin = require('../../plugins/poster');

/* Player Plugins */
var PipPlugin = require('../../plugins/pip');
var Sequence = require('../../plugins/sequence');

var Loader = BaseObject.extend({
  displayPlugins: {
    'sequence': Sequence,
    'pip': PipPlugin
  },
  initialize: function(params) {
    this.params = params;
    this.playbackPlugins = [FlashVideoPlaybackPlugin, HTML5VideoPlaybackPlugin, HTML5AudioPlaybackPlugin, HLSVideoPlaybackPlugin];
    this.containerPlugins = [SpinnerThreeBouncePlugin, WaterMarkPlugin, PosterPlugin, StatsPlugin];
    this.globalPlugins = [this.displayPlugins[this.params.displayType]];
  },
  getPlugin: function(name) {
    return _.find(_.union(this.containerPlugins, this.playbackPlugins, this.globalPlugins), function(plugin) { return plugin.prototype.name === name });
  }
});

module.exports = Loader;
