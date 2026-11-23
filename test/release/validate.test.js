import { validateDispatch } from '../../.github/scripts/release/validate.mjs'

const SHA = 'abc123'
const SUCCESS = { status: 'completed', conclusion: 'success' }

describe('validateDispatch', () => {
  it.each(['refs/heads/feat/release', 'refs/tags/v1'])('refuses the ref %s', ref => {
    expect(() => validateDispatch({ ref, sha: SHA, ciRun: SUCCESS })).toThrow(
      'Release only runs from main'
    )
  })

  it.each([
    ['no CI run', null, `No CI run found for ${SHA}`],
    ['a CI run in progress', { status: 'in_progress', conclusion: null }, "still 'in_progress'"],
    ['a failed CI run', { status: 'completed', conclusion: 'failure' }, "concluded 'failure'"]
  ])('refuses %s', (_label, ciRun, message) => {
    expect(() => validateDispatch({ ref: 'refs/heads/main', sha: SHA, ciRun })).toThrow(message)
  })

  it('accepts a completed successful CI run', () => {
    expect(() =>
      validateDispatch({ ref: 'refs/heads/main', sha: SHA, ciRun: SUCCESS })
    ).not.toThrow()
  })
})
