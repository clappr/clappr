// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var PluginMixin = require('./plugin_mixin')
var UIObject = require('./ui_object')

var _ = require('underscore')

class UIPlugin extends UIObject {
  get type() { return 'ui' }

  enable() {
    UIPlugin.super('enable').call(this)
    this.$el.show()
  }

  disable() {
    UIPlugin.super('disable').call(this)
    this.$el.hide()
  }

  bindEvents() {}
}

_.extend(UIPlugin.prototype, PluginMixin);

module.exports = UIPlugin
