import {extend} from './utils'
import UIObject from './ui_object'

export default class UICorePlugin extends UIObject {
  constructor(core) {
    super(core)
    this.core = core
    this.enabled = true
    this.bindEvents()
    this.render()
  }

  bindEvents() {}

  getExternalInterface() { return {} }

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

  destroy() {
    this.remove()
  }

  render() {
    return this
  }
}

UICorePlugin.extend = function(properties) {
  return extend(UICorePlugin, properties)
}

UICorePlugin.type = 'core'
