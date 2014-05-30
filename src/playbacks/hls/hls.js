// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin');
var Styler = require('../../base/styler');
var JST = require('../../base/jst');
var _ = require("underscore");

var Visibility = require('visibility');

var HLS = UIPlugin.extend({
  name: 'hls',
  tagName: 'div',
  template: JST.hls,
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
  safe: function(fn) {
    if(this.el.globoGetState && this.el.globoGetDuration && this.el.globoGetPosition &&
       this.el.globoPlayerSmoothSetLevel && this.el.globoPlayerSetflushLiveURLCache && this.el.globoPlayerSetstartFromLowestLevel) {
      return fn.apply(this);
    }
  },
  hiddenCallback: function() {
    this.hiddenId = this.safe(function() {
      return setTimeout(function() { this.el.globoPlayerSmoothSetLevel(0) }.bind(this), 10000);
    });
  },
  visibleCallback: function() {
    this.safe(function() {
      if (this.hiddenId) {
        clearTimeout(this.hiddenId);
      }
      this.el.globoPlayerSmoothSetLevel(-1);
    });
  },
  bootstrap: function() {
    this.el.width = "100%";
    this.el.height = "100%";
    this.trigger('playback:ready', this.name);
    clearInterval(this.bootstrapId);
    this.currentState = "IDLE";
    this.timedCheckState();
    this.el.globoPlayerSetflushLiveURLCache(true);
    this.el.globoPlayerSetstartFromLowestLevel(true); // decreases startup time
    this.autoPlay && this.play();
  },
  checkIfFlashIsReady: function() {
    this.bootstrapId = setInterval(function() {
      if(this.el.globoGetState) {
        this.bootstrap();
      }
    }.bind(this), 50);
  },
  updateTime: function(interval) {
    return this.safe(function() {
      return setInterval(function() {
        this.safe(function() { this.trigger('playback:timeupdate', this.el.globoGetPosition(), this.el.globoGetDuration(), this.name); });
      }.bind(this), interval);
    });
  },
  play: function() {
    this.safe(function() {
      if(this.el.globoGetState() === 'IDLE') {
        clearInterval(this.checkStateId)
        this.checkTimeId = this.updateTime(1000);
      }
      if(this.el.globoGetState() === 'PAUSED') {
        this.el.globoPlayerResume();
      } else {
        this.firstPlay();
      }
      this.trigger('playback:play', this.name);
    });
  },
  getPlaybackType: function() {
    if (this.playbackType)
      return this.playbackType;
    return null;
  },
  getCurrentBitrate: function() {
    return this.safe(function() {
      var currentLevel = this.getLevels()[this.el.globoGetLevel()];
      return currentLevel.bitrate;
    });
  },
  getLastProgramDate: function() {
    var programDate = this.el.globoGetLastProgramDate();
    // normalizing for BRT
    return programDate - 1.08e+7;
  },
  isHighDefinitionAvailable: function(levels) {
    return !!(levels.length > 0 && levels[levels.length-1].bitrate >= 3500000);
  },
  isHighDefinitionInUse: function() {
    return this.highDefinition === "available-in-use";
  },
  checkHighDefinition: function() {
    this.safe(function() {
      // this function is responsible to change media control settings
      // regarding the availability of HD level and if it's being used or not.
      // highDefinition attribute have 3 states: "available", "available-in-use", "unavailable"
      var changed = false;
      this.levels = this.getLevels();
      if (this.isHighDefinitionAvailable(this.levels)) {
        var lastLevel = this.levels.length -1;
        var currentLevel = this.el.globoGetLevel();
        if (currentLevel === lastLevel && this.highDefinition !== "available-in-use") {
          this.highDefinition = "available-in-use";
          changed = true;
        } else if (currentLevel !== lastLevel && this.highDefinition === "available-in-use") {
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
    });
  },
  getLevels: function() {
    return this.safe(function() {
      if (!this.levels || this.levels.length === 0) {
        this.levels = this.el.globoGetLevels();
      }
      return this.levels;
    });
  },
  timedCheckState: function() {
    this.checkStateId = setInterval(this.checkState.bind(this), 250);
    this.checkHighDefinitionId = setInterval(this.checkHighDefinition.bind(this), 3000);
  },
  checkState: function() {
    this.safe(function() {
      this.updatePlaybackType();
      this.updatePlayerVisibility();
      if (this.el.globoGetState() === "PLAYING_BUFFERING" && this.el.globoGetbufferLength() < 1 && this.currentState !== "PLAYING_BUFFERING") {
        this.trigger('playback:buffering', this.name);
        this.currentState = "PLAYING_BUFFERING";
      } else if (this.currentState === "PLAYING_BUFFERING" && this.el.globoGetState() === "PLAYING") {
        this.trigger('playback:bufferfull', this.name);
        this.currentState = "PLAYING";
      } else if (this.el.globoGetState() === "IDLE") {
        this.trigger('playback:ended', this.name);
        this.trigger('playback:timeupdate', 0, this.el.globoGetDuration(), this.name);
        clearInterval(this.checkStateId);
        this.currentState = "IDLE";
      }
    });
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
    this.safe(function() {
      if (!this.playbackType) {
        this.playbackType = this.el.globoGetType();
        if (this.playbackType) {
          this.playbackType = this.playbackType.toLowerCase();
          this.updateSettings();
        }
      }
    });
  },
  firstPlay: function() {
    this.safe(function() {
      this.el.globoPlayerLoad(this.src);
      this.el.globoPlayerPlay();
    });
  },
  volume: function(value) {
    this.safe(function() {
      this.el.globoPlayerVolume(value);
    });
  },
  pause: function() {
    this.safe(function() {
      this.el.globoPlayerPause();
    });
  },
  stop: function() {
    this.safe(function() {
      this.el.globoPlayerStop();
      clearInterval(this.checkStateId);
      this.trigger('playback:timeupdate', 0, this.name);
    })
  },
  isPlaying: function() {
    return this.safe(function() {
      if (this.el.globoGetState())
        return !!(this.el.globoGetState().match(/playing/i));
      return false;
    })
  },
  getDuration: function() {
    return this.safe(function() {
      return this.el.globoGetDuration();
    });
  },
  seek: function(time) {
    this.safe(function() {
      if (time < 0)
        this.el.globoPlayerSeek(time);
      else
        this.el.globoPlayerSeek(this.el.globoGetDuration() * time / 100);
      clearInterval(this.checkStateId);
      this.checkTimeId = this.updateTime(1000);
    });
  },
  isPip: function(pipStatus) {
    if (pipStatus == true && this.getCurrentBitrate() > 750000) {
      this.player.globoPlayerSmoothSetLevel(2);
    } else if (!this.player.globoGetAutoLevel()) {
      this.player.globoPlayerSetLevel(-1);
    }
  },
  timeUpdate: function(time, duration) {
    this.trigger('playback:timeupdate', time, duration, this.name);
  },
  destroy: function() {
    clearInterval(this.checkStateId);
    clearInterval(this.checkTimeId);
    clearInterval(this.checkHighDefinitionId);
    this.stopListening()
    this.$el.remove()
  },
  setupFirefox: function() {
    var $el = this.$('embed');
    $el.attr('data-hls-playback', '');
    this.setElement($el[0]);
  },
  setupIE: function() {
    this.setElement($(_.template(objectIE)({cid: this.cid, swfPath: this.swfPath})));
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
    } else if(window.ActiveXObject || navigator.userAgent.match(/Trident.*rv[ :]*11\./)) {
      this.setupIE();
    }
    this.$el.css({height: 0, width: 0});
    $(this.player).attr('data-hls', '');
    this.player.id = this.cid;
    return this;
  }
});

HLS.canPlay = function(resource) {
  return !!resource.match(/(.*).m3u8/);
}


module.exports = HLS;
