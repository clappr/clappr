// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {extend} from './utils'

import UIObject from './ui_object'

/**
 * The base class for an ui container plugin
 * @class UIContainerPlugin
 * @constructor
 * @extends UIObject
 * @module base
 */
export default class UIContainerPlugin extends UIObject {
  constructor(container) {
    super(container.options)
    this.container = container
    this.enabled = true
    this.bindEvents()
  }

  /**
   * provides the read-only options to the ui container plugin
   * @property options
   * @type Object
   * @default "`{}`"
   */
  get options() {return (this.container && this.container.options) || {}}

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

UIContainerPlugin.extend = function(properties) {
  return extend(UIContainerPlugin, properties)
}

UIContainerPlugin.type = 'container'
