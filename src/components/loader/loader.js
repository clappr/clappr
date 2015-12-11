// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import BaseObject from 'base/base_object'
import PlayerInfo from 'components/player_info'
import uniq from 'lodash.uniq'
import find from 'lodash.find'

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
   * @param {Object} internalPlugins override internal plugins (Clappr.intPlugins)
   * @param {Object} externalPlugins the external plugins
   * @param {Number} playerId you can embed multiple instances of clappr, therefore this is the unique id of each one.
   */
  constructor(internalPlugins, externalPlugins, playerId) {
    super()

    // TODO make a class
    this._allInternalPlugins = {
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
          Favicon
        ]
    }

    this.playerId = playerId

    this.playbackPlugins = this.getInternalPlugins('playback', internalPlugins)
    this.containerPlugins = this.getInternalPlugins('container', internalPlugins)
    this.corePlugins = this.getInternalPlugins('core', internalPlugins)

    if (externalPlugins) {
      this.validateExternalPluginsType(externalPlugins)
      this.addExternalPlugins(externalPlugins)
    }
  }

  /**
   * adds all the external plugins that were passed through `options.plugins`
   * @method getInternalPlugins
   * @private
   * @param {String} pluginType the type of plugin: "playback", "contrainer" or "core"
   * @param {Object} overridePlugins a set of plugin names, which override global Clappr.internalPlugins
   */
  getInternalPlugins(pluginType, overridePlugins) {
    var
      intPluginNames = overridePlugins[pluginType] || Clappr.internalPlugins[pluginType] || [],
      plugin,
      ret = [];

    if (pluginType === 'playback' && !find(intPluginNames, (n) => { return n === 'no_op' })) {
      intPluginNames.push('no_op');
    }

    intPluginNames.forEach((pluginName) => {
      plugin = find(this._allInternalPlugins[pluginType], (p) => { return p.pluginName === pluginName })
      if (plugin) {
        ret.push(plugin)
      } else {
        throw new ReferenceError(`could not find an internal "${pluginType}" plugin with "${pluginName}" name`)
      }
    })

    return ret;
  }

  /**
   * adds all the external plugins that were passed through `options.plugins`
   * @method addExternalPlugins
   * @private
   * @param {Object} plugins the config object with all plugins
   */
  addExternalPlugins(plugins) {
    if (plugins.playback) { this.playbackPlugins = uniq(plugins.playback.concat(this.playbackPlugins)) }
    if (plugins.container) { this.containerPlugins = uniq(plugins.container.concat(this.containerPlugins)) }
    if (plugins.core) { this.corePlugins = uniq(plugins.core.concat(this.corePlugins)) }
    PlayerInfo.getInstance(this.playerId).playbackPlugins = this.playbackPlugins
  }

  /**
   * validate if the external plugins that were passed through `options.plugins` are associated to the correct type
   * @method validateExternalPluginsType
   * @private
   * @param {Object} plugins the config object with all plugins
   */
  validateExternalPluginsType(plugins) {
    var plugintypes = ["playback", "container", "core"]
    plugintypes.forEach((type) => {
      (plugins[type] || []).forEach((el) => {
        var errorMessage = "external " + el.type + " plugin on " + type + " array"
        if (el.type !== type) { throw new ReferenceError(errorMessage) }
      })
    })
  }
}
