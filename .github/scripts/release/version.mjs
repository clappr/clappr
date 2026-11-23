const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/

export function nextVersion(current, bump) {
  const match = SEMVER.exec(current)
  if (!match) throw new Error(`Cannot bump "${current}": not a plain major.minor.patch version`)

  const [major, minor, patch] = match.slice(1).map(Number)

  if (bump === 'major') return `${major + 1}.0.0`
  if (bump === 'minor') return `${major}.${minor + 1}.0`
  if (bump === 'patch') return `${major}.${minor}.${patch + 1}`
  throw new Error(`Unknown bump "${bump}": expected patch, minor or major`)
}
