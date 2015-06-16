// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var uniqueId = require('./utils').uniqueId
var Events = require('./events')

class BaseObject extends Events {
  constructor(options={}) {
    this.uniqueId = uniqueId('o')
  }
}

module.exports = BaseObject
