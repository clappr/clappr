import Events from '../../base/events'
import UICorePlugin from '../../base/ui_core_plugin'
import template from '../../base/template'
import PlayerError from '../../components/error/'

import reloadIcon from '../../icons/10-reload.svg'
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

  bindReload() {
    this.reloadButton = this.$el.find('.player-error-screen__reload')
    this.reloadButton && this.reloadButton.on('click', this.reload.bind(this))
  }

  reload() {
    this.listenToOnce(this.core, Events.CORE_READY, () => this.container.play())
    this.core.load(this.options.sources, this.options.mimeType)
    this.unbindReload()
  }

  unbindReload() {
    this.reloadButton && this.reloadButton.off('click')
  }

  onContainerChanged() {
    this.err = null
    this.unbindReload()
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
      icon: this.err.UI.icon || '',
      reloadIcon,
    }))

    this.core.$el.append(this.el)

    this.bindReload()

    return this
  }
}
