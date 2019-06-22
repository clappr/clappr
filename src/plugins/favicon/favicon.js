import { CorePlugin, Events, $ } from 'clappr'

import playIcon from '../../icons/01-play.svg'
import pauseIcon from '../../icons/02-pause.svg'

const oldIcon = $('link[rel="shortcut icon"]')

export default class Favicon extends CorePlugin {
  get name() { return 'favicon' }
  get oldIcon() { return oldIcon }

  constructor(core) {
    super(core)
    this._container = null
    this.configure()
  }

  configure() {
    if (this.core.options.changeFavicon) {
      if (!this.enabled) {
        this.stopListening(this.core, Events.CORE_OPTIONS_CHANGE)
        this.enable()
      }
    } else if (this.enabled) {
      this.disable()
      this.listenTo(this.core, Events.CORE_OPTIONS_CHANGE, this.configure)
    }
  }

  bindEvents() {
    this.listenTo(this.core, Events.CORE_OPTIONS_CHANGE, this.configure)
    this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, this.containerChanged)
    this.core.activeContainer && this.containerChanged()
  }

  containerChanged() {
    this._container && this.stopListening(this._container)
    this._container = this.core.activeContainer
    this.listenTo(this._container, Events.CONTAINER_PLAY, this.setPlayIcon)
    this.listenTo(this._container, Events.CONTAINER_PAUSE, this.setPauseIcon)
    this.listenTo(this._container, Events.CONTAINER_STOP, this.resetIcon)
    this.listenTo(this._container, Events.CONTAINER_ENDED, this.resetIcon)
    this.listenTo(this._container, Events.CONTAINER_ERROR, this.resetIcon)
    this.resetIcon()
  }

  disable() {
    super.disable()
    this.resetIcon()
  }

  destroy() {
    super.destroy()
    this.resetIcon()
  }

  createIcon(svg) {
    const canvas = $('<canvas/>')
    canvas[0].width = 16
    canvas[0].height = 16
    const ctx = canvas[0].getContext('2d')
    ctx.fillStyle = '#000'
    const d = $(svg).find('path').attr('d')
    const path = new Path2D(d)
    ctx.fill(path)
    const icon = $('<link rel="shortcut icon" type="image/png"/>')
    icon.attr('href', canvas[0].toDataURL('image/png'))
    return icon
  }

  setPlayIcon() {
    if (!this.playIcon)
      this.playIcon = this.createIcon(playIcon)

    this.changeIcon(this.playIcon)
  }

  setPauseIcon() {
    if (!this.pauseIcon)
      this.pauseIcon = this.createIcon(pauseIcon)

    this.changeIcon(this.pauseIcon)
  }

  resetIcon() {
    $('link[rel="shortcut icon"]').remove()
    $('head').append(this.oldIcon)
  }

  changeIcon(icon) {
    if (icon) {
      $('link[rel="shortcut icon"]').remove()
      $('head').append(icon)
    }
  }
}
