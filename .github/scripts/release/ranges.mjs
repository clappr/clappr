import { join } from 'node:path'
import { readJson, readWorkspaces, writeJson } from './workspaces.mjs'

const RANGE_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies']

// A `*` range means "any version" (peer dependencies on core), so it never needs to follow a release.
export function updateRanges({ root, name, version }) {
  const changedFiles = []

  for (const workspace of readWorkspaces(root)) {
    if (workspace.name === name) continue

    const manifestPath = join(root, workspace.dir, 'package.json')
    const manifest = readJson(manifestPath)
    let isChanged = false

    for (const field of RANGE_FIELDS) {
      const range = manifest[field]?.[name]
      if (range === undefined || range === '*') continue

      manifest[field][name] = `^${version}`
      isChanged = true
    }

    if (!isChanged) continue

    writeJson(manifestPath, manifest)
    changedFiles.push(`${workspace.dir}/package.json`)
  }

  return changedFiles
}
