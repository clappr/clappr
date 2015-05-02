var BaseObject = require('./base_object')
var extend = require('./utils').extend

class ContainerPlugin extends BaseObject {
  constructor(options) {
    super(options)
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

ContainerPlugin.extend = function(properties) {
  return extend(ContainerPlugin, properties)
}

module.exports = ContainerPlugin
