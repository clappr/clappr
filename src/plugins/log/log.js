// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Kibo = require('../../base/kibo')

var BOLD = 'font-weight: bold; font-size: 13px;';
var INFO = 'color: #006600;' + BOLD;
var DEBUG = 'color: #0000ff;' + BOLD;
var WARN = 'color: #ff8000;' + BOLD;
var ERROR = 'color: #ff0000;' + BOLD;

var LEVEL_DEBUG = 0
var LEVEL_INFO = 1
var LEVEL_WARN = 2
var LEVEL_ERROR = 3
var COLORS = {
  LEVEL_DEBUG: DEBUG,
  LEVEL_INFO: INFO,
  LEVEL_WARN: WARN,
  LEVEL_ERROR: ERROR
}
var DESCRIPTIONS = {
  LEVEL_DEBUG: 'debug',
  LEVEL_INFO: 'info',
  LEVEL_WARN: 'warn',
  LEVEL_ERROR: 'error'
}

class Log {
  constructor(level = LEVEL_WARN) {
    this.kibo = new Kibo()
    this.kibo.down(['ctrl shift d'], () => this.onOff())
    this.BLACKLIST = ['timeupdate', 'playback:timeupdate', 'playback:progress', 'container:hover', 'container:timeupdate', 'container:progress'];
    this.level = level
  }

  debug(klass) {this.log(klass, LEVEL_DEBUG, Array.prototype.slice.call(arguments, 1))}
  info(klass) {this.log(klass, LEVEL_INFO, Array.prototype.slice.call(arguments, 1))}
  warn(klass) {this.log(klass, LEVEL_WARN, Array.prototype.slice.call(arguments, 1))}
  error(klass) {this.log(klass, LEVEL_ERROR, Array.prototype.slice.call(arguments, 1))}

  onOff() {
    window.DEBUG = !window.DEBUG
    if (window.DEBUG) { console.log('log enabled');  }
    else { console.log('log disabled'); }
  }

  level(newLevel) {
    this.level = newLevel
  }

  log(klass, level, message) {
    if (!window.DEBUG || this.BLACKLIST.indexOf(message[0]) >= 0) return
    if (level < this.level) return

    if (!message) {
      message = klass
      klass = null
    }
    var klassDescription = ""
    var color = COLORS[level]
    if (klass) {
      klassDescription = "[" + klass + "]"
    }
    console.log.apply(console, ["%c[" + DESCRIPTIONS[level] + "]" + klassDescription, color].concat(message));
  }
}

Log.LEVEL_DEBUG = LEVEL_DEBUG
Log.LEVEL_INFO = LEVEL_INFO
Log.LEVEL_WARN = LEVEL_WARN
Log.LEVEL_ERROR = LEVEL_ERROR

Log.getInstance = function() {
  if (this._instance === undefined) {
    this._instance = new this()
  }
  return this._instance
}

module.exports = Log
