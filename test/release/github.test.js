import { createGithub, findPullRequest } from '../../.github/scripts/release/github.mjs'

describe('findPullRequest', () => {
  it('throws when the API call fails', async () => {
    const failing = createGithub({
      token: 'token',
      repo: 'clappr/clappr',
      fetchImpl: async () => ({ ok: false, status: 502 })
    })
    const unreachable = createGithub({
      token: 'token',
      repo: 'clappr/clappr',
      fetchImpl: async () => {
        throw new Error('network down')
      }
    })

    await expect(findPullRequest({ request: failing.request, sha: 'abc' })).rejects.toThrow('502')
    await expect(findPullRequest({ request: unreachable.request, sha: 'abc' })).rejects.toThrow(
      'network down'
    )
  })
})
