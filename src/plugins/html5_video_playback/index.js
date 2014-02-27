// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var PlaybackPlugin = require('../../base/playback_plugin');

var HTML5VideoPlaybackPlugin = PlaybackPlugin.extend({
  events: {
    'timeupdate': 'timeUpdated',
    'ended': 'ended'
  },
  tagName: 'video',
  className: 'container',
  initialize: function(options) {
    this.firstPlay = true;
    this.el.src = options.src;
    this.container.settings = this.settings;
    this.listenTo(this.container, 'container:play', this.play);
    this.listenTo(this.container, 'container:pause', this.pause);
    this.listenTo(this.container, 'container:seek', this.seek);
    //this.listenTo(this.container, 'container:fullscreen', this.fullscreen);
    this.listenTo(this.container, 'container:volume', this.volume);
    this.listenTo(this.container, 'container:stop', this.stop);
  },
  play: function() {
    if(this.firstPlay) {
      this.render();
      this.$el.show();
      this.firstPlay = false;
    }
    this.el.play();
  },
  pause: function() {
    this.el.pause();
  },
  stop: function() {
    this.pause();
    this.el.currentTime = 0;
    this.firstPlay = true;
    this.$el.hide();
  },
  fullscreen: function() {
    //this is not right, the player goes fullscreen, not the playback.
    this.el.webkitRequestFullscreen();
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
    this.container.$el.append(this.el);
    return this;
  },
});

module.exports = HTML5VideoPlaybackPlugin;
