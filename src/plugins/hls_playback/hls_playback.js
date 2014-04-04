// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin');
var Styler = require('../../base/styler');
var JST = require('../../base/jst');
var _ = require("underscore");

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
    this.settings = {
      left: ["playstop"],
      default: ["position", "seekbar", "duration"],
      right: ["fullscreen", "volume"]
    };
    this.checkIfFlashIsReady();
  },
  bootstrap: function() {
    this.trigger('playback:ready');
    clearInterval(this.bootstrapId);
    this.currentState = "IDLE";
    this.timedCheckState();
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
      this.trigger('playback:timeupdate', this.el.getPosition(), this.el.getDuration());
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
    this.checkStateId = setInterval(this.checkState.bind(this), 250);
  },
  checkState: function() {
    if (!this.playbackType) {
      this.playbackType = this.el.getType()
      if (this.playbackType)
        this.updateSettings();
    }
    if (this.el.getState() === "PLAYING_BUFFERING" && this.el.getbufferLength() < 1) {
      this.trigger('playback:buffering');
      this.currentState = "PLAYING_BUFFERING";
    } else if (this.currentState === "PLAYING_BUFFERING" && this.el.getState() === "PLAYING") {
      this.trigger('playback:bufferfull');
      this.currentState = "PLAYING";
    } else if (this.el.getState() === "IDLE") {
      this.currentState = "IDLE";
    }
  },
  firstPlay: function() {
    this.el.load(this.src);
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
    this.trigger('playback:timeupdate', 0);
  },
  isPlaying: function() {
    return !!this.el.getState().match(/playing/i);
  },
  seek: function(time) {
    clearInterval(this.id);
    this.el.seek(this.el.getDuration() * (time / 100));
    this.id = this.updateTime(1000);
  },
  timeUpdate: function(time, duration) {
    this.trigger('playback:timeupdate', time, duration);
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
      right: ["fullscreen", "volume"]
    };
    this.trigger('playback:settingsupdate');
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
