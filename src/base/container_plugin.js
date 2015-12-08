import BaseObject from './base_object'
import {extend} from './utils'

/**
 * The base class for a container plugin
 * @class ContainerPlugin
 * @constructor
 * @extends UIObject
 * @module base
 */
export default class ContainerPlugin extends BaseObject {
  constructor(container) {
    super(container.options)
    this.container = container
    this.enabled = true
    this.bindEvents()
  }

  /**
   * provides the read-only options to the container plugin
   * @property options
   * @type Object
   * @default "`{}`"
   */
  get options() {return (this.container && this.container.options) || {}}

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

ContainerPlugin.extend = function(properties) {
  return extend(ContainerPlugin, properties)
}

ContainerPlugin.type = 'container'

