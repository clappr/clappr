import UICorePlugin from '../../base/ui_core_plugin'
import template from '../../base/template'
import Playback from '../../base/playback'
import Events from '../../base/events'
import dvrHTML from './public/index.html'
import './public/dvr_controls.scss'

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
    const mediaControl = this.core.mediaControl
    const container = mediaControl.container
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
    const useDvrControls = this.core.options.useDvrControls === undefined || !!this.core.options.useDvrControls
    return useDvrControls && this.core.getPlaybackType() === Playback.LIVE
  }

  render() {
    this.$el.html(this.template({
      live: this.core.i18n.t('live'),
      backToLive: this.core.i18n.t('back_to_live')
    }))
    this.$el.append(this.style)
    if (this.shouldRender()) {
      this.core.mediaControl.$el.addClass('live')
      this.core.mediaControl.$('.media-control-left-panel[data-media-control]').append(this.$el)
    }
    return this
  }
}
