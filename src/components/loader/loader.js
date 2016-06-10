// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import BaseObject from 'base/base_object'
import PlayerInfo from 'components/player_info'
import uniqBy from 'lodash.uniqby'

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
import EndVideo from 'plugins/end_video'

/**
 * It keeps a list of the default plugins (playback, container, core) and it merges external plugins with its internals.
 * @class Loader
 * @constructor
 * @extends BaseObject
 * @module components
 */
export default class Loader extends BaseObject {
  /**
   * builds the loader
   * @method constructor
   * @param {Object} externalPlugins the external plugins
   * @param {Number} playerId you can embed multiple instances of clappr, therefore this is the unique id of each one.
   */
  constructor(externalPlugins, playerId) {
    super()
    this.playerId = playerId
    this.playbackPlugins = [HLSVideoPlayback, HTML5VideoPlayback, HTML5AudioPlayback, FlashVideoPlayback, FlasHLSVideoPlayback, HTMLImgPlayback, NoOp]
    this.containerPlugins = [SpinnerThreeBouncePlugin, WaterMarkPlugin, PosterPlugin, StatsPlugin, GoogleAnalyticsPlugin, ClickToPausePlugin]
    this.corePlugins = [DVRControls, Favicon, SeekTime, SourcesPlugin, EndVideo]
    if (externalPlugins) {
      if (!Array.isArray(externalPlugins)) {
        this.validateExternalPluginsType(externalPlugins)
      }
      this.addExternalPlugins(externalPlugins)
    }
  }

  /**
   * groups by type the external plugins that were passed through `options.plugins` it they're on a flat array
   * @method addExternalPlugins
   * @private
   * @param {Object} an config object or an array of plugins
   * @return {Object} plugins the config object with the plugins separated by type
   */
  groupPluginsByType(plugins) {
    if (Array.isArray(plugins)) {
      plugins = plugins.reduce(function(memo, plugin) {
        memo[plugin.type] || (memo[plugin.type] = [])
        memo[plugin.type].push(plugin)
        return memo
      }, {})
    }
    return plugins
  }

  /**
   * adds all the external plugins that were passed through `options.plugins`
   * @method addExternalPlugins
   * @private
   * @param {Object} plugins the config object with all plugins
   */
  addExternalPlugins(plugins) {
    plugins = this.groupPluginsByType(plugins)
    var pluginName = function(plugin) { return plugin.prototype.name }
    if (plugins.playback) { this.playbackPlugins = uniqBy(plugins.playback.concat(this.playbackPlugins), pluginName) }
    if (plugins.container) { this.containerPlugins = uniqBy(plugins.container.concat(this.containerPlugins), pluginName) }
    if (plugins.core) { this.corePlugins = uniqBy(plugins.core.concat(this.corePlugins), pluginName) }
    PlayerInfo.getInstance(this.playerId).playbackPlugins = this.playbackPlugins
  }

  /**
   * validate if the external plugins that were passed through `options.plugins` are associated to the correct type
   * @method validateExternalPluginsType
   * @private
   * @param {Object} plugins the config object with all plugins
   */
  validateExternalPluginsType(plugins) {
    var plugintypes = ['playback', 'container', 'core']
    plugintypes.forEach((type) => {
      (plugins[type] || []).forEach((el) => {
        var errorMessage = 'external ' + el.type + ' plugin on ' + type + ' array'
        if (el.type !== type) { throw new ReferenceError(errorMessage) }
      })
    })
  }
}
