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
    this.containers = core.containers;
    this.globalPlugins = core.loader.globalPlugins;
    this.pluginInstances = [];
  },
  loadPlugins: function() {
    _.each(this.globalPlugins, function(plugin) {
      this.pluginInstances.push(new plugin(this.core));
    }, this);

  }
});

module.exports = GlobalPluginsHandler;
