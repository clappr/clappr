// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../base/base_object');

var StatsPlugin = BaseObject.extend({
  initialize: function(options) {
    this.listenTo(this.container, 'container:play', this.onPlay);
    this.listenTo(this.container, 'container:state:buffering', this.onBuffering);
    this.listenTo(this.container, 'container:state:bufferfull', this.onBufferFull);
    this.firstPlay = true;
    this.startupTime = 0;
  },
  onPlay: function() {
  },
  onBuffering: function() {
    if (this.firstPlay) {
      this.startupTimeInit = Date.now();
    }
  },
  onBufferFull: function() {
    this.firstPlay = false;
    this.startupTime = Date.now() - this.startupTimeInit;
  },
});

module.exports = StatsPlugin;
