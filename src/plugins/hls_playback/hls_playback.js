// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin');
var Styler = require('../../base/styler');
var JST = require('../../base/jst');
var _ = require("underscore");

var Visibility = require('visibility');

var HLSVideoPlaybackPlugin = UIPlugin.extend({
  name: 'hls_playback',
  tagName: 'object',
  template: JST.hls_playback,
  attributes: {
    'data-hls-playback': ''
  },

  initialize: function(options) {
    this.src = options.src;
    this.swfPath = options.swfPath || "assets/HLSPlayer.swf";
    this.autoPlay = options.autoPlay;
    this.visibility = new Visibility();
    this.visible = true;
    this.highDefinition = "unavailable"; // this will be changed on checkHighDefinition()
    this.settings = {
      left: ["playstop"],
      default: ["position", "seekbar", "duration"],
      right: ["fullscreen", "volume", "hd"]
    };
    this.checkIfFlashIsReady();
  },

  hiddenCallback: function() {
    this.hiddenId = setTimeout(function() { this.el.playerSmoothSetLevel(0) }.bind(this), 10000);
  },

  visibleCallback: function() {
    if (this.hiddenId) {
      clearTimeout(this.hiddenId);
    }
    this.el.playerSmoothSetLevel(-1);
  },

  bootstrap: function() {
    this.trigger('playback:ready', this.name);
    clearInterval(this.bootstrapId);
    this.currentState = "IDLE";
    this.timedCheckState();
    this.el.playerSetflushLiveURLCache(true);
    this.el.playerSetstartFromLowestLevel(true); // decreases startup time
  },

  checkIfFlashIsReady: function() {
    this.bootstrapId = setInterval(function() {
      if(this.el.getState) {
        this.bootstrap();
      }
    }.bind(this), 50);
  },

  updateTime: function(interval) {
    return setInterval(function() {
      this.trigger('playback:timeupdate', this.el.getPosition(), this.el.getDuration(), this.name);
    }.bind(this), interval);
  },
  play: function() {
    if(this.el.getState() === 'IDLE') {
      this.id = this.updateTime(1000);
    }
    if(this.el.getState() === 'PAUSED') {
      this.el.playerResume();
    } else {
      this.firstPlay();
    }
  },

  isHighDefinitionAvailable: function(levels) {
    return !!(levels.length > 0 && levels[levels.length-1].bitrate >= 3500000);
  },

  isHighDefinitionInUse: function() {
    return this.highDefinition === "available-in-use";
  },

  checkHighDefinition: function() {
    // this function is responsible to change media contorl settings
    // regarding the availability of HD level and if it's being used or not.
    // highDefinition attribute have 3 states: "available", "available-in-use", "unavailable"
    var changed = false;
    var levels = this.el.getLevels();
    if (this.isHighDefinitionAvailable(levels)) {
      lastLevel = levels.length -1;
      if (this.el.getLevel() === lastLevel && this.highDefinition !== "available-in-use") {
        this.highDefinition = "available-in-use";
        changed = true;
      } else if (this.el.getLevel() !== lastLevel && this.highDefinition === "available-in-use") {
        this.highDefinition = "available";
        changed = true;
      } else if (this.highDefinition === "unavailable") {
        this.highDefinition = "available";
        changed = true;
      }
    }
    if (changed) {
      this.trigger('playback:highdefinitionupdate');
    }
  },

  timedCheckState: function() {
    this.checkStateId = setInterval(this.checkState.bind(this), 250);
  },

  checkState: function() {
    this.updatePlaybackType();
    this.updatePlayerVisibility();
    this.checkHighDefinition();
    if (this.el.getState() === "PLAYING_BUFFERING" && this.el.getbufferLength() < 1 && this.currentState !== "PLAYING_BUFFERING") {
      this.trigger('playback:buffering', this.name);
      this.currentState = "PLAYING_BUFFERING";
    } else if (this.currentState === "PLAYING_BUFFERING" && this.el.getState() === "PLAYING") {
      this.trigger('playback:bufferfull', this.name);
      this.currentState = "PLAYING";
    } else if (this.el.getState() === "IDLE") {
      this.currentState = "IDLE";
    }
  },

  updatePlayerVisibility: function() {
    if (this.visible && this.visibility.hidden()) {
      this.visible = false;
      this.hiddenCallback();
    } else if (!this.visible && this.visibility.visible()) {
      this.visible = true;
      this.visibleCallback();
    }
  },

  updatePlaybackType: function() {
    if (!this.playbackType) {
      this.playbackType = this.el.getType()
      if (this.playbackType)
        this.updateSettings();
    }
  },

  firstPlay: function() {
    this.el.playerLoad(this.src);
    this.el.playerPlay();
  },

  volume: function(value) {
    this.el.playerVolume(value);
  },

  pause: function() {
    this.el.playerPause();
  },

  stop: function() {
    this.el.playerStop();
    clearInterval(this.id);
    this.trigger('playback:timeupdate', 0, this.name);
  },

  isPlaying: function() {
    return !!(this.isReady && this.el.getState().match(/playing/i));
  },

  seek: function(time) {
    clearInterval(this.id);
    this.el.playerSeek(this.el.getDuration() * (time / 100));
    this.id = this.updateTime(1000);
  },

  timeUpdate: function(time, duration) {
    this.trigger('playback:timeupdate', time, duration, this.name);
  },
  
  destroy: function() {
    clearInterval(this.id);
    clearInterval(this.checkStateId);
  },

  setupFirefox: function() {
    var $el = this.$('embed');
    $el.attr('data-hls-playback', '');
    this.setElement($el[0]);
  },

  updateSettings: function() {
    this.settings = {
      left: [(this.playbackType === "VOD" ? "playpause" : "playstop")],
      default: ["position", "seekbar", "duration"],
      right: ["fullscreen", "volume", "hd"]
    };
    this.trigger('playback:settingsupdate', this.name);
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

HLSVideoPlaybackPlugin.canPlay = function(resource) {
  return !!resource.match(/(.*).m3u8/);
}


module.exports = HLSVideoPlaybackPlugin;
