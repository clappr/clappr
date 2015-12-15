// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import BaseObject from 'base/base_object'
import PlayerInfo from 'components/player_info'
import uniq from 'lodash.uniq'
import find from 'lodash.find'

import {PLUGIN_TYPES, PLUGIN_CLASSES_ORDERED, defaultPlugins, getPluginName} from 'default/plugins'

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
   * @param {Object} customInternalPlugins override the global internal plugins set (Clappr.defaultPlugins)
   * @param {Object} externalPlugins the external plugins
   * @param {Number} playerId you can embed multiple instances of clappr, therefore this is the unique id of each one.
   */
  constructor(customInternalPlugins, externalPlugins, playerId) {
    super()

    this.playerId = playerId

    this.playbackPlugins = this.getInternalPlugins('playback', customInternalPlugins || {})
    this.containerPlugins = this.getInternalPlugins('container', customInternalPlugins || {})
    this.corePlugins = this.getInternalPlugins('core', customInternalPlugins || {})

    if (externalPlugins) {
      this.validateExternalPluginsType(externalPlugins)
      this.addExternalPlugins(externalPlugins)
    }
  }

  /**
   * get all the internal plugins that were passed through `options.internalPlugins` or Clappr.defaultPlugins
   * @method getInternalPlugins
   * @private
   * @param {String} pluginType the type of plugin: "playback", "contrainer" or "core"
   * @param {Object} customInternalPlugins a set of plugin names, which override global Clappr.defaultPlugins
   */
  getInternalPlugins(pluginType, customInternalPlugins) {
    var
      intPluginNames = customInternalPlugins[pluginType] || defaultPlugins[pluginType] || [],
      plugin,
      ret = [];

    if (pluginType === 'playback' && !find(intPluginNames, (n) => { return n === 'no_op' })) {
      intPluginNames.push('no_op');
    }

    intPluginNames.forEach((pluginName) => {
      plugin = find(PLUGIN_CLASSES_ORDERED[pluginType], (p) => { return p.prototype.name === pluginName })
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
    if (plugins.playback) { this.playbackPlugins = uniq(plugins.playback.concat(this.playbackPlugins), getPluginName) }
    if (plugins.container) { this.containerPlugins = uniq(plugins.container.concat(this.containerPlugins), getPluginName) }
    if (plugins.core) { this.corePlugins = uniq(plugins.core.concat(this.corePlugins), getPluginName) }
    PlayerInfo.getInstance(this.playerId).playbackPlugins = this.playbackPlugins
  }

  /**
   * validate if the external plugins that were passed through `options.plugins` are associated to the correct type
   * @method validateExternalPluginsType
   * @private
   * @param {Object} plugins the config object with all plugins
   */
  validateExternalPluginsType(plugins) {
    PLUGIN_TYPES.forEach((type) => {
      (plugins[type] || []).forEach((el) => {
        var errorMessage = "external " + el.type + " plugin on " + type + " array"
        if (el.type !== type) { throw new ReferenceError(errorMessage) }
      })
    })
  }
}
