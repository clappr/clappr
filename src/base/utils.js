// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
/*jshint -W079 */

import './polyfills'
import Browser from '../components/browser'
import $ from 'clappr-zepto'

function assign(obj, source) {
  if (source) {
    for (const prop in source) {
      const propDescriptor = Object.getOwnPropertyDescriptor(source, prop)
      propDescriptor ? Object.defineProperty(obj, prop, propDescriptor) : obj[prop] = source[prop]
    }
  }
  return obj
}

export function extend(parent, properties) {
  class Surrogate extends parent {
    constructor(...args) {
      super(...args)
      if (properties.initialize)
        properties.initialize.apply(this, args)

    }
  }
  assign(Surrogate.prototype, properties)
  return Surrogate
}

export function formatTime(time, paddedHours) {
  if (!isFinite(time))
    return '--:--'

  time = time * 1000
  time = parseInt(time/1000)
  const seconds = time % 60
  time = parseInt(time/60)
  const minutes = time % 60
  time = parseInt(time/60)
  const hours = time % 24
  const days = parseInt(time/24)
  let out = ''
  if (days && days > 0) {
    out += days + ':'
    if (hours < 1) out += '00:'
  }
  if (hours && hours > 0 || paddedHours) out += ('0' + hours).slice(-2) + ':'
  out += ('0' + minutes).slice(-2) + ':'
  out += ('0' + seconds).slice(-2)
  return out.trim()
}

export const Fullscreen = {
  isFullscreen: function() {
    return !!(
      document.webkitFullscreenElement ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement
    )
  },
  requestFullscreen: function(el) {
    if(el.requestFullscreen)
      el.requestFullscreen()
    else if(el.webkitRequestFullscreen)
      el.webkitRequestFullscreen()
    else if(el.mozRequestFullScreen)
      el.mozRequestFullScreen()
    else if(el.msRequestFullscreen)
      el.msRequestFullscreen()
    else if (el.querySelector && el.querySelector('video') && el.querySelector('video').webkitEnterFullScreen)
      el.querySelector('video').webkitEnterFullScreen()
    else if (el.webkitEnterFullScreen)
      el.webkitEnterFullScreen()

  },
  cancelFullscreen: function(el=document) {
    if(el.exitFullscreen)
      el.exitFullscreen()
    else if(el.webkitCancelFullScreen)
      el.webkitCancelFullScreen()
    else if(el.webkitExitFullscreen)
      el.webkitExitFullscreen()
    else if(el.mozCancelFullScreen)
      el.mozCancelFullScreen()
    else if(el.msExitFullscreen)
      el.msExitFullscreen()

  },
  fullscreenEnabled: function() {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    )
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
    if (Browser.hasLocalstorage && localStorage[this._createKeyspace(key)])
      return this._defaultConfig()[key].parse(localStorage[this._createKeyspace(key)])

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
    const query = window.location.search.substring(1)
    if (query !== this.query) {
      this._urlParams = this.parse(query)
      this.query = query
    }
    return this._urlParams
  }

  static get hashParams() {
    const hash = window.location.hash.substring(1)
    if (hash !== this.hash) {
      this._hashParams = this.parse(hash)
      this.hash = hash
    }
    return this._hashParams
  }

  static parse(paramsString) {
    let match
    const pl = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = (s) => decodeURIComponent(s.replace(pl, ' ')),
      params = {}
    while (match = search.exec(paramsString)) { // eslint-disable-line no-cond-assign
      params[decode(match[1]).toLowerCase()] = decode(match[2])
    }
    return params
  }
}

export function seekStringToSeconds(paramName = 't') {
  let seconds = 0
  const seekString = QueryString.params[paramName] || QueryString.hashParams[paramName] || ''
  const parts = seekString.match(/[0-9]+[hms]+/g) || []
  if (parts.length > 0) {
    const factor = { 'h': 3600, 'm': 60, 's': 1 }
    parts.forEach(function(el) {
      if (el) {
        const suffix = el[el.length - 1]
        const time = parseInt(el.slice(0, el.length - 1), 10)
        seconds += time * (factor[suffix])
      }
    })
  } else if (seekString)
    seconds = parseInt(seekString, 10)

  return seconds
}

const idsCounter = {}

export function uniqueId(prefix) {
  idsCounter[prefix] || (idsCounter[prefix] = 0)
  const id = ++idsCounter[prefix]
  return prefix + id
}

export function isNumber(value) {
  return value - parseFloat(value) + 1 >= 0
}

export function currentScriptUrl() {
  const scripts = document.getElementsByTagName('script')
  return scripts.length ? scripts[scripts.length - 1].src : ''
}

export const requestAnimationFrame = (window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            function(fn) { window.setTimeout(fn, 1000/60) }).bind(window)

export const cancelAnimationFrame = (window.cancelAnimationFrame ||
                           window.mozCancelAnimationFrame ||
                           window.webkitCancelAnimationFrame ||
                           window.clearTimeout).bind(window)

export function getBrowserLanguage() {
  return window.navigator && window.navigator.language
}

export function now() {
  if (window.performance && window.performance.now)
    return performance.now()

  return Date.now()
}

// remove the item from the array if it exists in the array
export function removeArrayItem(arr, item) {
  const i = arr.indexOf(item)
  if (i >= 0)
    arr.splice(i, 1)

}

// Simple Zepto element factory with video recycle feature.
const videoStack = []

export class DomRecycler {
  static configure(options) {
    this.options = $.extend(this.options, options)
  }

  static create(name) {
    if (this.options.recycleVideo && name === 'video' && videoStack.length > 0)
      return videoStack.shift()

    return $('<' + name + '>')
  }

  static garbage($el) {
    // Expect Zepto collection with single element (does not iterate!)
    if (!this.options.recycleVideo || $el[0].tagName.toUpperCase() !== 'VIDEO') return
    $el.children().remove()
    videoStack.push($el)
  }
}

DomRecycler.options = { recycleVideo: false }

export default {
  Config,
  Fullscreen,
  QueryString,
  DomRecycler,
  extend,
  formatTime,
  seekStringToSeconds,
  uniqueId,
  currentScriptUrl,
  isNumber,
  requestAnimationFrame,
  cancelAnimationFrame,
  getBrowserLanguage,
  now,
  removeArrayItem
}
