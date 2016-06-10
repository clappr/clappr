import UICorePlugin from 'base/ui_core_plugin'
import template from 'base/template'
import Playback from 'base/playback'
import Styler from 'base/styler'
import Events from 'base/events'
import dvrStyle from './public/dvr_controls.scss'
import dvrHTML from './public/index.html'

export default class DVRControls extends UICorePlugin {
  get template() { return template(dvrHTML) }
  get name() { return 'dvr_controls' }
  get events() {
    return {
      'click .live-button': 'click'
    }
  }
  get attributes() {
    return {
      'class': 'dvr-controls',
      'data-dvr-controls': ''
    }
  }

  constructor(core) {
    super(core)
    this.core = core
    this.settingsUpdate()
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.settingsUpdate)
    this.listenTo(this.core, Events.CORE_OPTIONS_CHANGE, this.render)
    if (this.core.getCurrentContainer()) {
      this.listenToOnce(this.core.getCurrentContainer(), Events.CONTAINER_TIMEUPDATE, this.render)
      this.listenTo(this.core.getCurrentContainer(), Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.dvrChanged)
    }
  }

  containerChanged() {
    this.stopListening()
    this.bindEvents()
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
    var mediaControl = this.core.mediaControl
    var container = mediaControl.container
    if (!container.isPlaying()) {
      container.play()
    }
    if (mediaControl.$el.hasClass('dvr')) {
      container.seek(container.getDuration())
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
    return useDvrControls && this.core.getPlaybackType() === Playback.LIVE
  }

  render() {
    this.style = this.style || Styler.getStyleFor(dvrStyle, { baseUrl: this.core.options.baseUrl })
    this.$el.html(this.template())
    this.$el.append(this.style)
    if (this.shouldRender()) {
      this.core.mediaControl.$el.addClass('live')
      this.core.mediaControl.$('.media-control-left-panel[data-media-control]').append(this.$el)
    }
    return this
  }
}
