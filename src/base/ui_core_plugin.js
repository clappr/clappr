var UIObject = require('./ui_object')

class UICorePlugin extends UIObject {
  constructor(core) {
    super(core)
    this.core = core
    this.render()
  }

  getExternalInterface() { return {} }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template())
    this.$el.append(style)
    this.core.$el.append(this.el)
    return this
  }
}

module.exports = UICorePlugin
