import { renderSection } from './changelog.mjs'
import { nextVersion } from './version.mjs'

const PLAYER = '@clappr/player'
const LOOKUP_CHUNK_SIZE = 10

// AD-004: what the Player bundle is built from (`clapprSiblingSourceAlias` in vite.config.base.mjs).
// zepto is private and published inside core, so its PRs are attributed to core.
const BUNDLE = [
  { name: PLAYER, prefix: 'player', dirs: ['packages/player'] },
  { name: '@clappr/core', prefix: 'core', dirs: ['packages/clappr-core', 'packages/clappr-zepto'] },
  { name: '@clappr/plugins', prefix: 'plugins', dirs: ['packages/clappr-plugins'] },
  { name: '@clappr/hlsjs-playback', prefix: 'hlsjs-playback', dirs: ['packages/hlsjs-playback'] }
]
const PUBLISHED_WITH_PLAYER = BUNDLE.filter(entry => entry.name !== PLAYER)

function touches(files, dirs) {
  return files.some(file => dirs.some(dir => file.startsWith(`${dir}/`)))
}

async function inChunks(items, lookup) {
  const results = []
  for (let start = 0; start < items.length; start += LOOKUP_CHUNK_SIZE) {
    const chunk = items.slice(start, start + LOOKUP_CHUNK_SIZE)
    results.push(...(await Promise.all(chunk.map(lookup))))
  }
  return results
}

// One entry per merged PR, however many of its rebased commits are in the range. Commits with no
// PR (direct pushes, the previous release commit) contribute nothing.
async function collectPullRequests({ git, pullRequestOf, tag, groups }) {
  const touching = git
    .commitsSince(tag)
    .map(commit => ({ commit, matched: groups.filter(group => touches(commit.files, group.dirs)) }))
    .filter(({ matched }) => matched.length > 0)

  const pullRequests = await inChunks(touching, ({ commit }) => pullRequestOf(commit.sha))
  const found = new Map()

  touching.forEach(({ matched }, index) => {
    const pullRequest = pullRequests[index]
    if (!pullRequest) return

    const entry = found.get(pullRequest.number) ?? { ...pullRequest, prefixes: new Set() }
    matched.forEach(group => group.prefix && entry.prefixes.add(group.prefix))
    found.set(pullRequest.number, entry)
  })

  return [...found.values()]
    .sort((first, second) => first.number - second.number)
    .map(({ prefixes, ...pullRequest }) => ({ ...pullRequest, prefix: [...prefixes].join(', ') }))
}

function requireTag(git, tag) {
  if (!git.tagExists(tag)) {
    throw new Error(`Tag ${tag} not found. Fetch tags, or tag the commit that published it.`)
  }
}

function workspaceOf(workspaces, name) {
  return workspaces.find(workspace => workspace.name === name)
}

async function assertBundleReleased({ workspaces, git, pullRequestOf }) {
  const unreleased = []

  for (const bundled of PUBLISHED_WITH_PLAYER) {
    const tag = `${bundled.name}@${workspaceOf(workspaces, bundled.name).version}`
    requireTag(git, tag)

    const pullRequests = await collectPullRequests({
      git,
      pullRequestOf,
      tag,
      groups: [{ prefix: '', dirs: bundled.dirs }]
    })
    if (pullRequests.length === 0) continue

    const numbers = pullRequests.map(({ number }) => `#${number}`).join(', ')
    unreleased.push(`${bundled.name} has unreleased PRs: ${numbers}. Release it first.`)
  }

  if (unreleased.length > 0) throw new Error(unreleased.join('\n'))
}

function renderVersionTable({ workspaces, git, previousTag }) {
  const rows = PUBLISHED_WITH_PLAYER.map(({ name }) => {
    const workspace = workspaceOf(workspaces, name)
    return `| ${name} | ${git.versionAt(previousTag, workspace.dir)} | ${workspace.version} |`
  })

  return ['| Package | Before | Now |', '| --- | --- | --- |', ...rows].join('\n')
}

function describeEntries(pullRequests) {
  return pullRequests.map(({ prefix, title, number, labels }) => ({
    prefix,
    title,
    number,
    labels
  }))
}

export async function planRelease({ packageName, bump, now, workspaces, git, github, npm }) {
  const workspace = workspaceOf(workspaces, packageName)
  if (!workspace || workspace.isPrivate) {
    throw new Error(`Unknown publishable package "${packageName}"`)
  }

  const current = workspace.version
  const currentTag = `${packageName}@${current}`

  // The tag exists but npm lacks the version: a previous run failed between push and publish.
  if (
    git.tagExists(currentTag) &&
    !(await npm.isPublished({ name: packageName, version: current }))
  ) {
    return {
      mode: 'recover',
      name: packageName,
      dir: workspace.dir,
      version: current,
      tag: currentTag
    }
  }
  requireTag(git, currentTag)

  const memo = new Map()
  const pullRequestOf = sha => {
    if (!memo.has(sha)) memo.set(sha, github.findPullRequest(sha))
    return memo.get(sha)
  }

  const isPlayer = packageName === PLAYER
  if (isPlayer) await assertBundleReleased({ workspaces, git, pullRequestOf })

  const groups = isPlayer
    ? BUNDLE.map(({ prefix, dirs }) => ({ prefix, dirs }))
    : [
        {
          prefix: '',
          dirs: BUNDLE.find(entry => entry.name === packageName)?.dirs ?? [workspace.dir]
        }
      ]
  const pullRequests = await collectPullRequests({ git, pullRequestOf, tag: currentTag, groups })

  if (pullRequests.length === 0) throw new Error(`Nothing to release for ${packageName}`)

  const version = nextVersion(current, bump)
  const section = renderSection({
    version,
    date: now.toISOString().slice(0, 10),
    preface: isPlayer
      ? renderVersionTable({ workspaces, git, previousTag: currentTag })
      : undefined,
    entries: describeEntries(pullRequests)
  })

  return {
    mode: 'release',
    name: packageName,
    dir: workspace.dir,
    current,
    version,
    tag: `${packageName}@${version}`,
    section,
    gate: isPlayer ? 'passed' : undefined
  }
}

export function renderSummary(plan, { isPreview }) {
  const title = isPreview ? 'Release preview' : 'Release'

  if (plan.mode === 'recover') {
    return [
      `## ${title}`,
      '',
      `Recovery: tag \`${plan.tag}\` exists but npm does not serve ${plan.version}.`,
      `Publishes \`${plan.name}@${plan.version}\` as it is: no bump, commit or tag.`,
      ''
    ].join('\n')
  }

  const lines = [
    `## ${title}`,
    '',
    `- **Package:** \`${plan.name}\``,
    `- **Current version:** ${plan.current}`,
    `- **Next version:** ${plan.version}`
  ]
  if (plan.gate) lines.push(`- **Player gate:** ${plan.gate}`)

  return [...lines, '', '### Changelog section', '', '````markdown', plan.section, '````', ''].join(
    '\n'
  )
}
