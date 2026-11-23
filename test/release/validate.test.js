import { validateDispatch } from '../../.github/scripts/release/validate.mjs'

const SHA = 'abc123'
const SUCCESS = { status: 'completed', conclusion: 'success' }

describe('validateDispatch', () => {
  it('refuses a ref other than main', () => {
    expect(() =>
      validateDispatch({ ref: 'refs/heads/feat/release', sha: SHA, ciRun: SUCCESS })
    ).toThrow('Release only runs from main')
    expect(() => validateDispatch({ ref: 'refs/tags/v1', sha: SHA, ciRun: SUCCESS })).toThrow(
      'Release only runs from main'
    )
  })

  it('accepts only a completed successful CI run', () => {
    const ref = 'refs/heads/main'

    expect(() => validateDispatch({ ref, sha: SHA, ciRun: null })).toThrow(
      `No CI run found for ${SHA}`
    )
    expect(() =>
      validateDispatch({ ref, sha: SHA, ciRun: { status: 'in_progress', conclusion: null } })
    ).toThrow("still 'in_progress'")
    expect(() =>
      validateDispatch({ ref, sha: SHA, ciRun: { status: 'completed', conclusion: 'failure' } })
    ).toThrow("concluded 'failure'")
    expect(() => validateDispatch({ ref, sha: SHA, ciRun: SUCCESS })).not.toThrow()
  })
})
