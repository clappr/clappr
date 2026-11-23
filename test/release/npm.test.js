import { isPublished } from '../../.github/scripts/release/npm.mjs'

const answer = status => async () => ({ ok: status === 200, status })

describe('isPublished', () => {
  it('throws when the registry cannot answer', async () => {
    await expect(
      isPublished({ name: '@clappr/core', version: '0.19.0', fetchImpl: answer(503) })
    ).rejects.toThrow('could not answer')
    await expect(
      isPublished({
        name: '@clappr/core',
        version: '0.19.0',
        fetchImpl: async () => {
          throw new Error('timeout')
        }
      })
    ).rejects.toThrow('timeout')
  })

  it('reads 200 as published and 404 as absent', async () => {
    expect(await isPublished({ name: 'x', version: '1.0.0', fetchImpl: answer(200) })).toBe(true)
    expect(await isPublished({ name: 'x', version: '1.0.0', fetchImpl: answer(404) })).toBe(false)
  })
})
