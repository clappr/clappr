// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Core Factory is responsible for instantiate the core and it's plugins.
 */

var _ = require('underscore');
var BaseObject = require('../../base/base_object');
var Core = require('../core');

var CoreFactory = BaseObject.extend({
  initialize: function(player, loader) {
    this.player = player;
    this.params = player.params;
    this.loader = loader;
  },
  create: function() {
    this.core = new Core(this.params);
    this.core.then(this.addCorePlugins.bind(this));
    return this.core;
  },
  addCorePlugins: function() {
    _.each(this.loader.globalPlugins, function(Plugin) {
      var plugin = new Plugin(this.core);
      this.core.addPlugin(plugin);
      this.setupExternalInterface(plugin);
    }, this);
    return this.core;
  },
  setupExternalInterface: function(plugin) {
    _.each(plugin.getExternalInterface(), function(value, key) {
      this.player[key] = value.bind(plugin);
    }, this);
  }
});

module.exports = CoreFactory;
