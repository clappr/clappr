import { Events, PlayerError, UICorePlugin, template, Styler } from '@clappr/core'

import reloadIcon from '../../icons/10-reload.svg'
import templateHtml from './public/error_screen.html'
import errorScreenStyle from './public/error_screen.scss'

export default class ErrorScreen extends UICorePlugin {
  get name() { return 'error_screen' }
  get supportedVersion() { return { min: CLAPPR_CORE_VERSION } }
  get template() { return template(templateHtml) }
  get container() { return this.core.getCurrentContainer() }
  get attributes() {
    return {
      'class': 'player-error-screen',
      'data-error-screen': ''
    }
  }

  constructor(core) {
    super(core)

    if (this.options.disableErrorScreen) return this.disable()
  }

  bindEvents() {
    this.listenTo(this.core, Events.ERROR, this.onError)
    this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, this.onContainerChanged)
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

    const style = Styler.getStyleFor(errorScreenStyle, { baseUrl: this.options.baseUrl })
    this.$el.html(this.template({
      title: this.err.UI.title,
      message: this.err.UI.message,
      code: this.err.code,
      icon: this.err.UI.icon || '',
      reloadIcon
    }))
    this.$el.append(style[0])

    this.core.$el.append(this.el)

    this.bindReload()

    return this
  }
}
