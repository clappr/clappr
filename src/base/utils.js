// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
/*jshint -W079 */

import Browser from 'components/browser'

function assign(obj, source) {
  if (source) {
    for (var prop in source) {
      var propDescriptor = Object.getOwnPropertyDescriptor(source, prop)
      propDescriptor ? Object.defineProperty(obj, prop, propDescriptor) : obj[prop] = source[prop]
    }
  }
  return obj
}

export function extend(parent, properties) {
  class Surrogate extends parent {
    constructor(...args) {
      super(...args)
      if (properties.initialize) {
        properties.initialize.apply(this, args)
      }
    }
  }
  assign(Surrogate.prototype, properties)
  return Surrogate
}

export function formatTime(time, paddedHours) {
  if (!isFinite(time)) {
    return '--:--'
  }
  time = time * 1000
  time = parseInt(time/1000)
  var seconds = time % 60
  time = parseInt(time/60)
  var minutes = time % 60
  time = parseInt(time/60)
  var hours = time % 24
  var days = parseInt(time/24)
  var out = ''
  if (days && days > 0) {
    out += days + ':'
    if (hours < 1) {out += '00:'}
  }
  if (hours && hours > 0 || paddedHours) {out += ('0' + hours).slice(-2) + ':'}
  out += ('0' + minutes).slice(-2) + ':'
  out += ('0' + seconds).slice(-2)
  return out.trim()
}

export var Fullscreen = {
  isFullscreen: function() {
    return !!(
      document.webkitFullscreenElement ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement
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
    } else if (el.querySelector && el.querySelector('video') && el.querySelector('video').webkitEnterFullScreen) {
      el.querySelector('video').webkitEnterFullScreen()
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

export class Config {

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
      return this._defaultConfig()[key].parse(this._defaultConfig()[key].value)
    } catch(e) {
      return undefined
    }
  }

  static _createKeyspace(key){
    return `clappr.${document.domain}.${key}`
  }

  static restore(key) {
    if (Browser.hasLocalstorage && localStorage[this._createKeyspace(key)]){
      return this._defaultConfig()[key].parse(localStorage[this._createKeyspace(key)])
    }
    return this._defaultValueFor(key)
  }

  static persist(key, value) {
    if (Browser.hasLocalstorage) {
      try {
        localStorage[this._createKeyspace(key)] = value
        return true
      } catch(e) {
        return false
      }
    }
  }
}

export class QueryString {
  static get params() {
    var query = window.location.search.substring(1)
    if (query !== this.query) {
      this._urlParams = this.parse(query)
      this.query = query
    }
    return this._urlParams
  }

  static get hashParams() {
    var hash = window.location.hash.substring(1)
    if (hash !== this.hash) {
      this._hashParams = this.parse(hash)
      this.hash = hash
    }
    return this._hashParams
  }

  static parse(paramsString) {
    var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = (s) => decodeURIComponent(s.replace(pl, ' '))
    var params = {}
    while (match = search.exec(paramsString)) { // eslint-disable-line no-cond-assign
      params[decode(match[1]).toLowerCase()] = decode(match[2])
    }
    return params
  }
}

export function seekStringToSeconds(paramName = 't') {
  var seconds = 0
  var seekString = QueryString.params[paramName] || QueryString.hashParams[paramName] || ''
  var parts = seekString.match(/[0-9]+[hms]+/g) || []
  if (parts.length > 0) {
    var factor = {'h': 3600, 'm': 60, 's': 1}
    parts.forEach(function(el) {
      if (el) {
        var suffix = el[el.length - 1]
        var time = parseInt(el.slice(0, el.length - 1), 10)
        seconds += time * (factor[suffix])
      }
    })
  } else if (seekString) {
    seconds = parseInt(seekString, 10)
  }
  return seconds
}

var idsCounter = {}

export function uniqueId(prefix) {
  idsCounter[prefix] || (idsCounter[prefix] = 0)
  var id = ++idsCounter[prefix]
  return prefix + id
}

export function isNumber(value) {
  return value - parseFloat(value) + 1 >= 0
}

export function currentScriptUrl() {
  var scripts = document.getElementsByTagName('script')
  return scripts[scripts.length - 1].src
}

export var requestAnimationFrame = (window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            function(fn) { window.setTimeout(fn, 1000/60) }).bind(window)

export var cancelAnimationFrame = (window.cancelAnimationFrame ||
                           window.mozCancelAnimationFrame ||
                           window.webkitCancelAnimationFrame ||
                           window.clearTimeout).bind(window)

export function getBrowserLanguage() {
  if (window.navigator && window.navigator.language) {
    return window.navigator.language.toLowerCase()
  }
  return null
}

export default {
  Config,
  Fullscreen,
  QueryString,
  extend,
  formatTime,
  seekStringToSeconds,
  uniqueId,
  currentScriptUrl,
  isNumber,
  requestAnimationFrame,
  cancelAnimationFrame,
  getBrowserLanguage
}
