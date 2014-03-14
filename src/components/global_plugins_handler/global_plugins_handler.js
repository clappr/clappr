// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Global Plugins Handler is responsible for instantiate global plugins.
 */

var BaseObject = require('../../base/base_object');

var GlobalPluginsHandler = BaseObject.extend({
  initialize: function(core) {
    this.params = core.params;
    this.mediaControl = core.mediaControl;
    this.containers = core.containers;
    this.globalPlugins = core.loader.globalPlugins;
  },
  loadPlugins: function() {
  }
});

module.exports = GlobalPluginsHandler;
