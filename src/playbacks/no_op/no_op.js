var Playback = require('../../base/playback')
var JST = require('../../base/jst')
var Styler = require('../../base/styler')

class NoOp extends Playback {
  get name() { return 'no_op' }
  get template() { return JST.no_op }
  get attributes() {
    return {'data-no-op': ''}
  }

  constructor(options) {
    super(options);
  }

  render() {
    var style = Styler.getStyleFor(this.name);
    this.$el.html(this.template())
    this.$el.append(style);
    return this
  }
}

NoOp.canPlay = (source) => {
  return true
}

module.exports = NoOp
