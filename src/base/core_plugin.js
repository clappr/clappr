var BaseObject = require('./base_object')
var extend = require('./utils').extend

class CorePlugin extends BaseObject {
  constructor(core) {
    super(core)
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

CorePlugin.extend = function(properties) {
  return extend(CorePlugin, properties)
}

module.exports = CorePlugin
