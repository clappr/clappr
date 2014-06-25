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
  name: 'Container',
  attributes: {
    'data-container': ''
  },
  events: {
    'click': 'clicked'
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
    this.listenTo(this.playback, 'playback:loadedmetadata', this.loadedMetadata);
    this.listenTo(this.playback, 'playback:highdefinitionupdate', this.highDefinitionUpdate);
    this.listenTo(this.playback, 'playback:mediacontrol:disable', this.disableMediaControl);
    this.listenTo(this.playback, 'playback:mediacontrol:enable', this.enableMediaControl);
    this.listenTo(this.playback, 'playback:ended', this.ended);
    this.listenTo(this.playback, 'playback:play', this.playing);
    this.isReady = false;
    this.mediaControlDisabled = false;
    this.plugins = [this.playback];
  },
  with: function(klass) {
    _.extend(this, klass);
    return this;
  },
  destroy: function() {
    this.trigger('container:destroyed', this, this.name);
    this.playback.destroy();
    this.$el.remove();
  },
  setStyle: function(style) {
    this.$el.css(style);
  },
  animate: function(style, duration) {
    return this.$el.animate(style, duration).promise();
  },
  ready: function() {
    console.log('container is ready');
    this.isReady = true;
    this.trigger('container:ready', this.name);
  },
  isPlaying: function() {
    return this.playback.isPlaying();
  },
  error: function(errorObj) {
    this.trigger('container:error', errorObj, this.name);
  },
  loadedMetadata: function(duration) {
    this.trigger('container:loadedmetadata', duration);
  },
  timeUpdated: function(position, duration) {
    this.trigger('container:timeupdate', position, duration, this.name);
  },
  progress: function(startPosition, endPosition, duration) {
    this.trigger('container:progress', startPosition, endPosition, duration, this.name);
  },
  playing: function() {
    this.trigger('container:play', this.name);
  },
  play: function() {
    this.playback.play();
  },
  stop: function() {
    this.trigger('container:stop', this.name);
    this.playback.stop();
  },
  pause: function() {
    this.trigger('container:pause', this.name);
    this.playback.pause();
  },
  ended: function() {
    this.trigger('container:ended', this, this.name);
  },
  clicked: function() {
    this.trigger('container:click', this, this.name);
  },
  setCurrentTime: function(time) {
    this.trigger('container:seek', time, this.name);
    this.playback.seek(time);
  },
  setVolume: function(value) {
    this.trigger('container:volume', value, this.name);
    this.playback.volume(value);
  },
  requestFullscreen: function() {
    this.trigger('container:fullscreen', this.name);
  },
  buffering: function() {
    this.trigger('container:state:buffering', this.name);
  },
  bufferfull: function() {
    this.trigger('container:state:bufferfull', this.name);
  },
  addPlugin: function(plugin) {
    this.plugins.push(plugin);
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
  highDefinitionUpdate: function() {
    this.trigger('container:highdefinitionupdate');
  },
  isHighDefinitionInUse: function() {
    return this.playback.isHighDefinitionInUse();
  },
  disableMediaControl: function() {
    this.mediaControlDisabled = true;
    this.trigger('container:mediacontrol:disable');
  },
  enableMediaControl: function() {
    this.mediaControlDisabled = false;
    this.trigger('container:mediacontrol:enable');
  },
  render: function() {
    var style = Styler.getStyleFor('container');
    this.$el.append(style);
    this.$el.append(this.playback.render().el);
    return this;
  }
});

module.exports = Container;
