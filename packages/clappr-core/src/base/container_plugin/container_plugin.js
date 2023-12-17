import BaseObject from '@/base/base_object'
import ErrorMixin from '@/base/error_mixin'
import { extend } from '@/utils'

/**
 * The base class for a container plugin
 * @class ContainerPlugin
 * @constructor
 * @extends BaseObject
 * @module base
 */
export default class ContainerPlugin extends BaseObject {
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
      this.enabled = true
    }
  }

  disable() {
    if (this.enabled) {
      this.stopListening()
      this.enabled = false
    }
  }

  bindEvents() {}

  destroy() {
    this.stopListening()
  }
}

Object.assign(ContainerPlugin.prototype, ErrorMixin)

ContainerPlugin.extend = function(properties) {
  return extend(ContainerPlugin, properties)
}

ContainerPlugin.type = 'container'
