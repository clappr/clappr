// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { extend } from './utils'
import UIObject from './ui_object'
import ErrorMixin from './error_mixin'

/**
 * The base class for an ui container plugin
 * @class UIContainerPlugin
 * @constructor
 * @extends UIObject
 * @module base
 */
export default class UIContainerPlugin extends UIObject {
  get playerError() { return this.container.playerError }

  constructor(container) {
    super(container.options)
    this.container = container
    this.enabled = true
    this.bindEvents()
  }

  enable() {
    if (!this.enabled) {
      this.bindEvents()
      this.$el.show()
      this.enabled = true
    }
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

Object.assign(UIContainerPlugin.prototype, ErrorMixin)

UIContainerPlugin.extend = function(properties) {
  return extend(UIContainerPlugin, properties)
}

UIContainerPlugin.type = 'container'
