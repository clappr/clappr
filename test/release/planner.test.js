import { planRelease, renderSummary } from '../../.github/scripts/release/planner.mjs'

const WORKSPACES = [
  { name: '@clappr/player', version: '0.14.10', isPrivate: false, dir: 'packages/player' },
  { name: '@clappr/core', version: '0.18.1', isPrivate: false, dir: 'packages/clappr-core' },
  { name: '@clappr/zepto', version: '2.1.5', isPrivate: true, dir: 'packages/clappr-zepto' },
  { name: '@clappr/plugins', version: '0.9.18', isPrivate: false, dir: 'packages/clappr-plugins' },
  {
    name: '@clappr/hlsjs-playback',
    version: '3.1.5',
    isPrivate: false,
    dir: 'packages/hlsjs-playback'
  },
  {
    name: '@clappr/telemetry',
    version: '0.3.10',
    isPrivate: false,
    dir: 'packages/clappr-telemetry'
  }
]

const NOW = new Date('2026-11-22T23:30:00Z')
const ALL_TAGS = WORKSPACES.filter(({ isPrivate }) => !isPrivate).map(
  ({ name, version }) => `${name}@${version}`
)

const CORE = 'packages/clappr-core/src/a.js'
const ZEPTO = 'packages/clappr-zepto/src/zepto.js'
const HLS = 'packages/hlsjs-playback/src/hls.js'
const PLUGINS = 'packages/clappr-plugins/src/p.js'
const TELEMETRY = 'packages/clappr-telemetry/src/t.js'

function pr(number, title, labels = []) {
  return { number, title, labels }
}

// `commits` maps a tag to the commits after it; `pulls` maps a sha to its merged PR.
function plan(
  packageName,
  {
    commits = {},
    pulls = {},
    tags = ALL_TAGS,
    published = ALL_TAGS,
    versionsAt = {},
    allowEmpty = false
  } = {}
) {
  const git = {
    tagExists: tag => tags.includes(tag),
    commitsSince: tag => commits[tag] ?? [],
    versionAt: (tag, dir) => versionsAt[`${tag}:${dir}`]
  }
  const github = { findPullRequest: async sha => pulls[sha] ?? null }
  const npm = { isPublished: async ({ name, version }) => published.includes(`${name}@${version}`) }

  return planRelease({
    packageName,
    bump: 'minor',
    allowEmpty,
    now: NOW,
    workspaces: WORKSPACES,
    git,
    github,
    npm
  })
}

const coreCommits = {
  '@clappr/core@0.18.1': [
    { sha: 'a1', files: [CORE] },
    { sha: 'a2', files: [CORE] },
    { sha: 'a3', files: [CORE] },
    { sha: 'b1', files: [TELEMETRY] },
    { sha: 'c1', files: [CORE, TELEMETRY] },
    { sha: 'd1', files: [ZEPTO] }
  ]
}
const corePulls = {
  a1: pr(2609, 'Add viewport API'),
  a2: pr(2609, 'Add viewport API'),
  a3: pr(2609, 'Add viewport API'),
  b1: pr(2610, 'Tune telemetry'),
  c1: pr(2611, 'Share a type'),
  d1: pr(2612, 'Patch zepto')
}

