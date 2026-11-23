import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const WORKSPACE_PARENTS = ['apps', 'packages']

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

export function writeJson(path, json) {
  writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`)
}

export function readWorkspaces(root) {
  const workspaces = []

  for (const parent of WORKSPACE_PARENTS) {
    if (!existsSync(join(root, parent))) continue

    for (const folder of readdirSync(join(root, parent)).sort()) {
      const manifest = join(root, parent, folder, 'package.json')
      if (!existsSync(manifest)) continue

      const { name, version, private: isPrivate } = readJson(manifest)
      workspaces.push({ name, version, isPrivate: Boolean(isPrivate), dir: `${parent}/${folder}` })
    }
  }

  return workspaces
}
