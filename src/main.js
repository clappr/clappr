// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('./base/base_object')
var CoreFactory = require('./components/core_factory')
var Loader = require('./components/loader')


class Player extends BaseObject {
  initialize(params) {
    window.p = this
    params.displayType || (params.displayType = 'pip')
    this.params = params
    this.loader = new Loader(this.params)
    this.coreFactory = new CoreFactory(this, this.loader)
  }

  attachTo(element) {
    this.params.parentElement = element
    this.core = this.coreFactory.create()
  }

  load(params) {
    this.core.load(params)
  }

  destroy() {
    this.core.destroy()
  }
}


global.DEBUG = true

window.WP3 = { Player: Player }

module.exports = window.WP3
