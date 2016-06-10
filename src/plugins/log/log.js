
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {Kibo} from 'vendor'

var BOLD = 'font-weight: bold; font-size: 13px;'
var INFO = 'color: #006600;' + BOLD
var DEBUG = 'color: #0000ff;' + BOLD
var WARN = 'color: #ff8000;' + BOLD
var ERROR = 'color: #ff0000;' + BOLD

var LEVEL_DEBUG = 0
var LEVEL_INFO = 1
var LEVEL_WARN = 2
var LEVEL_ERROR = 3
var LEVEL_DISABLED = LEVEL_ERROR

var COLORS = [DEBUG, INFO, WARN, ERROR, ERROR]
var DESCRIPTIONS = ['debug', 'info', 'warn', 'error', 'disabled']

export default class Log {
  constructor(level = LEVEL_INFO, offLevel = LEVEL_DISABLED) {
    this.kibo = new Kibo()
    this.kibo.down(['ctrl shift d'], () => this.onOff())
    this.BLACKLIST = ['timeupdate', 'playback:timeupdate', 'playback:progress', 'container:hover', 'container:timeupdate', 'container:progress']
    this.level = level
    this.offLevel = offLevel
  }

  debug(klass) {this.log(klass, LEVEL_DEBUG, Array.prototype.slice.call(arguments, 1))}
  info(klass) {this.log(klass, LEVEL_INFO, Array.prototype.slice.call(arguments, 1))}
  warn(klass) {this.log(klass, LEVEL_WARN, Array.prototype.slice.call(arguments, 1))}
  error(klass) {this.log(klass, LEVEL_ERROR, Array.prototype.slice.call(arguments, 1))}

  onOff() {
    if (this.level === this.offLevel) {
      this.level = this.previousLevel
    } else {
      this.previousLevel = this.level
      this.level = this.offLevel
    }
    // handle instances where console.log is unavailable
    if (window.console && window.console.log) {
      window.console.log('%c[Clappr.Log] set log level to ' + DESCRIPTIONS[this.level], WARN)
    }
  }

  level(newLevel) {
    this.level = newLevel
  }

  log(klass, level, message) {
    if (this.BLACKLIST.indexOf(message[0]) >= 0) return
    if (level < this.level) return

    if (!message) {
      message = klass
      klass = null
    }
    var klassDescription = ''
    var color = COLORS[level]
    if (klass) {
      klassDescription = '[' + klass + ']'
    }
    if (window.console && window.console.log) {
      window.console.log.apply(console, ['%c[' + DESCRIPTIONS[level] + ']' + klassDescription, color].concat(message))
    }
  }
}

Log.LEVEL_DEBUG = LEVEL_DEBUG
Log.LEVEL_INFO = LEVEL_INFO
Log.LEVEL_WARN = LEVEL_WARN
Log.LEVEL_ERROR = LEVEL_ERROR

Log.getInstance = function() {
  if (this._instance === undefined) {
    this._instance = new this()
    this._instance.previousLevel = this._instance.level
    this._instance.level = this._instance.offLevel
  }
  return this._instance
}

Log.setLevel = function(level) { this.getInstance().level = level }

Log.debug = function() { this.getInstance().debug.apply(this.getInstance(), arguments) }
Log.info = function() { this.getInstance().info.apply(this.getInstance(), arguments) }
Log.warn = function() { this.getInstance().warn.apply(this.getInstance(), arguments) }
Log.error = function() { this.getInstance().error.apply(this.getInstance(), arguments) }
