// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var $ = require('jquery');
var _ = require('underscore');
var JST = require('./jst');

var Styler = {
  getStyleFor: function(name, options) {
    options = options || {};
    return $('<style></style>').html(_.template(JST.CSS[name])(options));
  }
};

module.exports = Styler;
