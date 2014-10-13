// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var _ = require('underscore');

var extend = function(protoProps, staticProps) {
  var parent = this;
  var child;

  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  _.extend(child, parent, staticProps);

  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  if (protoProps) _.extend(child.prototype, protoProps);

  child.__super__ = parent.prototype;

  child.super = function(name) {
    return parent.prototype[name];
  };

  child.prototype.getClass = function() {
    return child;
  }

  return child;
};

var formatTime = function(time) {
    time = time * 1000
    time = parseInt(time/1000)
    var seconds = time % 60
    time = parseInt(time/60)
    var minutes = time % 60
    time = parseInt(time/60)
    var hours = time % 24
    var out = ""
    if (hours && hours > 0) out += ("0" + hours).slice(-2) + ":"
    out += ("0" + minutes).slice(-2) + ":"
    out += ("0" + seconds).slice(-2)
    return out.trim()
}

var Fullscreen = {
  isFullscreen: function() {
    return document.webkitIsFullScreen || document.mozFullScreen || !!document.msFullscreenElement;
  },
  requestFullscreen: function(el) {
    if(el.requestFullscreen) {
      el.requestFullscreen();
    } else if(el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if(el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if(el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  },
  cancelFullscreen: function() {
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if(document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if(document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};

module.exports = {
  extend: extend,
  formatTime: formatTime,
  Fullscreen: Fullscreen,
};
