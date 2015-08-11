// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Core Factory is responsible for instantiate the core and it's plugins.
 */

import BaseObject from '../../base/base_object'
import Core from '../core'

export default class CoreFactory extends BaseObject {
  constructor(player, loader) {
    super()
    this.player = player
    this.options = player.options
    this.loader = loader
    this.options.loader = this.loader
  }

  create() {
    this.core = new Core(this.options)
    this.core.then(this.addCorePlugins.bind(this))
    return this.core
  }

  addCorePlugins() {
    this.loader.corePlugins.forEach((Plugin) => {
      var plugin = new Plugin(this.core)
      this.core.addPlugin(plugin)
      this.setupExternalInterface(plugin)
    })
    return this.core
  }

  setupExternalInterface(plugin) {
    var externalFunctions = plugin.getExternalInterface();
    for (var key in externalFunctions) {
      this.player[key] = externalFunctions[key].bind(plugin)
    }
  }
}

