import Version from './version'

describe('Version', () => {
  describe('parse', () => {
    test('parses a version string in the format major.minor.patch', () => {
      const v = Version.parse('1.2.3')
      expect(v.major).toEqual(1)
      expect(v.minor).toEqual(2)
      expect(v.patch).toEqual(3)
    })

    test('parses a version string in the format major.minor (patch omitted)', () => {
      const v = Version.parse('1.2')
      expect(v.major).toEqual(1)
      expect(v.minor).toEqual(2)
      expect(v.patch).toEqual(0)
    })

    test('parses a version string in the format major (minor, patch omitted)', () => {
      const v = Version.parse('1')
      expect(v.major).toEqual(1)
      expect(v.minor).toEqual(0)
      expect(v.patch).toEqual(0)
    })

    test('returns null when version is not in the right format', () => {
      const v = Version.parse('a.x')
      expect(v).toBeNull()
    })
  })

  describe('compare', () => {
    test('returns 0 if versions are equivalent', () => {
      const v1 = Version.parse('1.2')
      const v2 = Version.parse('1.2.0')
      expect(v1.compare(v2)).toEqual(0)
    })

    test('returns a number greater than 0 if the version is greater than the specified', () => {
      const v = Version.parse('1.2.1')
      expect(v.compare(Version.parse('0.0.1'))).toBeGreaterThan(0)
      expect(v.compare(Version.parse('0.1.0'))).toBeGreaterThan(0)
      expect(v.compare(Version.parse('1.0.0'))).toBeGreaterThan(0)
      expect(v.compare(Version.parse('1.2.0'))).toBeGreaterThan(0)
    })

    test('returns less than 0 if the version is less than the specified', () => {
      const v = Version.parse('1.2.1')
      expect(v.compare(Version.parse('2.0.0'))).toBeLessThan(0)
      expect(v.compare(Version.parse('1.4.0'))).toBeLessThan(0)
      expect(v.compare(Version.parse('1.2.3'))).toBeLessThan(0)
    })
  })

  describe('satisfies', () => {
    test('returns true if the version is within the determined range', () => {
      const v = Version.parse('1.3.0')
      const min = Version.parse('1.0.0')
      const max = Version.parse('2.0.0')
      expect(v.satisfies(min, max)).toBeTruthy()
    })

    test('returns false if the version is out of the determined range', () => {
      const v = Version.parse('1.0.0')
      const min = Version.parse('1.3.0')
      const max = Version.parse('2.0.0')
      expect(v.satisfies(min, max)).toBeFalsy()
    })
  })
})
