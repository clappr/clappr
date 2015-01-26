// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var _ = require('underscore')
var extend = require('./utils').extend
var Events = require('events')

var pluginOptions = ['container']

class BaseObject extends Events {
  constructor(options={}) {
    this.uniqueId = _.uniqueId('o')
    _.extend(this, _.pick(options, pluginOptions))
  }
}

BaseObject.extend = extend

module.exports = BaseObject
