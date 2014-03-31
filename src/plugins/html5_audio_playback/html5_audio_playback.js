// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin');

var HTML5AudioPlaybackPlugin = UIPlugin.extend({
  name: 'html5_audio_playback',
  type: 'playback',
  tagName: 'audio',
  events: {
    'timeupdate': 'timeUpdated',
    'ended': 'ended'
  },

  initialize: function(options) {
    this.el.src = options.src;
    this.render(); // it should render when the container trigger 'ready'
  },

  setContainer: function() {
    this.container.settings = {
      left: ['playpause'],
      right: ['volume'],
      default: ['position', 'seekbar', 'duration']
    };
    this.render();
  },
  bindEvents: function() {
    this.listenTo(this.container, 'container:play', this.play);
    this.listenTo(this.container, 'container:pause', this.pause);
    this.listenTo(this.container, 'container:seek', this.seek);
    this.listenTo(this.container, 'container:volume', this.volume);
    this.listenTo(this.container, 'container:stop', this.stop);
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
    this.container.timeUpdated(this.el.currentTime, this.el.duration);
  },

  render: function() {
    this.container.$el.append(this.el);
    return this;
  }
 });

HTML5AudioPlaybackPlugin.canPlay = function(resource) {
  return !!resource.match(/(.*).mp3/);
}


module.exports = HTML5AudioPlaybackPlugin;
