// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var assign = require('lodash.assign')
var Browser = require('../components/browser')

var extend = function(parent, properties) {
  var constructor = function() {
    parent.prototype.constructor.apply(this, arguments)
    if (properties.constructor) {
      properties.constructor.apply(this, arguments)
    }
  }
  constructor.prototype = Object.create(parent.prototype)
  assign(constructor.prototype, properties)
  return constructor
}

var formatTime = function(time) {
    if (!isFinite(time)) {
      return "--:--"
    }
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
    return (
      document.webkitFullscreenElement ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      !!document.msFullscreenElement
    )
  },
  requestFullscreen: function(el) {
    if(el.requestFullscreen) {
      el.requestFullscreen()
    } else if(el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen()
    } else if(el.mozRequestFullScreen) {
      el.mozRequestFullScreen()
    } else if(el.msRequestFullscreen) {
      el.msRequestFullscreen()
    } else if (el.querySelector && el.querySelector("video") && el.querySelector("video").webkitEnterFullScreen) {
      el.querySelector("video").webkitEnterFullScreen()
    }
  },
  cancelFullscreen: function() {
    if(document.exitFullscreen) {
      document.exitFullscreen()
    } else if(document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen()
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if(document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

class Config {

  static _defaultConfig() {
    return {
      volume: {
        value: 100,
        parse: parseInt
      }
    }
  }

  static _defaultValueFor(key) {
    try {
      return this._defaultConfig()[key]['parse'](this._defaultConfig()[key]['value'])
    } catch(e) {
      return undefined
    }
  }

  static _create_keyspace(key){
    return 'clappr.' + document.domain + '.' + key
  }

  static restore(key) {
    if (Browser.hasLocalstorage && localStorage[this._create_keyspace(key)]){
      return this._defaultConfig()[key]['parse'](localStorage[this._create_keyspace(key)])
    }
    return this._defaultValueFor(key)
  }

  static persist(key, value) {
    if (Browser.hasLocalstorage) {
      try {
        localStorage[this._create_keyspace(key)] = value
        return true
      } catch(e) {
        return false
      }
    }
  }
}

var seekStringToSeconds = function(url) {
  var parts = url.match(/t=([0-9]*)(&|\/|$)/);
  if (parts && parts.length > 0) {
    return parseInt(parts[1], 10);
  } else {
    var seconds = 0;
    var factor = {'h': 3600, 'm': 60, 's': 1};
    parts = url.match(/[0-9]+[hms]+/g) || [];
    parts.forEach(function(el) {
      if (el) {
        var suffix = el[el.length - 1];
        var time = parseInt(el.slice(0, el.length - 1), 10);
        seconds += time * (factor[suffix]);
      }
    });
    return seconds;
   }
}

var idsCounter = {}

var uniqueId = function(prefix) {
  idsCounter[prefix] || (idsCounter[prefix] = 0)
  var id = ++idsCounter[prefix]
  return prefix + id
}

var isNumber = function(value) {
  return value - parseFloat(value) + 1 >= 0
}

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            (fn) => window.setTimeout(fn, 1000/60)

var cancelAnimationFrame = window.cancelAnimationFrame ||
                           window.mozCancelAnimationFrame ||
                           window.webkitCancelAnimationFrame ||
                           window.clearTimeout

module.exports = {
  extend: extend,
  formatTime: formatTime,
  Fullscreen: Fullscreen,
  Config: Config,
  seekStringToSeconds: seekStringToSeconds,
  uniqueId: uniqueId,
  isNumber: isNumber,
  requestAnimationFrame: requestAnimationFrame,
  cancelAnimationFrame: cancelAnimationFrame
}
