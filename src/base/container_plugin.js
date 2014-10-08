var BaseObject = require('./base_object')

class ContainerPlugin extends BaseObject {
  constructor(options) {
    super(options)
    this.bindEvents()
  }

  enable() {
    this.bindEvents()
  }

  disable() {
    this.stopListening()
  }

  bindEvents() {}
}

