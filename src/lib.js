// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('./base/base_object')
var BaseObject = require('./base/ui_object')
var UIPlugin = require('./base/ui_plugin')
var Core = require('./components/core')
var Container = require('./components/container')
var Loader = require('./components/loader')

global.DEBUG = true

module.exports = {
  BaseObject,
  UIPlugin,
  UIObject,
  Core,
  Container,
  Loader
}
