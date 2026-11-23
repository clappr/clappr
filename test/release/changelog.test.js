import { prependSection, renderSection } from '../../.github/scripts/release/changelog.mjs'

describe('renderSection', () => {
  it('groups by label in order and omits empty groups', () => {
    const entries = [
      { title: 'Bump undici', number: 4, labels: ['dependencies', 'bug'] },
      { title: 'Fix seek', number: 3, labels: ['bug'] },
      { title: 'Add viewport', number: 1, labels: [] },
      { title: 'Rename option', number: 2, labels: ['enhancement'] }
    ]

    expect(renderSection({ version: '0.19.0', date: '2026-11-22', entries })).toBe(
      [
        '## 0.19.0 (2026-11-22)',
        '',
        '- Add viewport (#1)',
        '- Rename option (#2)',
        '',
        '### Bug Fixes',
        '',
        '- Fix seek (#3)',
        '',
        '### Dependency updates',
        '',
        '- Bump undici (#4)'
      ].join('\n')
    )

    const onlyBugs = renderSection({ version: '0.18.2', date: '2026-11-22', entries: [entries[1]] })
    expect(onlyBugs).not.toContain('Dependency updates')
    expect(onlyBugs).toContain('### Bug Fixes')
    expect(onlyBugs).not.toMatch(/^- Add/m)
  })
})

describe('prependSection', () => {
  it('inserts above the newest version and keeps history', () => {
    const history = [
      '# Change Log',
      '',
      'All notable changes to this project will be documented in this file.',
      '',
      '## [0.18.1](https://example.test/compare) (2026-10-26)',
      '',
      '### Bug Fixes',
      '',
      '- **core:** remove the black core background',
      '',
      '# [0.18.0](https://example.test/compare) (2026-10-20)',
      ''
    ].join('\n')
    const section = renderSection({
      version: '0.19.0',
      date: '2026-11-22',
      entries: [{ title: 'Add viewport', number: 1, labels: [] }]
    })

    const result = prependSection(history, section)
    const resultLines = result.split('\n')

    expect(resultLines[4]).toBe('## 0.19.0 (2026-11-22)')
    expect(result.indexOf('## 0.19.0')).toBeLessThan(result.indexOf('## [0.18.1]'))
    history.split('\n').forEach(line => expect(resultLines).toContain(line))
    expect(result.replace(`${section}\n\n`, '')).toBe(history)
  })

  it('starts the file with the section when the changelog is empty', () => {
    expect(prependSection('', '## 1.0.0 (d)')).toBe('## 1.0.0 (d)\n')
  })
})
