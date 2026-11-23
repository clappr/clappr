import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { prependSection } from './changelog.mjs'
import { updateRanges } from './ranges.mjs'
import { readJson, writeJson } from './workspaces.mjs'

export function applyRelease({ root, plan, git }) {
  const manifestFile = `${plan.dir}/package.json`
  const changelogFile = `${plan.dir}/CHANGELOG.md`

  const manifest = readJson(join(root, manifestFile))
  manifest.version = plan.version
  writeJson(join(root, manifestFile), manifest)

  const changelogPath = join(root, changelogFile)
  writeFileSync(changelogPath, prependSection(readFileSync(changelogPath, 'utf8'), plan.section))

  const rangeFiles = updateRanges({ root, name: plan.name, version: plan.version })

  git.run(['add', '--', manifestFile, changelogFile, ...rangeFiles])
  git.run(['commit', '--message', `chore(release): ${plan.tag}`])
  git.run(['tag', plan.tag])
}
