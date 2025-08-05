import { extend } from '../../utils/utils'
import UIObject from '../ui_object/ui_object'
import ErrorMixin from '../error_mixin/error_mixin'

export default class UICorePlugin extends UIObject {
  get playerError() { return this.core.playerError }

  constructor(core) {
    super(core.options)
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

  render() {
    return this
  }
}

Object.assign(UICorePlugin.prototype, ErrorMixin)

UICorePlugin.extend = function (properties) {
  return extend(UICorePlugin, properties)
}

UICorePlugin.type = 'core'
