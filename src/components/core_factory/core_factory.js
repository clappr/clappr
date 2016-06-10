// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import BaseObject from 'base/base_object'
import Core from 'components/core'

/**
 * The Core Factory is responsible for instantiate the core and it's plugins.
 * @class CoreFactory
 * @constructor
 * @extends BaseObject
 * @module components
 */
export default class CoreFactory extends BaseObject {

  get loader() { return this.player.loader }

  /**
   * it builds the core factory
   * @method constructor
   * @param {Player} player the player object
   */
  constructor(player) {
    super()
    this.player = player
    this.options = player.options
  }

  /**
   * creates a core and its plugins
   * @method create
   * @return {Core} created core
   */
  create() {
    this.options.loader = this.loader
    this.core = new Core(this.options)
    this.addCorePlugins()
    this.core.createContainers(this.options)
    return this.core
  }

  /**
   * given the core plugins (`loader.corePlugins`) it builds each one
   * @method addCorePlugins
   * @return {Core} the core with all plugins
   */
  addCorePlugins() {
    this.loader.corePlugins.forEach((Plugin) => {
      var plugin = new Plugin(this.core)
      this.core.addPlugin(plugin)
      this.setupExternalInterface(plugin)
    })
    return this.core
  }

  setupExternalInterface(plugin) {
    var externalFunctions = plugin.getExternalInterface()
    for (var key in externalFunctions) {
      this.player[key] = externalFunctions[key].bind(plugin)
    }
  }
}
