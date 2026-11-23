const PLAYER_TAG_PREFIX = '@clappr/player@'

function compareVersions(first, second) {
  const [a, b] = [first, second].map(version => version.split('.').map(Number))
  const differing = a.findIndex((part, index) => part !== b[index])

  return differing === -1 ? 0 : a[differing] - b[differing]
}

export function latestPlayerTag(tags) {
  const playerTags = tags.filter(tag => tag.startsWith(PLAYER_TAG_PREFIX))
  if (playerTags.length === 0) throw new Error('No @clappr/player tag found')

  return playerTags.sort((first, second) =>
    compareVersions(second.slice(PLAYER_TAG_PREFIX.length), first.slice(PLAYER_TAG_PREFIX.length))
  )[0]
}

// The body of the `## <version>` section: everything up to the next version heading, minus the
// heading line itself. `###` subsections stay in.
export function extractSection(changelog, version) {
  const lines = changelog.split('\n')
  const start = lines.findIndex(
    line => line.startsWith(`## ${version} `) || line === `## ${version}`
  )
  if (start === -1) return null

  const length = lines.slice(start + 1).findIndex(line => /^#{1,2} /.test(line))
  const body = lines.slice(start + 1, length === -1 ? undefined : start + 1 + length)

  return body.join('\n').trim()
}

export async function publishNotes({ tag, tags, changelogAt, releases, warn }) {
  const playerTag = tag || latestPlayerTag(tags())
  const version = playerTag.slice(PLAYER_TAG_PREFIX.length)

  const body = extractSection(changelogAt(playerTag), version)
  if (!body) throw new Error(`No changelog section for ${playerTag}`)

  const release = await releases.find(playerTag)
  if (!release) {
    await releases.createDraft({ tag: playerTag, body })
    return 'created'
  }

  if (!release.isDraft) {
    warn(`${playerTag} already has a published release; leaving it unchanged.`)
    return 'unchanged'
  }

  await releases.updateBody({ id: release.id, body })
  return 'updated'
}
