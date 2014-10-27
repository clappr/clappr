var UICorePlugin = require('../../base/ui_core_plugin')
var JST = require('../../base/jst')
var Styler = require('../../base/styler')

class DVRControls extends UICorePlugin {
  get template() { return JST.dvr_controls }
  get name() { return 'dvr_controls' }
  get events() {
    return {
      'click .live-button': 'click'
    }
  }
  get attributes() {
    return {
      'class': 'dvr-controls',
      'data-dvr-controls': '',
    }
  }

  constructor(core) {
    super(core)
    this.core = core
    this.settingsUpdate()
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl, 'mediacontrol:rendered', this.settingsUpdate)
    this.listenTo(this.core.mediaControl.container, 'container:dvr', this.dvrChanged)
  }

  dvrChanged(dvrEnabled) {
    this.settingsUpdate()
    this.core.mediaControl.$el.addClass('live')
    if (dvrEnabled) {
      this.core.mediaControl.$el.addClass('dvr')
      this.core.mediaControl.$el.find('.media-control-indicator[data-position], .media-control-indicator[data-duration]').hide()
    } else {
      this.core.mediaControl.$el.removeClass('dvr')
    }
  }

  click() {
    if (!this.core.mediaControl.container.isPlaying()) {
      this.core.mediaControl.container.play()
    }
    if (this.core.mediaControl.$el.hasClass('dvr')) {
      this.core.mediaControl.container.setCurrentTime(-1)
    }
  }

  settingsUpdate() {
    this.stopListening()
    if(this.shouldRender()) {
      this.render()
      this.$el.click(() => this.click())
    }
    this.bindEvents()
  }

  shouldRender() {
    var useDvrControls = this.core.options.useDvrControls === undefined || !!this.core.options.useDvrControls
    return useDvrControls && this.core.mediaControl.container.getPlaybackType() === 'live'
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template())
    this.$el.append(style)
    if (this.shouldRender()) {
      this.core.mediaControl.$el.addClass('live')
      this.core.mediaControl.$('.media-control-left-panel[data-media-control]').append(this.$el)
      if (this.$duration) {
        this.$duration.remove()
      }
      this.$duration = $('<span data-duration></span>')
      this.core.mediaControl.seekTime.$el.append(this.$duration)
    }
    return this
  }
}

module.exports = DVRControls
