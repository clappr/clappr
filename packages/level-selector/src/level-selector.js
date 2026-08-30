import { Events, UICorePlugin, template } from '@clappr/core'
import pluginHtml from './public/level-selector.html'
import './public/level-selector.scss'

export default class LevelSelector extends UICorePlugin {
  static get version() { return VERSION }

  get name() { return 'level_selector' }

  get supportedVersion() { return { min: CLAPPR_CORE_VERSION } }

  get template() { return template(pluginHtml) }

  get attributes() {
    return {
      'class': 'level_selector',
      'data-level-selector': ''
    }
  }

  get events() {
    return {
      'click [data-level-selector-select]': 'onLevelSelect',
      'click [data-level-selector-button]': 'onShowLevelSelectMenu'
    }
  }

  get playback() { return this.core.activePlayback }

  // Read at use time: UICorePlugin runs bindEvents/render inside super(core),
  // before any subclass constructor body could cache this.
  get levelSelectorConfig() { return this.core.options.levelSelectorConfig || {} }

  bindEvents() {
    this.listenTo(this.core, Events.CORE_READY, this.bindPlaybackEvents)
    this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, this.reload)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.render)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_HIDE, this.hideSelectLevelMenu)
  }

  bindPlaybackEvents() {}

  reload() {
    this.stopListening()
    this.bindEvents()
    this.bindPlaybackEvents()
  }

  onLevelSelect() {}

  onShowLevelSelectMenu() {}

  hideSelectLevelMenu() {}
}
