var UIObject = require('./ui_object')

class UICorePlugin extends UIObject {
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
    this.$el.html(this.template())
    this.$el.append(this.styler.getStyleFor(this.name))
    this.core.$el.append(this.el)
    return this
  }
}

module.exports = UICorePlugin
