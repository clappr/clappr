// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Kibo = require('../../base/kibo')

var BOLD = 'font-weight: bold; font-size: 13px;';
var INFO = 'color: #006600;' + BOLD;
var DEBUG = 'color: #0000ff;' + BOLD;
var WARN = 'color: #ff8000;' + BOLD;
var ERROR = 'color: #ff0000;' + BOLD;
var COLORS = {
  warn: WARN,
  info: INFO,
  debug: DEBUG,
  error: ERROR
}
var DEFAULT = '';

class Log {
  constructor() {
    this.kibo = new Kibo()
    this.kibo.down(['ctrl shift d'], () => this.onOff())
    this.BLACKLIST = ['timeupdate', 'playback:timeupdate', 'playback:progress', 'container:hover', 'container:timeupdate', 'container:progress'];
  }

  error(klass) {this.log(klass, 'error', Array.prototype.slice.call(arguments, 1))}
  info(klass) {this.log(klass, 'info', Array.prototype.slice.call(arguments, 1))}
  warn(klass) {this.log(klass, 'warn', Array.prototype.slice.call(arguments, 1))}
  debug(klass) {this.log(klass, 'debug', Array.prototype.slice.call(arguments, 1))}

  onOff() {
    window.DEBUG = !window.DEBUG
    if (window.DEBUG) { console.log('log enabled');  }
    else { console.log('log disabled'); }
  }

  log(klass, level, message) {
    if (!window.DEBUG || this.BLACKLIST.indexOf(message[0]) >= 0) return
    if (!message) {
      message = klass
      klass = null
    }
    var klassDescription = ""
    var color = COLORS[level]
    if (klass) {
      klassDescription = "[" + klass + "]"
    }
    console.log.apply(console, ["%c[" + level + "]" + klassDescription, color].concat(message));
  }
}

Log.getInstance = function() {
  if (this._instance === undefined) {
    this._instance = new this()
  }
  return this._instance
}

module.exports = Log
