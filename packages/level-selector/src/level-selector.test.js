import fs from 'node:fs'
import path from 'node:path'
import { BaseObject, Core, Events, UICorePlugin } from '@clappr/core'
import LevelSelector from './level-selector'

const AUTO = -1
const PLAYER_SRC_DIR = path.join(__dirname, '..', '..', 'player', 'src')

const MEDIA_CONTROL_WITH_PANEL = 'with-panel'
const MEDIA_CONTROL_WITHOUT_PANEL = 'without-panel'
const MEDIA_CONTROL_WITHOUT_QUERY = 'without-query'

class MediaControlStub extends UICorePlugin {
  get name() { return 'media_control' }

  render() {
    this.$el.html('<div class="media-control-right-panel" data-media-control></div>')
    return this
  }
}

class PlaybackStub extends BaseObject {
  constructor(options = {}) {
    super({})
    this.levels = options.levels || []
    this._currentLevel = 'currentLevel' in options ? options.currentLevel : AUTO
    this.currentLevelAssignments = []
  }

  get currentLevel() { return this._currentLevel }

  set currentLevel(id) {
    this.currentLevelAssignments.push(id)
    this._currentLevel = id
  }
}

function setupCore(options = {}) {
  const core = new Core({ levelSelectorConfig: options.levelSelectorConfig })
  const mediaControl = options.mediaControl || MEDIA_CONTROL_WITH_PANEL

  if (mediaControl === MEDIA_CONTROL_WITH_PANEL) {
    core._mediaControl = new MediaControlStub(core)
  } else if (mediaControl === MEDIA_CONTROL_WITHOUT_QUERY) {
    core._mediaControl = new BaseObject({})
  }

  const playback = new PlaybackStub(options)
  core.activeContainer = { playback }

  return { core, playback }
}

function mountLevelSelector(options = {}) {
  const { core, playback } = setupCore(options)
  const plugin = new LevelSelector(core)
  core.trigger(Events.CORE_READY)

  return { core, playback, plugin }
}

function fakeLevels(count) {
  return Array.from({ length: count }, (_, index) => ({ id: index, label: `${360 + index * 360}p` }))
}

function rightPanelOf(core) {
  return core.mediaControl.$el && core.mediaControl.$el.find('.media-control-right-panel')[0]
}

function isMounted(core, plugin) {
  const panel = rightPanelOf(core)
  return !!panel && panel.contains(plugin.el)
}

function selectableIds(plugin) {
  return Array.from(plugin.el.querySelectorAll('ul [data-level-selector-select]'))
    .map(node => node.getAttribute('data-level-selector-select'))
}

function qualityLabels(plugin) {
  return Array.from(plugin.el.querySelectorAll('ul [data-level-selector-select]'))
    .filter(node => node.getAttribute('data-level-selector-select') !== String(AUTO))
    .map(node => node.textContent)
}

function selectorFor(plugin, id) {
  return plugin.el.querySelector(`[data-level-selector-select="${id}"]`)
}

function rowFor(plugin, id) {
  return selectorFor(plugin, id).parentElement
}

function buttonOf(plugin) {
  return plugin.el.querySelector('[data-level-selector-button]')
}

function menuOf(plugin) {
  return plugin.el.querySelector('ul')
}

