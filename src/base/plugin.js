// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var PluginMixin = require('./plugin_mixin');
var BaseObject = require('./base_object');

var Plugin = BaseObject.extend(PluginMixin).extend({});

module.exports = Plugin;

