// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var _ = require('underscore');
var extend = require('./utils').extend;
var Events = require('./events');

var pluginOptions = ['container'];

var BaseObject = function(options) {
  _.extend(this, _.pick(options, pluginOptions));
  this.initialize.apply(this, arguments);
};

_.extend(BaseObject.prototype, Events);

BaseObject.extend = extend;

module.exports = BaseObject;

