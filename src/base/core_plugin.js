var BaseObject = require('./base_object')
var extend = require('./utils').extend

class CorePlugin extends BaseObject {
  constructor(core) {
    super(core)
    this.core = core
  }

  getExternalInterface() { return {} }

  destroy() {}
}

CorePlugin.extend = function(properties) {
  return extend(CorePlugin, properties)
}

module.exports = CorePlugin
