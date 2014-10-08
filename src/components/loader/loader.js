// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object');
var _ = require('underscore');
var PlayerInfo = require('../player_info')

/* Playback Plugins */
var HTML5VideoPlayback = require('../../playbacks/html5_video');
var FlashVideoPlayback = require('../../playbacks/flash');
var HTML5AudioPlayback = require('../../playbacks/html5_audio');
var HLSVideoPlayback = require('../../playbacks/hls');
var NoOp = require('../../playbacks/no_op');

/* Container Plugins */
var SpinnerThreeBouncePlugin = require('../../plugins/spinner_three_bounce');
var StatsPlugin = require('../../plugins/stats');
var WaterMarkPlugin = require('../../plugins/watermark');
var PosterPlugin = require('../../plugins/poster');

/* Core Plugins */
var BackgroundButton = require('../../plugins/background_button');

class Loader extends BaseObject {
  constructor(externalPlugins) {
    super()
    this.playerInfo = PlayerInfo.getInstance()
    this.playbackPlugins = [HLSVideoPlayback, FlashVideoPlayback, HTML5VideoPlayback, HTML5AudioPlayback, NoOp]
    this.containerPlugins = [SpinnerThreeBouncePlugin, WaterMarkPlugin, PosterPlugin, StatsPlugin]
    this.corePlugins = [BackgroundButton]
    if (externalPlugins) {
      this.addExternalPlugins(externalPlugins)
    }
  }

  addExternalPlugins(plugins) {
    var pluginName = function(plugin) { return plugin.prototype.name }
    if (plugins.playback) { this.playbackPlugins = _.uniq(plugins.playback.concat(this.playbackPlugins), pluginName) }
    if (plugins.container) { this.containerPlugins = _.uniq(plugins.container.concat(this.containerPlugins), pluginName) }
    if (plugins.core) { this.corePlugins = _.uniq(plugins.core.concat(this.corePlugins), pluginName) }
    this.playerInfo.playbackPlugins = this.playbackPlugins
  }

  getPlugin(name) {
    var allPlugins = _.union(this.containerPlugins, this.playbackPlugins, this.corePlugins)
    return _.find(allPlugins, function(plugin) { return plugin.prototype.name === name })
  }
}

module.exports = Loader;
