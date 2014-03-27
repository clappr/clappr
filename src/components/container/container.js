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
    'click': 'clicked',
    'hover': 'hover',
    'mouseover': 'hover'
  },
  initialize: function() {
    var style = Styler.getStyleFor('container');
    this.$el.append(style);
    this.plugins = [];
  },
  with: function(klass) {
    _.extend(this, klass);
    return this;
  },
  destroy: function() {
    this.trigger('container:destroyed');
    this.$el.remove();
  },
  setStyle: function(style) {
    this.$el.css(style);
  },
  animate: function(style, duration) {
    this.$el.animate(style, duration);
  },
  ready: function() {
    this.trigger('container:ready');
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
  hover: function(e) {
    this.trigger('container:hover', this);
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
  getPluginByName: function(name) {
    var plugin = this.getPlugin(name);
    if(!plugin) { throw Error('Plugin ' + name + ' not found'); }
    return plugin;
  },
  hasPlugin: function(name) {
    return !!this.getPlugin(name);
  },
  getPlugin: function(name) {
    return _(this.plugins).find(function(plugin) { return plugin.name === name });
  }
});

module.exports = Container;
