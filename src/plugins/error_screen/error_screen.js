import Events from '../../base/events'
import UICorePlugin from '../../base/ui_core_plugin'
import template from '../../base/template'
import PlayerError from '../../components/error/'

import templateHtml from './public/error_screen.html'
import './public/error_screen.scss'

export default class ErrorScreen extends UICorePlugin {
  get name() { return 'error_screen' }
  get template() { return template(templateHtml) }
  get container() { return this.core.getCurrentContainer() }
  get attributes() {
    return {
      'class': 'player-error-screen',
      'data-error-screen': '',
    }
  }

  bindEvents() {
    this.listenTo(this.core, Events.ERROR, this.onError)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.onContainerChanged)
  }

  onContainerChanged() {
    this.err = null
    this.hide()
  }

  onError(err = {}) {
    if (err.level === PlayerError.Levels.FATAL) {
      this.err = err
      this.container.disableMediaControl()
      this.container.stop()
      this.show()
    }
  }

  show() {
    this.render()
    this.$el.show()
  }

  hide() {
    this.$el.hide()
  }

  render() {
    if (!this.err) return

    this.$el.html(this.template({
      title: this.err.UI.title,
      message: this.err.UI.message,
      code: this.err.code,
      icon: this.err.UI.icon || ''
    }))

    this.core.$el.append(this.el)

    return this
  }
}
