// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var _ = require('underscore');
var $ = require('jquery');

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

var zeroPad = function(number, size) {
  return (new Array(size + 1 - number.toString().length)).join('0') + number;
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

var HEX_TAB = "0123456789abcdef";
var B64_TAB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var b64pad = "";

var rstr2b64 = function(input) {
  var output = "";
  var len = input.length;
  for (var i = 0; i < len; i += 3) {
    var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8: 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += B64_TAB.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
    }
  }
  return output;
};

var rstr2hex = function(input) {
  var output = "";

  for (var i = 0; i < input.length; i++) {
    var x = input.charCodeAt(i);
    output += HEX_TAB.charAt((x >>> 4) & 0x0F) +  HEX_TAB.charAt(x & 0x0F);
  }

  return output;
};

var getHostname = function() {
  return location.hostname;
};

var Ajax = {
  jsonp: function(settings) {
    var defer = new $.Deferred();
    settings.callbackName = settings.callbackName || "json_callback";
    settings.timeout = settings.timeout || 15000;

    window[settings.callbackName] = function (data) {
      if (!Ajax.isErrorObject(data)) {
        defer.resolve(data);
      } else {
        defer.reject(data);
      }
    };

    var head = $("head")[0];
    var script = document.createElement("script");
    script.setAttribute("src", settings.url);
    script.setAttribute("async", "async");

    script.onload = script.onreadystatechange = function(eventLoad) {
      if (!script.readyState || /loaded|complete/.test(script.readyState)) {

        if (settings.timeoutId) {
          window.clearTimeout(settings.timeoutId);
        }

        // Handling memory leak in IE, removing and dereference the script
        script.onload = script.onreadystatechange = null;
        if (head && script.parentNode) head.removeChild(script);
        script = undefined;
      }
    };

    // Use insertBefore instead of appendChild to circumvent an IE6 bug.
    head.insertBefore(script, head.firstChild);

    if (settings.error) {
      settings.timeoutId = window.setTimeout(settings.error, settings.timeout);
    }

    return defer.promise();
  },

  isErrorObject: function (data) {
    return data && data.http_status_code && data.http_status_code != 200;
  }
};

module.exports = {
  extend: extend,
  zeroPad: zeroPad,
  formatTime: formatTime,
  Fullscreen: Fullscreen,
  Ajax: Ajax,
  rstr2b64: rstr2b64,
  rstr2hex: rstr2hex,
  getHostname: getHostname
};
