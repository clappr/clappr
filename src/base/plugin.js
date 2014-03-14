// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = require('./ui_object');
var BaseObject = require('./base_object');
var extend = require('./utils').extend;
var _ = require('underscore');

var pluginOptions = ['container', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

var Plugin = function(options) {
  this.type || (this.type = 'ui');
  _.extend(this, _.pick(options, pluginOptions));
  if(this.type === 'ui') {
    _.extend(this, UIObject.extend(this).prototype);
    this._ensureElement();
    this.delegateEvents();
  } else {
    _.extend(this, BaseObject.prototype);
  }
  this.initialize.apply(this, arguments);
  this.container.addPlugin({plugin: this, type: this.type});
};

Plugin.extend = extend;

module.exports = Plugin;
