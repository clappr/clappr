// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * Container is responsible for the video rendering and state
 */

var UIObject = require('../../base/ui_object');

var Container = UIObject.extend({
  events: {
    'click': 'clicked'
  },
  initialize: function() {
    this.trigger('container:ready');
  },
  timeUpdated: function(time) {
    this.trigger('container:timeupdate', time);
  },
  play: function() {
    this.trigger('container:play');
  },
  stop: function() {
    this.trigger('container:stop');
  },
  pause: function() {
    this.trigger('container:pause');
  },
  clicked: function() {
    this.trigger('container:click', this);
  },
  setCurrentTime: function(time) {
    this.trigger('container:seek', time);
  },
  setVolume: function(value) {
    this.trigger('container:volume', value);
  },
  requestFullscreen: function() {
    this.trigger('container:fullscreen');
  },
  buffering: function() {
    this.trigger('container:state:buffering');
  },
  bufferfull: function() {
    this.trigger('container:state:bufferfull');
  }
});

module.exports = Container;
