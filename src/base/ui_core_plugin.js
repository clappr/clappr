var UIObject = require('./ui_object')

class UICorePlugin extends UIObject {
  constructor(core) {
    super(core)
    this.core = core
    this.render()
  }

  getExternalInterface() { return {} }

  render() {
    this.$el.html(this.template())
    this.$el.append(this.styler.getStyleFor(this.name))
    this.core.$el.append(this.el)
    return this
  }
}

module.exports = UICorePlugin
