import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHANGELOG = `# Change Log

All notable changes to this project will be documented in this file.

## [0.18.1](https://example.test/compare) (2026-10-26)

### Bug Fixes

- **core:** remove the black core background
`

const MANIFESTS = {
  'packages/clappr-core': { name: '@clappr/core', version: '0.18.1' },
  'packages/player': {
    name: '@clappr/player',
    version: '0.14.10',
    devDependencies: { '@clappr/core': '^0.18.1' }
  },
  'packages/clappr-plugins': {
    name: '@clappr/plugins',
    version: '0.9.18',
    dependencies: { '@clappr/core': '^0.18.1' },
    devDependencies: { '@clappr/core': '^0.18.1' },
    peerDependencies: { '@clappr/core': '*' }
  },
  'packages/clappr-telemetry': {
    name: '@clappr/telemetry',
    version: '0.3.10',
    peerDependencies: { '@clappr/core': '^0.18.1' }
  }
}

export function createWorkspaceRepo() {
  const root = mkdtempSync(join(tmpdir(), 'clappr-release-'))

  for (const [dir, manifest] of Object.entries(MANIFESTS)) {
    mkdirSync(join(root, dir), { recursive: true })
    writeFileSync(join(root, dir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`)
    writeFileSync(join(root, dir, 'CHANGELOG.md'), CHANGELOG)
  }

  return {
    root,
    manifests: MANIFESTS,
    cleanup: () => rmSync(root, { recursive: true, force: true })
  }
}

export function initGitRepo(root) {
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' })

  git('init', '--quiet')
  git('config', 'user.name', 'Release Test')
  git('config', 'user.email', 'release@example.test')
  git('config', 'commit.gpgsign', 'false')
  git('add', '.')
  git('commit', '--quiet', '--message', 'chore: initial')

  return git
}
