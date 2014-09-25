// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Core Factory is responsible for instantiate the core and it's plugins.
 */

var _ = require('underscore');
var BaseObject = require('../../base/base_object');
var Core = require('../core');

class CoreFactory extends BaseObject {
  constructor(player, loader) {
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
    _.each(this.loader.corePlugins, function(Plugin) {
      var plugin = new Plugin(this.core)
      this.core.addPlugin(plugin)
      this.setupExternalInterface(plugin)
    }, this)
    return this.core
  }

  setupExternalInterface(plugin) {
    _.each(plugin.getExternalInterface(), function(value, key) {
      this.player[key] = value.bind(plugin)
    }, this)
  }
}

module.exports = CoreFactory;
