// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = require('./ui_object')
var _ = require('underscore')

class UIContainerPlugin extends UIObject {
  constructor(options) {
    super(options)
    this.bindEvents()
  }

  enable() {
    this.bindEvents()
    this.$el.show()
  }

  disable() {
    this.stopListening()
    this.$el.hide()
  }

  bindEvents() {}
}

module.exports = UIContainerPlugin
