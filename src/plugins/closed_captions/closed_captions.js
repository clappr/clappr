import UICorePlugin from '../../base/ui_core_plugin'
import template from '../../base/template'
import Events from '../../base/events'
import ccIcon from '../../icons/09-cc.svg'
import ccHTML from './public/closed_captions.html'
import './public/closed_captions.scss'

export default class ClosedCaptions extends UICorePlugin {
  get name() { return 'closed_captions' }

  get template() { return template(ccHTML) }

  get events() {
    return {
      'click [data-cc-button]': 'toggleContextMenu',
      'click [data-cc-select]': 'onTrackSelect',
    }
  }

  get attributes() {
    return {
      'class': 'cc-controls',
      'data-cc-controls': ''
    }
  }

  constructor(core) {
    super(core)
    const config = core.options.closedCaptionsConfig
    this._title = config && config.title ? config.title : null
    this._ariaLabel = config && config.ariaLabel ? config.ariaLabel : 'cc-button'
    this._labelCb = config && config.labelCallback && typeof config.labelCallback === 'function'
      ? config.labelCallback
      : track => { return track.name }
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.render)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_HIDE, this.hideContextMenu)
    this.container = this.core.getCurrentContainer()
    if (this.container) {
      this.listenTo(this.container, Events.CONTAINER_SUBTITLE_AVAILABLE, this.onSubtitleAvailable)
      this.listenTo(this.container, Events.CONTAINER_SUBTITLE_CHANGED, this.onSubtitleChanged)
      this.listenTo(this.container, Events.CONTAINER_STOP, this.onContainerStop)
    }
  }

  onContainerStop() {
    this.ccAvailable(false)
  }

  containerChanged() {
    this.ccAvailable(false)
    this.stopListening()
    this.bindEvents()
  }

  onSubtitleAvailable() {
    this.renderCcButton()
    this.ccAvailable(true)
  }

  onSubtitleChanged(track) {
    this.setCurrentContextMenuElement(track.id)
  }

  onTrackSelect(event) {
    const trackId = parseInt(event.target.dataset.ccSelect, 10)
    this.container.closedCaptionsTrackId = trackId
    this.hideContextMenu()
    event.stopPropagation()
    return false
  }

  ccAvailable(hasCC) {
    const method = hasCC ? 'addClass' : 'removeClass'
    this.$el[method]('available')
  }

  toggleContextMenu() {
    this.$el.find('ul').toggle()
  }

  hideContextMenu() {
    this.$el.find('ul').hide()
  }

  contextMenuElement(id) {
    return this.$el.find('ul a'+(!isNaN(id) ? '[data-cc-select="'+id+'"]' : '')).parent()
  }

  setCurrentContextMenuElement(trackId) {
    if (this._trackId !== trackId) {
      this.contextMenuElement().removeClass('current')
      this.contextMenuElement(trackId).addClass('current')
      const method = trackId > -1 ? 'addClass' : 'removeClass'
      this.$ccButton[method]('enabled')
      this._trackId = trackId
    }
  }

  renderCcButton() {
    let tracks = this.container ? this.container.closedCaptionsTracks : []
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].label = this._labelCb(tracks[i])
    }

    this.$el.html(this.template({
      ariaLabel: this._ariaLabel,
      disabledLabel: this.core.i18n.t('disabled'),
      title: this._title,
      tracks: tracks
    }))

    this.$ccButton = this.$el.find('button.cc-button[data-cc-button]')
    this.$ccButton.append(ccIcon)
    this.$el.append(this.style)
  }

  render() {
    this.renderCcButton()

    const $fullscreen = this.core.mediaControl.$el.find('button[data-fullscreen]')
    if ($fullscreen[0]) {
      this.$el.insertAfter($fullscreen)
    } else {
      this.core.mediaControl.$el.find('.media-control-right-panel[data-media-control]').prepend(this.$el)
    }

    return this
  }
}
