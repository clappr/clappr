// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object');
var $ = require("jquery");

var PipPlugin = BaseObject.extend({
  initialize: function(mediaControl, containers) {
    var pipContainer = containers[1];
    pipContainer.setStyle({width: "25%", height: "25%", zindex: 10, bottom: "7px", right: "7px"});
  }
});

module.exports = PipPlugin;
