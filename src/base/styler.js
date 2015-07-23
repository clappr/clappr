// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var $ = require('clappr-zepto');
var template = require('./template');
var JST = require('./jst');

var Styler = {
  getStyleFor: function(name, options={baseUrl: ''}) {
    return $('<style class="clappr-style"></style>').html(template(JST.CSS[name])(options));
  },
  getStyleFor2: function(style, options={baseUrl: ''}) {
    return $('<style class="clappr-style"></style>').html(template(style.toString())(options));
  }
};

module.exports = Styler;
