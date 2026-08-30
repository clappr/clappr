import { Events, Styler, UICorePlugin, template } from '@clappr/core'
import pluginHtml from './public/level-selector.html'
import pluginStyle from './public/level-selector.scss'

const AUTO = -1

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
    this.listenTo(this.playback, Events.PLAYBACK_LEVEL_SWITCH_START, this.startLevelSwitch)
    this.listenTo(this.playback, Events.PLAYBACK_LEVEL_SWITCH_END, this.stopLevelSwitch)
    this.listenTo(this.playback, Events.PLAYBACK_BITRATE, this.updateCurrentLevel)

    const levelsAlreadyAvailable = this.playback.levels && this.playback.levels.length > 0
    if (levelsAlreadyAvailable) this.fillLevels(this.playback.levels)
  }

  reload() {
    this.stopListening()
    this.bindEvents()
    this.bindPlaybackEvents()
  }

  fillLevels(levels, initialLevel = AUTO) {
    if (this.selectedLevelId === undefined) this.selectedLevelId = initialLevel

    this.levels = this.applyLevelsCallback(levels)
    this.configureLevelsLabels()
    this.render()
  }

  applyLevelsCallback(levels) {
    const onLevelsAvailable = this.levelSelectorConfig.onLevelsAvailable
    if (!onLevelsAvailable) return levels

    if (typeof onLevelsAvailable !== 'function') throw new TypeError('onLevelsAvailable must be a function')

    const customLevels = onLevelsAvailable(levels.slice())
    if (!Array.isArray(customLevels)) throw new TypeError('onLevelsAvailable must return an array')

    return customLevels
  }

  configureLevelsLabels() {
    const { labelCallback, labels } = this.levelSelectorConfig
    if (labelCallback && typeof labelCallback !== 'function') throw new TypeError('labelCallback must be a function')
    if (!labelCallback && !labels) return

    const customLabels = labels || {}
    this.levels.forEach(level => {
      const customLabel = customLabels[level.id]
      if (labelCallback) level.label = labelCallback(level, customLabel)
      else if (customLabel) level.label = customLabel
    })
  }

  findLevelBy(id) {
    return this.levels.find(level => level.id === id)
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
    this.hideSelectLevelMenu()
    this.highlightCurrentLevel()

    return this
  }

  buttonElement() { return this.$el.find('button[data-level-selector-button]') }

  levelElement(id) {
    const selector = isNaN(id) ? '' : `[data-level-selector-select="${id}"]`

    return this.$el.find(`ul a${selector}`).parent()
  }

  menuElement() { return this.$el.find('ul')[0] }

  // The menu is driven by an explicit inline display so that opening it always
  // overrides the stylesheet default, whatever the host page cascade looks like.
  toggleContextMenu() {
    const menu = this.menuElement()
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none'
  }

  onLevelSelect(event) {
    this.selectedLevelId = parseInt(event.target.dataset.levelSelectorSelect, 10)
    if (this.playback.currentLevel === this.selectedLevelId) return false

    this.playback.currentLevel = this.selectedLevelId
    this.toggleContextMenu()
    event.stopPropagation()

    return false
  }

  onShowLevelSelectMenu() { this.toggleContextMenu() }

  hideSelectLevelMenu() {
    const menu = this.menuElement()
    if (menu) menu.style.display = 'none'
  }

  startLevelSwitch() { this.buttonElement().addClass('changing') }

  stopLevelSwitch() { this.buttonElement().removeClass('changing') }

  updateText(selectedLevelId) {
    if (selectedLevelId === AUTO) {
      this.buttonElement().text(this.currentLevel ? `AUTO (${this.currentLevel.label})` : 'AUTO')
      return
    }

    const selectedLevel = this.findLevelBy(selectedLevelId)
    if (selectedLevel) this.buttonElement().text(selectedLevel.label)
  }

  updateCurrentLevel(info) {
    this.currentLevel = this.findLevelBy(info.level) || null
    this.highlightCurrentLevel()
  }

  highlightCurrentLevel() {
    this.levelElement().removeClass('current')
    if (this.currentLevel) this.levelElement(this.currentLevel.id).addClass('current')

    this.updateText(this.selectedLevelId)
  }
}
