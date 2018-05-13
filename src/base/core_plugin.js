import { extend } from './utils'
import BaseObject from './base_object'
import ErrorMixin from './error_mixin'

export default class CorePlugin extends BaseObject {
  get playerError() { return this.core.playerError }

  constructor(core) {
    super(core.options)
    this.core = core
    this.enabled = true
    this.bindEvents()
  }

  bindEvents() {}

  enable() {
    if (!this.enabled) {
      this.bindEvents()
      this.enabled = true
    }
  }

  disable() {
    if (this.enabled) {
      this.stopListening()
      this.enabled = false
    }
  }

  getExternalInterface() { return {} }

  destroy() {
    this.stopListening()
  }
}

Object.assign(CorePlugin.prototype, ErrorMixin)

CorePlugin.extend = function(properties) {
  return extend(CorePlugin, properties)
}

CorePlugin.type = 'core'
