import { nextVersion } from '../../.github/scripts/release/version.mjs'

describe('nextVersion', () => {
  it('increments patch, minor and major', () => {
    expect(nextVersion('0.18.1', 'patch')).toBe('0.18.2')
    expect(nextVersion('0.18.1', 'minor')).toBe('0.19.0')
    expect(nextVersion('0.18.1', 'major')).toBe('1.0.0')
    expect(nextVersion('3.1.5', 'major')).toBe('4.0.0')
  })
})
