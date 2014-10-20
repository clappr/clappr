var BaseObject = require('./base_object')

class CorePlugin extends BaseObject {
  constructor(core) {
    super(core)
    this.core = core
  }

  getExternalInterface() { return {} }

  destroy() {}
}

module.exports = CorePlugin
