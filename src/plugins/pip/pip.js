// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object');
var $ = require("jquery");

var PipPlugin = BaseObject.extend({
  initialize: function(core) {
    this.masterContainer = core.containers[0];
    if (core.containers.length === 2) {
      this.pipContainer = core.containers[1];
      this.setPipStyle(this.pipContainer);
    }
  },
  setPipStyle: function(container) {
    container.setStyle({width: "30%", height: "30%",
                       "z-index": 2, bottom: "7px", right: "7px"});
  },
});

module.exports = PipPlugin;
