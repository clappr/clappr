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

  switch (options.mediaControl || MEDIA_CONTROL_WITH_PANEL) {
    case MEDIA_CONTROL_WITH_PANEL:
      core._mediaControl = new MediaControlStub(core)
      break
    case MEDIA_CONTROL_WITHOUT_QUERY:
      core._mediaControl = new BaseObject({})
      break
    default:
      // Falls back to the core dummy media control, which has no right panel.
      break
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
})
