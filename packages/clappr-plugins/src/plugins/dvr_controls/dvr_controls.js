import { Events, Playback, UICorePlugin, template, Styler } from '@clappr/core'
import dvrHTML from './public/index.html'
import dvrStyle from './public/dvr_controls.scss'

export default class DVRControls extends UICorePlugin {
  get template() { return template(dvrHTML) }
  get name() { return 'dvr_controls' }
  get supportedVersion() { return { min: CLAPPR_CORE_VERSION } }
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
    this.bindCoreEvents()
    this.bindContainerEvents()
  }

  bindCoreEvents() {
    if (this.core.mediaControl.settings) {
      this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged)
      this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.settingsUpdate)
      this.listenTo(this.core, Events.CORE_OPTIONS_CHANGE, this.render)
    } else {
      setTimeout(() => this.bindCoreEvents(), 100)
    }
  }

  bindContainerEvents() {
    if (this.core.activeContainer) {
      this.listenToOnce(this.core.activeContainer, Events.CONTAINER_TIMEUPDATE, this.render)
      this.listenTo(this.core.activeContainer, Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.dvrChanged)
    }
  }

  containerChanged() {
    this.stopListening()
    this.bindEvents()
  }

  dvrChanged(dvrEnabled) {
    if (this.core.getPlaybackType() !== Playback.LIVE) return
    this.settingsUpdate()
    this.core.mediaControl.$el.addClass('live')
    if (dvrEnabled) {
      this.core.mediaControl.$el.addClass('dvr')
      this.core.mediaControl.$el.find('.media-control-indicator[data-position], .media-control-indicator[data-duration]').hide()
    } else { this.core.mediaControl.$el.removeClass('dvr') }
  }

  click() {
    const mediaControl = this.core.mediaControl
    const container = mediaControl.container
    if (!container.isPlaying()) { container.play() }

    if (mediaControl.$el.hasClass('dvr')) { container.seek(container.getDuration()) }
  }

  settingsUpdate() {
    this.stopListening()
    this.core.mediaControl.$el.removeClass('live')
    if (this.shouldRender()) {
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
    const style = Styler.getStyleFor(dvrStyle, { baseUrl: this.options.baseUrl })
    this.$el.html(this.template({
      live: this.core.i18n.t('live'),
      backToLive: this.core.i18n.t('back_to_live')
    }))
    this.$el.append(style[0])
    if (this.shouldRender()) {
      this.core.mediaControl.$el.addClass('live')
      this.core.mediaControl.$('.media-control-left-panel[data-media-control]').append(this.$el)
    }
    return this
  }
}
