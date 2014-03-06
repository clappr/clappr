// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var PlaybackPlugin = require('../../base/playback_plugin');
var Styler = require('../../base/styler');

var HTML5VideoPlaybackPlugin = PlaybackPlugin.extend({
  pluginName: 'html5_video_playback',
  attributes: {
    'data-html5-video': ''
  },
  events: {
    'timeupdate': 'timeUpdated',
    'ended': 'ended'
  },
  tagName: 'video',
  initialize: function(options) {
    this.el.src = options.src;
    this.container.settings = ['play', 'pause', 'stop', 'seekbar', 'fullscreen', 'volume'];
    this.listenTo(this.container, 'container:play', this.play);
    this.listenTo(this.container, 'container:pause', this.pause);
    this.listenTo(this.container, 'container:seek', this.seek);
    this.listenTo(this.container, 'container:volume', this.volume);
    this.listenTo(this.container, 'container:stop', this.stop);
    this.render();
    options.autoPlay && this.container.play();
  },
  play: function() {
    this.el.play();
  },
  pause: function() {
    this.el.pause();
  },
  stop: function() {
    this.pause();
    this.el.currentTime = 0;
  },
  volume: function(value) {
    this.el.volume = value / 100;
  },
  mute: function() {
    this.el.volume = 0;
  },
  unmute: function() {
    this.el.volume = 1;
  },
  isMuted: function() {
    return !!this.el.volume;
  },
  ended: function() {
    this.trigger('container:timeupdate', 0);
  },
  seek: function(seekBarValue) {
    var time = this.el.duration * (seekBarValue / 100);
    this.el.currentTime = time;
  },
  getCurrentTime: function() {
    return this.el.currentTime;
  },
  getDuration: function() {
    return this.el.duration;
  },
  timeUpdated: function() {
    var time = (100 / this.el.duration) * this.el.currentTime;
    this.container.timeUpdated(time);
  },
  render: function() {
    var style = Styler.getStyleFor(this.pluginName);
    this.container.$el.append(style);
    this.container.$el.append(this.el);
    return this;
  },
});

module.exports = HTML5VideoPlaybackPlugin;
