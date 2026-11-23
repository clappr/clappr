const API = 'https://api.github.com'

export function createGithub({ token, repo, fetchImpl = fetch }) {
  async function request(method, path, body) {
    const response = await fetchImpl(`${API}/repos/${repo}${path}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    })

    if (!response.ok) throw new Error(`GitHub API ${method} ${path} failed: ${response.status}`)
    return response.json()
  }

  return { request }
}

// A failed lookup must not read as "this commit has no PR": that would silently drop changelog lines.
export async function findPullRequest({ request, sha }) {
  const pulls = await request('GET', `/commits/${sha}/pulls`)
  const merged = pulls.find(pull => pull.merged_at)
  if (!merged) return null

  return {
    number: merged.number,
    title: merged.title,
    labels: merged.labels.map(label => label.name)
  }
}

// `event=push` mirrors the old workflow_run pair; workflow_dispatch lets a hand-run CI unblock a
// tip that had no push run (e.g. a past [skip ci] commit). pull_request runs are excluded.
export async function findCiRun({ request, sha }) {
  const { workflow_runs: runs } = await request(
    'GET',
    `/actions/workflows/ci.yml/runs?head_sha=${sha}&per_page=5`
  )
  const run = runs.find(candidate => ['push', 'workflow_dispatch'].includes(candidate.event))

  return run ? { status: run.status, conclusion: run.conclusion } : null
}

// Draft releases are invisible to `releases/tags/{tag}`, so the list is the only way to find one.
export async function findRelease({ request, tag }) {
  for (let page = 1; ; page++) {
    const releases = await request('GET', `/releases?per_page=100&page=${page}`)
    const release = releases.find(candidate => candidate.tag_name === tag)
    if (release) return { id: release.id, isDraft: release.draft }
    if (releases.length < 100) return null
  }
}

export async function createDraftRelease({ request, tag, body }) {
  await request('POST', '/releases', { tag_name: tag, name: tag, body, draft: true })
}

export async function updateReleaseBody({ request, id, body }) {
  await request('PATCH', `/releases/${id}`, { body })
}
