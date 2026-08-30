import { Events, Styler, UICorePlugin, template } from '@clappr/core'
import pluginHtml from './public/level-selector.html'
import pluginStyle from './public/level-selector.scss'

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

  bindPlaybackEvents() {
    if (!this.playback) return

    this.listenTo(this.playback, Events.PLAYBACK_LEVELS_AVAILABLE, this.fillLevels)

    const levelsAlreadyAvailable = this.playback.levels && this.playback.levels.length > 0
    if (levelsAlreadyAvailable) this.fillLevels(this.playback.levels)
  }

  reload() {
    this.stopListening()
    this.bindEvents()
    this.bindPlaybackEvents()
  }

  fillLevels(levels) {
    this.levels = levels
    this.render()
  }

  getTitle() { return this.levelSelectorConfig.title }

  shouldRender() {
    if (!this.playback) return false

    const respondsToCurrentLevel = this.playback.currentLevel !== undefined
    const hasLevels = !!(this.levels && this.levels.length > 1)

    return respondsToCurrentLevel && hasLevels
  }

  rightPanel() {
    const mediaControl = this.core.mediaControl
    if (!mediaControl || typeof mediaControl.$ !== 'function') return { length: 0 }

    return mediaControl.$('.media-control-right-panel')
  }

  render() {
    if (!this.shouldRender()) return this

    const panel = this.rightPanel()
    if (panel.length === 0) return this

    const style = Styler.getStyleFor(pluginStyle, { baseUrl: this.core.options.baseUrl })
    this.$el.html(this.template({ levels: this.levels, title: this.getTitle() }))
    this.$el.append(style[0])
    panel.append(this.el)

    return this
  }

  onLevelSelect() {}

  onShowLevelSelectMenu() {}

  hideSelectLevelMenu() {}
}
