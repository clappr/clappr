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
  initialize: function(options) {
    this.playback = options.playback;
    this.settings = this.playback.settings;
    this.listenTo(this.playback, 'playback:progress', this.progress);
    this.listenTo(this.playback, 'playback:timeupdate', this.timeUpdated);
    this.listenTo(this.playback, 'playback:ready', this.ready);
    this.listenTo(this.playback, 'playback:buffering', this.buffering);
    this.listenTo(this.playback, 'playback:bufferfull', this.bufferfull);
    this.listenTo(this.playback, 'playback:settingsupdate', this.settingsUpdate);
    this.listenTo(this.playback, 'playback:ended', this.ended);
    this.isReady = false;
    this.plugins = [this.playback];
  },
  with: function(klass) {
    _.extend(this, klass);
    return this;
  },
  destroy: function() {
    this.trigger('container:destroyed');
    this.playback.destroy();
    this.$el.remove();
  },
  setStyle: function(style) {
    this.$el.css(style);
  },
  animate: function(style, duration) {
    this.$el.animate(style, duration);
  },
  ready: function() {
    this.isReady = true;
    this.trigger('container:ready');
  },
  isPlaying: function() {
    return this.playback.isPlaying();
  },
  timeUpdated: function(position, duration) {
    this.trigger('container:timeupdate', position, duration);
  },
  progress: function(startPosition, endPosition, duration) {
    this.trigger('container:progress', startPosition, endPosition, duration);
  },
  play: function() {
    this.trigger('container:play');
    this.playback.play();
  },
  stop: function() {
    this.trigger('container:stop');
    this.playback.stop();
  },
  pause: function() {
    this.trigger('container:pause');
    this.playback.pause();
  },
  ended: function() {
    this.trigger('container:ended', this);
  },
  clicked: function() {
    this.trigger('container:click', this);
  },
  hover: function(e) {
    this.trigger('container:hover', this);
  },
  setCurrentTime: function(time) {
    this.trigger('container:seek', time);
    this.playback.seek(time);
  },
  setVolume: function(value) {
    this.trigger('container:volume', value);
    this.playback.volume(value);
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
  },
  settingsUpdate: function() {
    this.settings = this.playback.settings;
    this.trigger('container:settingsupdate');
  },
  render: function() {
    var style = Styler.getStyleFor('container');
    this.$el.append(style);
    this.$el.append(this.playback.render().el);
    return this;
  }
});

module.exports = Container;
