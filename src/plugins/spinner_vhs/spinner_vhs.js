import SpinnerThreeBouncePlugin from '../spinner_three_bounce'
import Events from 'base/events'
import Styler from 'base/styler'
import template from 'base/template'
import spinnerHTML from './public/spinner.html'
import spinnerStyle from './public/spinner.scss'

export default class SpinnerVHS extends SpinnerThreeBouncePlugin {
  get name() { return 'spinner' }
  get attributes() {
    return {
      'data-spinner':'',
      'class': 'vhs-buffering-container'
    }
  }

  constructor(container) {
    super(container)
  }

  render() {
    this.$el.html(template(spinnerHTML)())
    const style = Styler.getStyleFor(spinnerStyle)
    this.container.$el.append(style)
    this.container.$el.append(this.$el)
    this.$el.hide()
    if (this.container.buffering) {
      this.onBuffering()
    }
    return this
  }
}
