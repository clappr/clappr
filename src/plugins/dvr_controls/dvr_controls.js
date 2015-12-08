import UICorePlugin from 'base/ui_core_plugin'
import template from 'base/template'
import Playback from 'base/playback'
import Styler from 'base/styler'
import Events from 'base/events'
import dvrStyle from './public/dvr_controls.scss'
import dvrHTML from './public/index.html'
import $ from 'clappr-zepto'

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
      'data-dvr-controls': '',
    }
  }

  constructor(core) {
    super(core)
    this.core = core
    this.settingsUpdate()
  }

  bindEvents() {
    this.listenToOnce(this.core.mediaControl.container, Events.CONTAINER_TIMEUPDATE, this.render)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.settingsUpdate)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.dvrChanged)
    this.listenTo(this.core, Events.CORE_OPTIONS_CHANGE, this.render)
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
      this.core.mediaControl.container.seek(-1)
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
      this.core.mediaControl.seekTime.showDuration()
    }
    else {
      this.core.mediaControl.seekTime.hideDuration()
    }
    return this
  }
}
