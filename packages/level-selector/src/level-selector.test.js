import fs from 'node:fs'
import path from 'node:path'
import { BaseObject, Core, Events, UICorePlugin } from '@clappr/core'
import LevelSelector from './level-selector'

const AUTO = -1
const PLAYER_SRC_DIR = path.join(__dirname, '..', '..', 'player', 'src')

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
  if (options.mediaControl !== false) core._mediaControl = new MediaControlStub(core)

  const playback = options.playback === false ? null : new PlaybackStub(options)
  if (playback) core.activeContainer = { playback }

  return { core, playback }
}

function mountLevelSelector(options = {}) {
  const { core, playback } = setupCore(options)
  const plugin = new LevelSelector(core)
  core.trigger(Events.CORE_READY)

  return { core, playback, plugin }
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
})
