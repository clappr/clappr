// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = require('./ui_object')

class UIContainerPlugin extends UIObject {
  constructor(options) {
    super(options)
    this.enabled = true
    this.bindEvents()
  }

  enable() {
    this.bindEvents()
    this.$el.show()
    this.enabled = true
  }

  disable() {
    this.stopListening()
    this.$el.hide()
    this.enabled = false
  }

  bindEvents() {}

  destroy() {
    this.remove()
  }
}

module.exports = UIContainerPlugin
