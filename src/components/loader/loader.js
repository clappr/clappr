// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import BaseObject from 'base/base_object'
import PlayerInfo from 'components/player_info'
import uniq from 'lodash.uniq'

/* Playback Plugins */
import HTML5VideoPlayback from 'playbacks/html5_video'
import FlashVideoPlayback from 'playbacks/flash'
import HTML5AudioPlayback from 'playbacks/html5_audio'
import FlasHLSVideoPlayback from 'playbacks/flashls'
import HTMLImgPlayback from 'playbacks/html_img'
import NoOp from 'playbacks/no_op'

/* Container Plugins */
import SpinnerThreeBouncePlugin from 'plugins/spinner_three_bounce'
import StatsPlugin from 'plugins/stats'
import WaterMarkPlugin from 'plugins/watermark'
import PosterPlugin from 'plugins/poster'
import GoogleAnalyticsPlugin from 'plugins/google_analytics'
import ClickToPausePlugin from 'plugins/click_to_pause'
import Chromecast from 'plugins/chromecast'

/* Core Plugins */
import DVRControls from 'plugins/dvr_controls'
import Favicon from 'plugins/favicon'

/**
 * It keeps a list of the default plugins (playback, container, core) and it merges external plugins with its internals.
 * @class Loader
 * @constructor
 * @extends BaseObject
 * @module components
 */
export default class Loader extends BaseObject {
  /**
   * it builds the loader
   * @method constructor
   * @param {Object} externalPlugins the external plugins
   * @param {Number} playerId you can embed multiple instances of clappr, therefore this is the unique id of each one.
   */
  constructor(externalPlugins, playerId) {
    super()
    this.playerId = playerId
    this.playbackPlugins = [HTML5AudioPlayback, HTML5VideoPlayback, FlashVideoPlayback, FlasHLSVideoPlayback, HTMLImgPlayback, NoOp]
    this.containerPlugins = [SpinnerThreeBouncePlugin, WaterMarkPlugin, PosterPlugin, StatsPlugin, GoogleAnalyticsPlugin, ClickToPausePlugin]
    this.corePlugins = [DVRControls, Favicon, Chromecast]
    if (externalPlugins) {
      this.addExternalPlugins(externalPlugins)
    }
  }

  addExternalPlugins(plugins) {
    var pluginName = function(plugin) { return plugin.prototype.name }
    if (plugins.playback) { this.playbackPlugins = uniq(plugins.playback.concat(this.playbackPlugins), pluginName) }
    if (plugins.container) { this.containerPlugins = uniq(plugins.container.concat(this.containerPlugins), pluginName) }
    if (plugins.core) { this.corePlugins = uniq(plugins.core.concat(this.corePlugins), pluginName) }
    PlayerInfo.getInstance(this.playerId).playbackPlugins = this.playbackPlugins
  }

  getPlugin(name) {
    var allPlugins = this.containerPlugins.concat(this.playbackPlugins).concat(this.corePlugins)
    return allPlugins.find((plugin) => { return plugin.prototype.name === name })
  }
}
