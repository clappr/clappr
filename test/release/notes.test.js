import { prependSection, renderSection } from '../../.github/scripts/release/changelog.mjs'
import { extractSection, publishNotes } from '../../.github/scripts/release/notes.mjs'

const SECTION = renderSection({
  version: '0.15.0',
  date: '2026-11-22',
  preface: '| Package | Before | Now |\n| --- | --- | --- |\n| @clappr/core | 0.18.0 | 0.18.1 |',
  entries: [
    { prefix: 'core', title: 'Handle seek on live', number: 2602, labels: [] },
    { prefix: 'hlsjs-playback', title: 'Fix stall', number: 2603, labels: ['bug'] }
  ]
})

const LEGACY = `# Change Log

## [0.14.10](https://example.test/compare) (2026-11-12)

**Note:** Version bump only for package @clappr/player
`
const CHANGELOG = prependSection(LEGACY, SECTION)

function setup({ release = null, changelog = CHANGELOG, tags = [] } = {}) {
  const calls = []
  const warnings = []
  const releases = {
    find: async tag => {
      calls.push(['find', tag])
      return release
    },
    createDraft: async args => calls.push(['create', args]),
    updateBody: async args => calls.push(['update', args])
  }

  return {
    calls,
    warnings,
    run: tag =>
      publishNotes({
        tag,
        tags: () => tags,
        changelogAt: () => changelog,
        releases,
        warn: message => warnings.push(message)
      })
  }
}

const BODY = SECTION.split('\n').slice(1).join('\n').trim()

describe('extractSection', () => {
  it('returns the section the release wrote', () => {
    expect(extractSection(CHANGELOG, '0.15.0')).toBe(BODY)
    expect(extractSection(CHANGELOG, '0.15.0')).not.toContain('## 0.15.0')
    expect(extractSection(CHANGELOG, '0.15.0')).not.toContain('0.14.10')
    expect(extractSection(CHANGELOG, '9.9.9')).toBeNull()
  })
})

describe('publishNotes', () => {
  it('creates a draft from the changelog section', async () => {
    const { run, calls } = setup()

    expect(await run('@clappr/player@0.15.0')).toBe('created')
    expect(calls).toContainEqual(['create', { tag: '@clappr/player@0.15.0', body: BODY }])

    const latest = setup({
      tags: ['@clappr/player@0.9.0', '@clappr/player@0.15.0', '@clappr/core@1.0.0']
    })
    await latest.run('')
    expect(latest.calls).toContainEqual(['create', { tag: '@clappr/player@0.15.0', body: BODY }])
  })

  it('updates an existing draft', async () => {
    const { run, calls } = setup({ release: { id: 42, isDraft: true } })

    expect(await run('@clappr/player@0.15.0')).toBe('updated')
    expect(calls).toContainEqual(['update', { id: 42, body: BODY }])
    expect(calls.some(([action]) => action === 'create')).toBe(false)
  })

  it('leaves a published release untouched', async () => {
    const { run, calls, warnings } = setup({ release: { id: 42, isDraft: false } })

    expect(await run('@clappr/player@0.15.0')).toBe('unchanged')
    expect(calls.map(([action]) => action)).toEqual(['find'])
    expect(warnings).toHaveLength(1)
  })

  it('fails when the version has no section', async () => {
    const { run, calls } = setup()

    await expect(run('@clappr/player@0.16.0')).rejects.toThrow(
      'No changelog section for @clappr/player@0.16.0'
    )
    expect(calls).toEqual([])
  })
})
