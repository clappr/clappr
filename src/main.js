// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('./base/base_object');
var CoreFactory = require('./components/core_factory');
var Loader = require('./components/loader');

var Player = BaseObject.extend({
  initialize: function(params) {
    params.displayType || (params.displayType = 'pip');
    this.params = params;
    this.loader = new Loader(this.params);
    this.coreFactory = new CoreFactory(this, this.loader);
  },
  attachTo: function(element) {
    this.params.parentElement = element;
    this.core = this.coreFactory.createCore();
  },
  load: function(params) {
    this.core.load(params);
  }
});

global.DEBUG = true;

module.exports = WP3 = { Player: Player };