describe('LevelSelector', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is named level_selector', () => {
    const { plugin } = mountLevelSelector()

    expect(plugin.name).toBe('level_selector')
  })

  it('is a UICorePlugin', () => {
    const { plugin } = mountLevelSelector()

    expect(plugin).toBeInstanceOf(UICorePlugin)
    expect(Object.getPrototypeOf(LevelSelector.prototype)).toBe(UICorePlugin.prototype)
  })

  it('is not registered by the @clappr/player default bundle', () => {
    const bundles = ['main.js', 'base_bundle.js']
      .map(file => fs.readFileSync(path.join(PLAYER_SRC_DIR, file), 'utf8'))

    bundles.forEach(source => {
      expect(source).not.toMatch(/LevelSelector|level-selector|level_selector/)
    })
  })

  it('appends the control to the media control right panel for a multi-level playback', () => {
    const { core, playback, plugin } = mountLevelSelector()

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(isMounted(core, plugin)).toBe(true)
  })

  it('does not append a control when the playback has no currentLevel', () => {
    const { core, playback, plugin } = mountLevelSelector({ currentLevel: undefined })

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(isMounted(core, plugin)).toBe(false)
  })

  it('does not append a control when no level is available', () => {
    const { core, playback, plugin } = mountLevelSelector()

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, [])

    expect(isMounted(core, plugin)).toBe(false)
  })

  it('does not append a control when a single level is available', () => {
    const { core, playback, plugin } = mountLevelSelector()

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(1))

    expect(isMounted(core, plugin)).toBe(false)
  })

  it('removes the control when playback later reports a single level', () => {
    const { core, playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(1))

    expect(isMounted(core, plugin)).toBe(false)
  })

  it('removes the control when playback later reports no levels', () => {
    const { core, playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, [])

    expect(isMounted(core, plugin)).toBe(false)
  })

  it('does not throw or append when the media control has no right panel', () => {
    const withoutPanel = mountLevelSelector({ mediaControl: MEDIA_CONTROL_WITHOUT_PANEL })
    const withoutQuery = mountLevelSelector({ mediaControl: MEDIA_CONTROL_WITHOUT_QUERY })

    expect(() => withoutPanel.playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))).not.toThrow()
    expect(() => withoutQuery.playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))).not.toThrow()

    expect(withoutPanel.plugin.el.parentElement).toBeNull()
    expect(withoutQuery.plugin.el.parentElement).toBeNull()
  })

  it('lists an Auto row and one row per delivered level', () => {
    const { playback, plugin } = mountLevelSelector()

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(3))

    expect(selectableIds(plugin)).toEqual(['-1', '0', '1', '2'])
  })

  it('renders the configured title row', () => {
    const { playback, plugin } = mountLevelSelector({ levelSelectorConfig: { title: 'Quality' } })

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(plugin.el.querySelector('ul li[data-title]').textContent).toBe('Quality')
  })

  it('omits the title row when no title is configured', () => {
    const untitled = mountLevelSelector()
    const emptyTitle = mountLevelSelector({ levelSelectorConfig: { title: '' } })

    untitled.playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))
    emptyTitle.playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(untitled.plugin.el.querySelector('ul li[data-title]')).toBeNull()
    expect(emptyTitle.plugin.el.querySelector('ul li[data-title]')).toBeNull()
  })

  it('renders a button and a menu as the only root chrome', () => {
    const { playback, plugin } = mountLevelSelector()

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(plugin.el.querySelector('button[data-level-selector-button]')).not.toBeNull()
    expect(plugin.el.querySelector('ul')).not.toBeNull()
    expect(Array.from(plugin.el.children).map(node => node.tagName.toLowerCase()))
      .toEqual(['button', 'ul', 'style'])
  })

  it('replaces the menu rows when levels are delivered again', () => {
    const { playback, plugin } = mountLevelSelector()

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(3))
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, [{ id: 7, label: '4K' }, { id: 8, label: '8K' }])

    expect(selectableIds(plugin)).toEqual(['-1', '7', '8'])
  })

  it('renders levels already exposed by the playback when the event never fires', () => {
    const { core, plugin } = mountLevelSelector({ levels: fakeLevels(2) })

    expect(isMounted(core, plugin)).toBe(true)
    expect(selectableIds(plugin)).toEqual(['-1', '0', '1'])
  })

  it('selects Auto when the Auto row is activated', () => {
    const { playback, plugin } = mountLevelSelector({ currentLevel: 1 })
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    selectorFor(plugin, AUTO).click()

    expect(playback.currentLevel).toBe(AUTO)
  })

  it('selects a quality level when its row is activated', () => {
    const { playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    selectorFor(plugin, 1).click()

    expect(playback.currentLevel).toBe(1)
  })

  it('does not assign the current level again when the same quality is activated', () => {
    const { playback, plugin } = mountLevelSelector({ currentLevel: 1 })
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    selectorFor(plugin, 1).click()

    expect(playback.currentLevelAssignments).toEqual([])
  })

  it('labels the button AUTO while no current level is known', () => {
    const { playback, plugin } = mountLevelSelector()

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(buttonOf(plugin).textContent).toBe('AUTO')
  })

  it('labels the button with the current level while Auto is selected', () => {
    const { playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    playback.trigger(Events.PLAYBACK_BITRATE, { level: 1 })

    expect(buttonOf(plugin).textContent).toBe('AUTO (720p)')
  })

  it('labels the button with the selected quality level', () => {
    const { playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    selectorFor(plugin, 1).click()
    playback.trigger(Events.PLAYBACK_BITRATE, { level: 0 })

    expect(buttonOf(plugin).textContent).toBe('720p')
  })

  it('marks the button as changing while the level switch runs', () => {
    const { playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    playback.trigger(Events.PLAYBACK_LEVEL_SWITCH_START)

    expect(buttonOf(plugin).classList.contains('changing')).toBe(true)
  })

  it('clears the changing mark when the level switch ends', () => {
    const { playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    playback.trigger(Events.PLAYBACK_LEVEL_SWITCH_START)
    playback.trigger(Events.PLAYBACK_LEVEL_SWITCH_END)

    expect(buttonOf(plugin).classList.contains('changing')).toBe(false)
  })

  it('marks the reported bitrate level as the current row', () => {
    const { playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    playback.trigger(Events.PLAYBACK_BITRATE, { level: 1 })

    expect(rowFor(plugin, 1).classList.contains('current')).toBe(true)
    expect(rowFor(plugin, 0).classList.contains('current')).toBe(false)
  })

  it('clears a stale current row when the reported bitrate level is unknown', () => {
    const { playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))
    playback.trigger(Events.PLAYBACK_BITRATE, { level: 1 })

    expect(() => playback.trigger(Events.PLAYBACK_BITRATE, { level: 99 })).not.toThrow()

    expect(rowFor(plugin, 1).classList.contains('current')).toBe(false)
    expect(rowFor(plugin, 0).classList.contains('current')).toBe(false)
  })

  it('clears a stale current level when a replacement list drops that id', () => {
    const { playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))
    playback.trigger(Events.PLAYBACK_BITRATE, { level: 1 })

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, [{ id: 7, label: '4K' }, { id: 8, label: '8K' }])

    expect(buttonOf(plugin).textContent).toBe('AUTO')
    expect(rowFor(plugin, 7).classList.contains('current')).toBe(false)
    expect(rowFor(plugin, 8).classList.contains('current')).toBe(false)
  })

  it('toggles the menu when the button is activated', () => {
    const { playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(menuOf(plugin).style.display).toBe('none')

    buttonOf(plugin).click()
    expect(menuOf(plugin).style.display).not.toBe('none')

    buttonOf(plugin).click()
    expect(menuOf(plugin).style.display).toBe('none')
  })

  it('hides the menu when the media control hides', () => {
    const { core, playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))
    buttonOf(plugin).click()
    expect(menuOf(plugin).style.display).not.toBe('none')

    core.mediaControl.trigger(Events.MEDIACONTROL_HIDE)

    expect(menuOf(plugin).style.display).toBe('none')
  })

  it('binds level events on the new playback only when the active container changes', () => {
    const { core, playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    const nextPlayback = new PlaybackStub({ currentLevel: AUTO })
    core.activeContainer = { playback: nextPlayback }

    nextPlayback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, [{ id: 7, label: '4K' }, { id: 8, label: '8K' }])
    expect(selectableIds(plugin)).toEqual(['-1', '7', '8'])

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, [{ id: 3, label: '240p' }, { id: 4, label: '480p' }])
    expect(selectableIds(plugin)).toEqual(['-1', '7', '8'])
  })

  it('unmounts the control when the new playback has no levels', () => {
    const { core, playback, plugin } = mountLevelSelector()
    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    core.activeContainer = { playback: new PlaybackStub({ currentLevel: AUTO, levels: [] }) }

    expect(isMounted(core, plugin)).toBe(false)
  })

  it('labels the menu rows from the configured labels map', () => {
    const { playback, plugin } = mountLevelSelector({
      levelSelectorConfig: { labels: { 0: 'Low', 1: 'High' } }
    })

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(qualityLabels(plugin)).toEqual(['Low', 'High'])
  })

  it('labels the menu rows with the configured label callback', () => {
    const { playback, plugin } = mountLevelSelector({
      levelSelectorConfig: {
        labels: { 0: 'Low' },
        labelCallback: (level, customLabel) => `${customLabel || level.label} (${level.id})`
      }
    })

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(qualityLabels(plugin)).toEqual(['Low (0)', '720p (1)'])
  })

  it('rejects a label callback that is not a function', () => {
    const { plugin } = mountLevelSelector({ levelSelectorConfig: { labelCallback: 'nope' } })

    const fillLevels = () => plugin.fillLevels(fakeLevels(2))

    expect(fillLevels).toThrow(TypeError)
    expect(fillLevels).toThrow('labelCallback must be a function')
  })

  it('rejects an onLevelsAvailable hook that is not a function', () => {
    const { plugin } = mountLevelSelector({ levelSelectorConfig: { onLevelsAvailable: 'nope' } })

    const fillLevels = () => plugin.fillLevels(fakeLevels(2))

    expect(fillLevels).toThrow(TypeError)
    expect(fillLevels).toThrow('onLevelsAvailable must be a function')
  })

  it('hands onLevelsAvailable a copy of the playback levels', () => {
    let received
    const { playback } = mountLevelSelector({
      levelSelectorConfig: {
        onLevelsAvailable: levels => {
          received = levels
          return levels
        }
      }
    })
    const delivered = fakeLevels(2)
    playback.levels = delivered

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, delivered)

    expect(received).not.toBe(playback.levels)
    expect(received).toEqual(delivered)
  })

  it('renders the array returned by onLevelsAvailable', () => {
    const { playback, plugin } = mountLevelSelector({
      levelSelectorConfig: { onLevelsAvailable: levels => levels.slice().reverse() }
    })

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(3))

    expect(selectableIds(plugin)).toEqual(['-1', '2', '1', '0'])
  })

  it('rejects an onLevelsAvailable hook that does not return an array', () => {
    const { plugin } = mountLevelSelector({
      levelSelectorConfig: { onLevelsAvailable: () => 'nope' }
    })

    const fillLevels = () => plugin.fillLevels(fakeLevels(2))

    expect(fillLevels).toThrow(TypeError)
    expect(fillLevels).toThrow('onLevelsAvailable must return an array')
  })

  it('renders playback labels when no levelSelectorConfig is given', () => {
    const { core, playback, plugin } = mountLevelSelector()

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(isMounted(core, plugin)).toBe(true)
    expect(qualityLabels(plugin)).toEqual(['360p', '720p'])
  })

  it('renders the playback levels when onLevelsAvailable is omitted', () => {
    const { playback, plugin } = mountLevelSelector({ levelSelectorConfig: { title: 'Quality' } })

    playback.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, fakeLevels(2))

    expect(selectableIds(plugin)).toEqual(['-1', '0', '1'])
    expect(qualityLabels(plugin)).toEqual(['360p', '720p'])
  })
})
