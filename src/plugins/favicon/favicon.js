import CorePlugin from 'base/core_plugin'
import Events from 'base/events'
import $ from 'clappr-zepto'

import playIcon from 'icons/01-play.svg'
import pauseIcon from 'icons/02-pause.svg'

export default class Favicon extends CorePlugin {
  get name() { return 'favicon' }

  constructor(core) {
    super(core)
    this.oldIcon = $('link[rel="shortcut icon"]')
    this.configure()
  }

  configure() {
    if (!this.core.options.changeFavicon && this.enabled) {
      this.disable()
      this.listenTo(this.core, Events.CORE_OPTIONS_CHANGE, this.configure)
    } else if (!this.enabled) {
      this.stopListening(this.core, Events.CORE_OPTIONS_CHANGE)
      this.enable()
    }
  }

  bindEvents() {
    this.listenTo(this.core, Events.CORE_OPTIONS_CHANGE, this.configure)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged)
    if (this.core.mediaControl.container) {
      this.containerChanged()
    }
  }

  containerChanged() {
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_PLAY, this.setPlayIcon)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_PAUSE, this.setPauseIcon)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_STOP, this.resetIcon)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_ENDED, this.resetIcon)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_ERROR, this.resetIcon)
  }

  disable() {
    super.disable()
    this.resetIcon()
  }

  createIcon(svg) {
    var canvas = $('<canvas/>')
    canvas[0].width = 16
    canvas[0].height = 16
    var ctx = canvas[0].getContext('2d')
    ctx.fillStyle = '#000'
    var d = $(svg).find('path').attr('d')
    var path = new Path2D(d)
    ctx.fill(path)
    var icon = $('<link rel="shortcut icon" type="image/png"/>')
    icon.attr('href', canvas[0].toDataURL('image/png'))
    return icon
  }

  setPlayIcon() {
    if (!this.playIcon) {
      this.playIcon = this.createIcon(playIcon)
    }
    this.changeIcon(this.playIcon)
  }

  setPauseIcon() {
    if (!this.pauseIcon) {
      this.pauseIcon = this.createIcon(pauseIcon)
    }
    this.changeIcon(this.pauseIcon)
  }

  resetIcon() {
    if (this.currentIcon) {
      this.currentIcon.remove()
    }
    $('head').append(this.oldIcon)
  }

  changeIcon(icon) {
    if (icon) {
      this.oldIcon.remove()
      if (this.currentIcon) {
        this.currentIcon.remove()
      }
      this.currentIcon = icon
      $('head').append(icon)
    }
  }
}
