// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var PluginMixin = require('./plugin_mixin');
var UIObject = require('./ui_object');

var UIPlugin = UIObject.extend(PluginMixin).extend({
  type: 'ui',
  enable: function() {
    UIPlugin.super('enable').call(this);
    this.$el.show();
  },
  disable: function() {
    UIPlugin.super('disable').call(this);
    this.$el.hide();
  },
  bindEvents: function() {}
}); 

module.exports = UIPlugin;

