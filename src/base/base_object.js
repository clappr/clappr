// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var _ = require('underscore')
var extend = require('./utils').extend
var Events = require('./events')

var pluginOptions = ['container']

class BaseObject extends Events {
  constructor(options) {
    options || (options = {})
    _.extend(this, _.pick(options, pluginOptions))
    if (this.initialize) {
      this.initialize.apply(this, arguments)
    }
  }
}

BaseObject.extend = extend

module.exports = BaseObject
