import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { updateRanges } from '../../.github/scripts/release/ranges.mjs'
import { createWorkspaceRepo } from './fixtures'

describe('updateRanges', () => {
  let repo

  beforeEach(() => {
    repo = createWorkspaceRepo()
  })

  afterEach(() => repo.cleanup())

  const read = dir => JSON.parse(readFileSync(join(repo.root, dir, 'package.json'), 'utf8'))

  it('rewrites dependents ranges and keeps star', () => {
    const changed = updateRanges({ root: repo.root, name: '@clappr/core', version: '0.19.0' })

    expect(read('packages/player').devDependencies['@clappr/core']).toBe('^0.19.0')
    expect(read('packages/clappr-telemetry').peerDependencies['@clappr/core']).toBe('^0.19.0')

    const plugins = read('packages/clappr-plugins')
    expect(plugins.dependencies['@clappr/core']).toBe('^0.19.0')
    expect(plugins.devDependencies['@clappr/core']).toBe('^0.19.0')
    expect(plugins.peerDependencies['@clappr/core']).toBe('*')

    expect(read('packages/player').version).toBe('0.14.10')
    expect(read('packages/clappr-core').version).toBe('0.18.1')
    expect(changed.sort()).toEqual([
      'packages/clappr-plugins/package.json',
      'packages/clappr-telemetry/package.json',
      'packages/player/package.json'
    ])
  })
})
