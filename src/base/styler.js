// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var $ = require('jquery');
var JST = require('./jst');

module.exports = Styler = {
  getStyleFor: function(name) {
    return $('<style></style>').html(JST.CSS[name]);
  }
}
