// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Core = require('./components/core');
var BaseObject = require('./base/base_object');
var Log = require('./plugins/log');

var Player = BaseObject.extend({
  initialize: function(params) {
    this.params = params;
  },
  attachTo: function(element) {
    this.params.parentElement = element;
    this.params.player = this;
    this.core = new Core(this.params);
  },
  load: function(params) {
    this.core.load(params);
  }
});

global.DEBUG = false;

module.exports = WP3 = { Player: Player };
