// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * Container is responsible for the video rendering and state
 */

var UIObject = require('../../base/ui_object');
var Styler = require('../../base/styler');
var _ = require('underscore');

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
    this.plugins = [];
    this.trigger('container:ready');
  },
  with: function(klass) {
    _.extend(this, klass);
  },
  destroy: function() {
    this.trigger('container:destroyed');
    this.$el.remove();
  },
  setStyle: function(style) {
    this.$el.css(style);
  },
  timeUpdated: function(position, duration) {
    this.trigger('container:timeupdate', position, duration);
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
  },
  addPlugin: function(plugin) {
    this.plugins.push(plugin);
  },
  disablePlugins: function(type) {
    if(type) {
      this._byType(type, 'disable');
    } else {
      _(this.plugins).invoke('disable');
    }
  },
  _byType: function(type, action) {
    _(this.plugins).each(function(plugin) {
      if(plugin.type == type) plugin[action]();
    });
  },
  enablePlugins: function(type) {
    if(type) {
      this._byType(type, 'enable');
    } else {
      _(this.plugins).invoke('enable');
    }
  }
});

module.exports = Container;
