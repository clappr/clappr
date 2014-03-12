// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * Container is responsible for the video rendering and state
 */

var UIObject = require('../../base/ui_object');
var Styler = require('../../base/styler');

var Container = UIObject.extend({
  attributes: {
    'data-container': ''
  },
  events: {
    'click': 'clicked'
  },
  initialize: function() {
    var style = Styler.getStyleFor('container');
    this.$el.append(style);
    this.trigger('container:ready');
  },
  destroy: function() {
    this.$el.remove();
  },
  setStyle: function(style) {
    this.$el.css(style);
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
