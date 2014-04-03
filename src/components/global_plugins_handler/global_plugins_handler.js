// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Global Plugins Handler is responsible for instantiate global plugins.
 */

var _ = require('underscore');
var BaseObject = require('../../base/base_object');

var GlobalPluginsHandler = BaseObject.extend({
  initialize: function(core) {
    this.core = core;
    this.player = core.params.player;
    this.containers = core.containers;
    this.globalPlugins = core.loader.globalPlugins;
    this.pluginInstances = [];
  },
  loadPlugins: function() {
    _.each(this.globalPlugins, function(Plugin) {
      var plugin = new Plugin(this.core);
      this.pluginInstances.push(plugin);
      this.setupExternalInterface(plugin);
    }, this);
  },
  setupExternalInterface: function(plugin) {
    _.each(plugin.getExternalInterface(), function(value, key) {
      this.player[key] = value.bind(plugin);
    }, this);
  }
});

module.exports = GlobalPluginsHandler;
