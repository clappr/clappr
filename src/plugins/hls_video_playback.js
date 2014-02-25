// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//FIXME review this require approach.
var PlaybackPlugin = require('../base/playback_plugin');
var _ = require("underscore");

var HLSVideoPlaybackPlugin = PlaybackPlugin.extend({
  tagName: 'object',
  template: _.template('<param name="movie" value=<%= swfPath %>><param name="quality" value="autohigh"><param name="swliveconnect" value="true"><param name="allowScriptAccess" value="sameDomain"><param name="bgcolor" value="#001122"><param name="allowFullScreen" value="false"><param name="wmode" value="window">'),

  initialize: function(options) {
    this.el.src = options.src;
    this.el.id = this.cid;
    this.el.width = options.width || 640;
    this.el.height = options.width || 360;
    this.swfPath = "HLSPlayer.swf";
    this.container.settings = ["play", "stop", "volume"];

    this.listenTo(this.container, 'container:play', this.play);
    this.listenTo(this.container, 'container:pause', this.pause);
    this.listenTo(this.container, 'container:stop', this.stop);
    this.listenTo(this.container, 'container:seek', this.seek);
    this.listenTo(this.container, 'container:volume', this.volume);
    this.listenTo(this.container, 'container:fullscreen', this.fullscreen);
    this.render();
    this.currentState = "IDLE";
    this.timedCheckState();
  },
  updateTime: function(interval) {
    return setInterval(function() {
      var time = (100 / (this.el.getDuration() || 1)) * (this.el.getPosition() || 0);
      this.container.timeUpdated(time);
    }.bind(this), interval);
  },
  play: function() {
    if(this.el.getState() === 'IDLE') {
      this.id = this.updateTime(1000);
    }
    if(this.el.getState() === 'PAUSED') {
      this.el.resume();
    } else {
      this.firstPlay();
    }
  },
  timedCheckState: function() {
    setInterval(this.checkState.bind(this), 250);
  },
  checkState: function() {
    if (this.currentState === "IDLE" && this.el.getState() === "PLAYING_BUFFERING") {
      this.container.buffering();
      this.currentState = "PLAYING_BUFFERING";

    } else if (this.currentState === "PLAYING_BUFFERING" && this.el.getState() === "PLAYING") {
      this.container.bufferfull();
      this.currentState = "PLAYING";

    } else if (this.currentState === "PLAYING" && this.el.getState() === "IDLE") {
      this.currentState = "IDLE";
    }
  },
  firstPlay: function() {
    this.el.load(this.el.src);
    this.el.play();
  },
  volume: function(value) {
    this.el.volume(value);
  },
  pause: function() {
    this.el.pause();
  },
  stop: function() {
    this.el.stop();
    clearInterval(this.id);
    this.container.timeUpdated(0);
  },
  seek: function(time) {
    clearInterval(this.id);
    this.el.seek(this.el.getDuration() * (time / 100));
    this.id = this.updateTime(1000);
  },
  timeUpdate: function(time) {
    this.container.timeUpdated(time);
  },
  //TODO: it depends a lot on css stuff.
  fullscreen: function() {
  },
  render: function() {
    this.$el.html(this.template({swfPath: this.swfPath}));
    this.container.$el.append(this.el);
    return this;
  }
});

module.exports = HLSVideoPlaybackPlugin;
