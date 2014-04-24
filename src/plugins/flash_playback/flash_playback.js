// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin');
var Styler = require('../../base/styler');
var JST = require('../../base/jst');
var _ = require("underscore");

var FlashVideoPlaybackPlugin = UIPlugin.extend({
  name: 'flash_playback',
  tagName: 'object',
  template: JST.flash_playback,
  attributes: {
    'data-flash-playback': ''
  },

  initialize: function(options) {
    this.src = options.src;
    this.swfPath = options.swfPath || "assets/Player.swf";
    this.autoPlay = options.autoPlay;
    this.settings = {
      left: ["playpause"],
      default: ["position", "seekbar", "duration"],
      right: ["fullscreen", "volume"]
    };
    this.isReady = false;
    this.checkIfFlashIsReady();
  },
  bootstrap: function() {
    this.el.width = "100%";
    this.el.height = "100%";
    this.isReady = true;
    this.trigger('playback:ready', this.name);
    clearInterval(this.bootstrapId);
    this.currentState = "IDLE";
    this.timedCheckState();
  },
  checkIfFlashIsReady: function() {
    this.bootstrapId = setInterval(function() {
      if(this.el.getState && this.el.getState() === "IDLE") {
           this.bootstrap();
      }
    }.bind(this), 50);
  },
  setupFirefox: function() {
    var $el = this.$('embed');
    $el.attr('data-flash-playback', '');
    this.setElement($el[0]);
  },
  updateTime: function(interval) {
    return setInterval(function() {
      this.trigger('playback:timeupdate', this.el.getPosition(), this.el.getDuration(), this.name);
    }.bind(this), interval);
  },
  timedCheckState: function() {
    this.checkStateId = setInterval(this.checkState.bind(this), 250);
    this.progressId = setInterval(this.progress.bind(this), 1000);
  },
  checkState: function() {
    if (this.currentState !== "PLAYING_BUFFERING" && this.el.getState() === "PLAYING_BUFFERING") {
      this.trigger('playback:buffering', this.name);
      this.currentState = "PLAYING_BUFFERING";
    } else if (this.currentState === "PLAYING_BUFFERING" && this.el.getState() === "PLAYING") {
      this.trigger('playback:bufferfull', this.name);
      this.currentState = "PLAYING";
    } else if (this.el.getState() === "IDLE") {
      this.currentState = "IDLE";
    } else if (this.el.getState() === "ENDED") {
      this.trigger('playback:ended', this.name);
      this.trigger('playback:timeupdate', 0, this.el.getDuration(), this.name);
      this.currentState = "ENDED";
      clearInterval(this.id);
    }
  },
  progress: function() {
    if (this.currentState !== "IDLE" && this.currentState !== "ENDED") {
      this.trigger('playback:progress', 0, this.el.getBytesLoaded(), this.el.getBytesTotal(), this.name);
    }
  },
  firstPlay: function() {
    this.currentState = "PLAYING";
    this.el.playerPlay(this.src);
  },
  play: function() {
    if(this.el.getState() === 'IDLE') {
      this.id = this.updateTime(1000);
    }
    if(this.el.getState() === 'PAUSED') {
      this.currentState = "PLAYING";
      this.el.playerResume();
    } else {
      this.firstPlay();
    }
  },
  volume: function(value) {
    this.el.playerVolume(value);
  },
  pause: function() {
    this.currentState = "PAUSED";
    this.el.playerPause();
  },
  stop: function() {
    this.el.playerStop();
    clearInterval(this.id);
    this.trigger('playback:timeupdate', 0, this.name);
  },
  isPlaying: function() {
    return !!(this.isReady && this.currentState == "PLAYING");
  },
  seek: function(time) {
    clearInterval(this.id);
    var seekTo = this.el.getDuration()* (time / 100);
    this.el.playerSeek(seekTo);
    this.timeUpdate(seekTo, this.el.getDuration());
    this.id = this.updateTime(1000);
    if (this.currentState == "PAUSED") {
      this.pause();
    }
  },
  timeUpdate: function(time, duration) {
    this.trigger('playback:timeupdate', time, duration, this.name);
  },
  destroy: function() {
    clearInterval(this.id);
    clearInterval(this.checkStateId);
    clearInterval(this.progressId);
  },
  render: function() {
    var style = Styler.getStyleFor(this.name);
    this.$el.html(this.template({swfPath: this.swfPath}));
    this.$el.append(style);
    this.el.id = this.cid;
    if(navigator.userAgent.match(/firefox/i)) { //FIXME remove it from here
      this.setupFirefox();
    }
    return this;
  }
});

FlashVideoPlaybackPlugin.canPlay = function(resource) {
  //http://help.adobe.com/en_US/flashmediaserver/techoverview/WS07865d390fac8e1f-4c43d6e71321ec235dd-7fff.html
  if (navigator.userAgent.match(/firefox/i)) {
    return _.isString(resource) && !!resource.match(/(.*).(mp4|mov|f4v|3gpp|3gp)/);
  } else {
    return _.isString(resource) && !!resource.match(/(.*).(mov|f4v|3gpp|3gp)/);
  }
}

module.exports = FlashVideoPlaybackPlugin;
