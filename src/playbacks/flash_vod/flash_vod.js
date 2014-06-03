// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = require('../../base/ui_object');
var Styler = require('../../base/styler');
var JST = require('../../base/jst');
var _ = require("underscore");

var objectIE = '<object type="application/x-shockwave-flash" id="<%= cid %>" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" data-flash-vod=""><param name="movie" value="<%= swfPath %>"> <param name="quality" value="autohigh"> <param name="swliveconnect" value="true"> <param name="allowScriptAccess" value="always"> <param name="bgcolor" value="#001122"> <param name="allowFullScreen" value="false"> <param name="wmode" value="transparent"> <param name="tabindex" value="1"> </object>';

var FlashVOD = UIObject.extend({
  name: 'flash_vod',
  tagName: 'object',
  template: JST.flash_vod,
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
  safe: function(fn) {
    if(this.el.getState && this.el.getDuration && this.el.getPosition && this.el.getBytesLoaded && this.el.getBytesTotal) {
      return fn.apply(this);
    }
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
    }.bind(this), 500);
  },
  setupFirefox: function() {
    var $el = this.$('embed');
    $el.attr('data-flash-vod', '');
    this.setElement($el[0]);
  },
  getPlaybackType: function() {
    return "vod";
  },
  updateTime: function(interval) {
    return this.safe(function() {
      return setInterval(function() {
        this.trigger('playback:timeupdate', this.el.getPosition(), this.el.getDuration(), this.name);
      }.bind(this), interval);
    });
  },
  timedCheckState: function() {
    this.checkStateId = setInterval(this.checkState.bind(this), 250);
    this.progressId = setInterval(this.progress.bind(this), 1000);
  },
  checkState: function() {
    this.safe(function() {
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
    });
  },
  progress: function() {
    this.safe(function() {
      if (this.currentState !== "IDLE" && this.currentState !== "ENDED") {
        this.trigger('playback:progress', 0, this.el.getBytesLoaded(), this.el.getBytesTotal(), this.name);
      }
    });
  },
  firstPlay: function() {
    this.safe(function() {
      this.currentState = "PLAYING";
      this.el.playerPlay(this.src);
    });
  },
  play: function() {
    this.safe(function() {
      if(this.el.getState() === 'IDLE') {
        this.id = this.updateTime(1000);
      }
      if(this.el.getState() === 'PAUSED') {
        this.currentState = "PLAYING";
        this.el.playerResume();
      } else {
        this.firstPlay();
      }
      this.trigger('playback:play', this.name);
    });
  },
  volume: function(value) {
    this.safe(function() {
      this.el.playerVolume(value);
    });
  },
  pause: function() {
    this.safe(function() {
      this.currentState = "PAUSED";
      this.el.playerPause();
    });
  },
  stop: function() {
    this.safe(function() {
      this.el.playerStop();
      clearInterval(this.id);
      this.trigger('playback:timeupdate', 0, this.name);
    });
  },
  isPlaying: function() {
    return !!(this.isReady && this.currentState == "PLAYING");
  },
  getDuration: function() {
    return this.safe(function() {
      return this.el.getDuration();
    })
  },
  seek: function(time) {
    this.safe(function() {
      clearInterval(this.id);
      var seekTo = this.el.getDuration()* (time / 100);
      this.el.playerSeek(seekTo);
      this.trigger('playback:timeupdate', seekTo, this.el.getDuration(), this.name);
      this.id = this.updateTime(1000);
      if (this.currentState == "PAUSED") {
        this.pause();
      }
    })
  },
  destroy: function() {
    clearInterval(this.id);
    clearInterval(this.checkStateId);
    clearInterval(this.progressId);
    this.stopListening();
    this.$el.remove();
  },
  setupIE: function() {
    this.setElement($(_.template(objectIE)({cid: this.cid, swfPath: this.swfPath})));
  },
  render: function() {
    var style = Styler.getStyleFor(this.name);
    this.$el.html(this.template({cid: this.cid, swfPath: this.swfPath}));
    this.$el.append(style);
    if(navigator.userAgent.match(/firefox/i)) { //FIXME remove it from here
      this.setupFirefox();
    } else if(window.ActiveXObject) {
      this.setupIE();
    }
    return this;
  }
});

FlashVOD.canPlay = function(resource) {
  //http://help.adobe.com/en_US/flashmediaserver/techoverview/WS07865d390fac8e1f-4c43d6e71321ec235dd-7fff.html
  if (navigator.userAgent.match(/firefox/i) || window.ActiveXObject) {
    return _.isString(resource) && !!resource.match(/(.*).(mp4|mov|f4v|3gpp|3gp)/);
  } else {
    return _.isString(resource) && !!resource.match(/(.*).(mov|f4v|3gpp|3gp)/);
  }
}

module.exports = FlashVOD;