describe('planRelease', () => {
  it('lists one line per PR touching the package', async () => {
    const core = await plan('@clappr/core', { commits: coreCommits, pulls: corePulls })
    const telemetry = await plan('@clappr/telemetry', {
      commits: { '@clappr/telemetry@0.3.10': coreCommits['@clappr/core@0.18.1'] },
      pulls: corePulls
    })

    expect(core.section).toBe(
      '## 0.19.0 (2026-11-22)\n\n- Add viewport API (#2609)\n- Share a type (#2611)\n- Patch zepto (#2612)'
    )
    expect(telemetry.section).toContain('- Tune telemetry (#2610)')
    expect(telemetry.section).toContain('- Share a type (#2611)')
    expect(telemetry.section).not.toContain('Add viewport API')
  })

  it('ignores commits without a PR', async () => {
    const result = await plan('@clappr/core', {
      commits: {
        '@clappr/core@0.18.1': [
          { sha: 'release', files: [CORE, 'packages/player/package.json'] },
          { sha: 'direct', files: [CORE] },
          { sha: 'merged', files: [CORE] }
        ]
      },
      pulls: { merged: pr(7, 'Fix it') }
    })

    expect(result.section).toBe('## 0.19.0 (2026-11-22)\n\n- Fix it (#7)')
  })

  it('fails when nothing is released', async () => {
    await expect(
      plan('@clappr/core', { commits: { '@clappr/core@0.18.1': [{ sha: 'x', files: [CORE] }] } })
    ).rejects.toThrow('Nothing to release for @clappr/core')
    await expect(plan('@clappr/core')).rejects.toThrow('Nothing to release for @clappr/core')
  })

  it('releases an empty package only with allowEmpty', async () => {
    const empty = await plan('@clappr/core', { allowEmpty: true })
    expect(empty.mode).toBe('release')
    expect(empty.section).toBe('## 0.19.0 (2026-11-22)\n\nNo significant changes in this version.')

    const player = await plan('@clappr/player', { allowEmpty: true })
    expect(player.section).toContain('| Package | Before | Now |')
    expect(player.section.endsWith('No significant changes in this version.')).toBe(true)
  })

  it('blocks the player on unreleased bundle PRs', async () => {
    const commits = {
      '@clappr/core@0.18.1': [
        { sha: 'k1', files: [CORE] },
        { sha: 'k2', files: [ZEPTO] }
      ],
      '@clappr/hlsjs-playback@3.1.5': [{ sha: 'h1', files: [HLS] }],
      '@clappr/plugins@0.9.18': [{ sha: 'g1', files: [PLUGINS] }],
      '@clappr/player@0.14.10': [{ sha: 'p1', files: ['packages/player/src/main.js'] }]
    }
    const pulls = {
      k1: pr(2601, 'Core one'),
      k2: pr(2602, 'Core two'),
      h1: pr(2603, 'Hls one'),
      g1: pr(2605, 'Plugins one'),
      p1: pr(2604, 'Player one')
    }

    await expect(plan('@clappr/player', { commits, pulls })).rejects.toThrow(
      '@clappr/core has unreleased PRs: #2601, #2602. Release it first.\n' +
        '@clappr/plugins has unreleased PRs: #2605. Release it first.\n' +
        '@clappr/hlsjs-playback has unreleased PRs: #2603. Release it first.'
    )
  })

  it('does not block the player on docs-only bundle PRs', async () => {
    const commits = {
      '@clappr/hlsjs-playback@3.1.5': [{ sha: 'd1', files: ['packages/hlsjs-playback/README.md'] }]
    }
    const pulls = { d1: pr(2627, 'Docs only') }

    await expect(
      plan('@clappr/player', { commits, pulls, allowEmpty: true })
    ).resolves.toBeDefined()
  })

  it('blocks the player on a bundled version missing from npm', async () => {
    await expect(
      plan('@clappr/player', { published: ALL_TAGS.filter(tag => tag !== '@clappr/core@0.18.1') })
    ).rejects.toThrow('@clappr/core@0.18.1 is tagged but not on npm. Publish it first.')
  })

  it('dates the section in UTC whatever the runner zone', async () => {
    const zone = process.env.TZ
    process.env.TZ = 'Pacific/Auckland'

    try {
      const { section } = await plan('@clappr/core', { commits: coreCommits, pulls: corePulls })
      expect(section.startsWith('## 0.19.0 (2026-11-22)\n')).toBe(true)
    } finally {
      if (zone === undefined) delete process.env.TZ
      else process.env.TZ = zone
    }
  })

  it('rejects a private or unknown package and a missing tag', async () => {
    await expect(plan('@clappr/zepto')).rejects.toThrow(
      'Unknown publishable package "@clappr/zepto"'
    )
    await expect(plan('@clappr/core', { tags: [] })).rejects.toThrow(
      'Tag @clappr/core@0.18.1 not found'
    )
  })

  const playerWorld = {
    commits: {
      '@clappr/player@0.14.10': [
        { sha: 'p1', files: [CORE, HLS] },
        { sha: 'p2', files: [TELEMETRY] },
        { sha: 'p3', files: [ZEPTO] },
        { sha: 'p4', files: ['packages/player/src/main.js'] },
        { sha: 'p5', files: [HLS] },
        { sha: 'p6', files: [HLS] },
        { sha: 'p7', files: [HLS] },
        { sha: 'p8', files: [CORE] }
      ]
    },
    pulls: {
      p1: pr(2602, 'Handle seek on live'),
      p2: pr(2610, 'Tune telemetry'),
      p3: pr(2611, 'Patch zepto', ['bug']),
      p4: pr(2612, 'Retitle the demo'),
      p5: pr(2613, 'Bump hls.js', ['dependencies']),
      p6: pr(2613, 'Bump hls.js', ['dependencies']),
      p7: pr(2614, 'Share the clock'),
      p8: pr(2614, 'Share the clock')
    },
    versionsAt: {
      '@clappr/player@0.14.10:packages/clappr-core': '0.18.0',
      '@clappr/player@0.14.10:packages/clappr-plugins': '0.9.18',
      '@clappr/player@0.14.10:packages/hlsjs-playback': '3.1.4'
    }
  }

  it('renders the player version table', async () => {
    const { section } = await plan('@clappr/player', playerWorld)
    const [heading, , ...table] = section.split('\n')

    expect(heading).toBe('## 0.15.0 (2026-11-22)')
    expect(table.slice(0, 5)).toEqual([
      '| Package | Before | Now |',
      '| --- | --- | --- |',
      '| @clappr/core | 0.18.0 | 0.18.1 |',
      '| @clappr/plugins | 0.9.18 | 0.9.18 |',
      '| @clappr/hlsjs-playback | 3.1.4 | 3.1.5 |'
    ])
    expect(table[5]).toBe('')
  })

  it('aggregates bundle PRs with package prefixes', async () => {
    const { section } = await plan('@clappr/player', playerWorld)

    expect(section).toContain('- **core, hlsjs-playback:** Handle seek on live (#2602)')
    expect(section).toContain('- **core, hlsjs-playback:** Share the clock (#2614)')
    expect(section).toContain('- **player:** Retitle the demo (#2612)')
    expect(section).toContain('### Bug Fixes\n\n- **core:** Patch zepto (#2611)')
    expect(section).toContain('### Dependency updates\n\n- **hlsjs-playback:** Bump hls.js (#2613)')
    expect(section).not.toContain('Tune telemetry')
    expect(section.match(/#2613/g)).toHaveLength(1)
  })

  it('recovers a tagged version missing on npm', async () => {
    const missing = await plan('@clappr/core', { published: [] })
    expect(missing).toMatchObject({
      mode: 'recover',
      name: '@clappr/core',
      version: '0.18.1',
      tag: '@clappr/core@0.18.1'
    })
    expect(missing.section).toBeUndefined()

    const published = await plan('@clappr/core', {
      published: ['@clappr/core@0.18.1'],
      commits: coreCommits,
      pulls: corePulls
    })
    expect(published).toMatchObject({ mode: 'release', current: '0.18.1', version: '0.19.0' })
  })

  it('renders the preview summary', async () => {
    const core = await plan('@clappr/core', { commits: coreCommits, pulls: corePulls })
    const summary = renderSummary(core, { isPreview: true })

    expect(summary).toContain('- **Package:** `@clappr/core`')
    expect(summary).toContain('- **Current version:** 0.18.1')
    expect(summary).toContain('- **Next version:** 0.19.0')
    expect(summary).toContain(core.section)
    expect(summary).not.toContain('Player gate')

    const player = await plan('@clappr/player', playerWorld)
    expect(renderSummary(player, { isPreview: true })).toContain('**Player gate:** passed')
  })
})
