// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object');

class PlayerInfo extends BaseObject {
  constructor() {
    this.options = {}
    this.playbackPlugins = []
    this.currentSize = {width: 0, height: 0}
  }
}

PlayerInfo.getInstance = function() {
  if (this._instance === undefined) {
      this._instance = new this()
    }
  return this._instance
}

module.exports = PlayerInfo

