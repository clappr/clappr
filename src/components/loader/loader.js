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
var HTML5VideoPlaybackPlugin = require('../../playbacks/html5_video');
var FlashVideoPlaybackPlugin = require('../../playbacks/flash_vod');
var HTML5AudioPlaybackPlugin = require('../../playbacks/html5_audio');
var HLSVideoPlaybackPlugin = require('../../playbacks/hls');

/* Container Plugins */
var SpinnerThreeBouncePlugin = require('../../plugins/spinner_three_bounce');
var StatsPlugin = require('../../plugins/stats');
var WaterMarkPlugin = require('../../plugins/watermark');
var PosterPlugin = require('../../plugins/poster');

class Loader extends BaseObject {
  get displayPlugins() {
    return {};
  }

  constructor(options) {
    super(options);
    this.options = options
    this.playbackPlugins = [FlashVideoPlaybackPlugin, HTML5VideoPlaybackPlugin, HTML5AudioPlaybackPlugin, HLSVideoPlaybackPlugin]
    this.containerPlugins = [SpinnerThreeBouncePlugin, WaterMarkPlugin, PosterPlugin, StatsPlugin]
    this.globalPlugins = []
    if (this.options.displayPlugins && this.displayPlugins[this.options.displayType]) {
      this.globalPlugins.push(this.displayPlugins[this.options.displayType])
    }
    this.addExternalPlugins(options.plugins || [])
  }

  addExternalPlugins(plugins) {
    if(plugins.playback) {
      this.playbackPlugins = plugins.playback.concat(this.playbackPlugins)
    }
    if(plugins.container) {
      this.containerPlugins = plugins.container.concat(this.containerPlugins)
    }
    if(plugins.core) {
      this.globalPlugins = plugins.core.concat(this.globalPlugins)
    }
  }

  getPlugin(name) {
    var allPlugins = _.union(this.containerPlugins, this.playbackPlugins, this.globalPlugins)
    return _.find(allPlugins, function(plugin) { return plugin.prototype.name === name })
  }
}

module.exports = Loader;
