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
    this.listenTo(this.core.mediaControl, 'mediacontrol:containerchanged', this.settingsUpdate)
    this.listenTo(this.core.mediaControl.container, 'container:settingsupdate', this.settingsUpdate)
    this.listenTo(this.core.mediaControl.container, 'container:dvr', this.dvrChanged)
  }

  dvrChanged(dvrEnabled) {
    this.settingsUpdate()
    this.core.mediaControl.$el.addClass('live')
    if (dvrEnabled) {
      this.core.mediaControl.$el.addClass('dvr')
    } else {
      this.core.mediaControl.$el.removeClass('dvr')
    }
  }

  click() {
    this.core.mediaControl.container.setCurrentTime(-1)
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
    var settings = this.core.mediaControl.settings
    var useDvrControls = this.core.options.useDvrControls === undefined || !!this.core.options.useDvrControls
    return useDvrControls && this.core.mediaControl.container.getPlaybackType() === 'live'
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template())
    this.$el.append(style)
    this.core.mediaControl.$el.addClass('live')
    this.core.mediaControl.$('.media-control-left-panel[data-media-control]').append(this.$el)
    return this
  }
}

module.exports = DVRControls
