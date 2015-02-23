// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

require('mousetrap')

class Log {
  constructor() {
      Mousetrap.bind(['ctrl+shift+d'], () => this.onOff())
      this.BLACKLIST = ['playback:timeupdate', 'playback:progress', 'container:hover', 'container:timeupdate', 'container:progress'];
  }

  info(klass, message) {this.log(klass, 'info', message)}
  warn(klass, message) {this.log(klass, 'warn', message)}
  debug(klass, message) {this.log(klass, 'debug', message)}

  onOff() {
      window.DEBUG = !window.DEBUG
      if (window.DEBUG) { console.log('log enabled');  }
      else { console.log('log disabled'); }
    }

  log(klass, level, message) {
      if (!window.DEBUG || this.BLACKLIST.indexOf(message) >= 0) return
      var color
      if (level === 'warn') { color = '#FF8000' }
      else if (level === 'info') { color = '#006600' }
      else if (level === 'error') { color = '#FF0000'}
      console.log("%c [" + klass + "] [" + level + "] " +  message, 'color: '+color);
    }
}

Log.getInstance = function() {
  if (this._instance === undefined) {
      this._instance = new this()
    }
  return this._instance
}


module.exports = Log
