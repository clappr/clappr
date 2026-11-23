import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { applyRelease } from '../../.github/scripts/release/apply.mjs'
import { createGit } from '../../.github/scripts/release/git.mjs'
import { createWorkspaceRepo, initGitRepo } from './fixtures'

const PLAN = {
  mode: 'release',
  name: '@clappr/core',
  dir: 'packages/clappr-core',
  current: '0.18.1',
  version: '0.19.0',
  tag: '@clappr/core@0.19.0',
  section: '## 0.19.0 (2026-11-22)\n\n- Add viewport API (#2601)'
}

describe('applyRelease', () => {
  let repo
  let git

  beforeEach(() => {
    repo = createWorkspaceRepo()
    git = initGitRepo(repo.root)
  })

  afterEach(() => repo.cleanup())

  const versionOf = dir =>
    JSON.parse(readFileSync(join(repo.root, dir, 'package.json'), 'utf8')).version

  it('changes only the released package version', () => {
    applyRelease({ root: repo.root, plan: PLAN, git: createGit(repo.root) })

    expect(versionOf('packages/clappr-core')).toBe('0.19.0')
    expect(versionOf('packages/player')).toBe('0.14.10')
    expect(versionOf('packages/clappr-plugins')).toBe('0.9.18')
    expect(versionOf('packages/clappr-telemetry')).toBe('0.3.10')
  })

  it('creates one release commit tagged with the package version', () => {
    const commitsBefore = Number(git('rev-list', '--count', 'HEAD'))

    applyRelease({ root: repo.root, plan: PLAN, git: createGit(repo.root) })

    expect(Number(git('rev-list', '--count', 'HEAD'))).toBe(commitsBefore + 1)
    expect(git('log', '-1', '--format=%s').trim()).toBe('chore(release): @clappr/core@0.19.0')
    expect(git('rev-parse', 'refs/tags/@clappr/core@0.19.0^{commit}')).toBe(
      git('rev-parse', 'HEAD')
    )
    expect(git('status', '--porcelain')).toBe('')
  })
})
