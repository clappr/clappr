import CorePlugin from 'base/core_plugin'
import Events from 'base/events'
import $ from 'clappr-zepto'

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

  createIcon(charCode) {
    var canvas = $('<canvas/>')
    canvas[0].width = 32
    canvas[0].height = 32
    var ctx = canvas[0].getContext('2d')
    ctx.fillStyle = '#000'
    ctx.font = '25px Player'
    ctx.fillText(String.fromCharCode(charCode), 5, 26)
    var icon = $('<link rel="shortcut icon" type="image/png"/>')
    icon.attr('href', canvas[0].toDataURL('image/png'))
    return icon
  }

  setPlayIcon() {
    if (!this.playIcon) {
      this.playIcon = this.createIcon(0xe001)
    }
    this.changeIcon(this.playIcon)
  }

  setPauseIcon() {
    if (!this.pauseIcon) {
      this.pauseIcon = this.createIcon(0xe002)
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
