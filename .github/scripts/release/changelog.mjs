const VERSION_HEADING = /^#{1,2} \[?\d+\.\d+\.\d+/m

const GROUPS = [
  { label: null, heading: null },
  { label: 'bug', heading: '### Bug Fixes' },
  { label: 'dependencies', heading: '### Dependency updates' }
]

// `dependencies` wins over `bug`: a dependency bump that mentions a fix is still a bump.
function groupOf(labels) {
  if (labels.includes('dependencies')) return GROUPS[2]
  if (labels.includes('bug')) return GROUPS[1]
  return GROUPS[0]
}

function renderLine({ prefix, title, number }) {
  const scope = prefix ? `**${prefix}:** ` : ''
  return `- ${scope}${title} (#${number})`
}

export function renderSection({ version, date, preface, entries }) {
  const blocks = [`## ${version} (${date})`]
  if (preface) blocks.push(preface)

  for (const group of GROUPS) {
    const lines = entries.filter(entry => groupOf(entry.labels) === group).map(renderLine)
    if (lines.length === 0) continue

    blocks.push(group.heading ? `${group.heading}\n\n${lines.join('\n')}` : lines.join('\n'))
  }

  return blocks.join('\n\n')
}

export function prependSection(changelog, section) {
  const newest = changelog.search(VERSION_HEADING)
  if (newest === -1) {
    const head = changelog.trimEnd()
    return head ? `${head}\n\n${section}\n` : `${section}\n`
  }

  return `${changelog.slice(0, newest)}${section}\n\n${changelog.slice(newest)}`
}
