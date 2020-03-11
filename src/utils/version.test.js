import Version from './version'

describe('Version', function() {
  describe('parse', function() {
    it('parses a version string in the format major.minor.patch', function() {
      const v = Version.parse('1.2.3')
      expect(v.major).to.be.equal(1)
      expect(v.minor).to.be.equal(2)
      expect(v.patch).to.be.equal(3)
    })

    it('parses a version string in the format major.minor (patch omitted)', function() {
      const v = Version.parse('1.2')
      expect(v.major).to.be.equal(1)
      expect(v.minor).to.be.equal(2)
      expect(v.patch).to.be.equal(0)
    })

    it('parses a version string in the format major (minor, patch omitted)', function() {
      const v = Version.parse('1')
      expect(v.major).to.be.equal(1)
      expect(v.minor).to.be.equal(0)
      expect(v.patch).to.be.equal(0)
    })

    it('returns null when version is not in the right format', function() {
      const v = Version.parse('a.x')
      expect(v).to.be.null
    })
  })

  describe('compare', function() {
    it('returns 0 if versions are equivalent', function() {
      const v1 = Version.parse('1.2')
      const v2 = Version.parse('1.2.0')
      expect(v1.compare(v2)).to.equal(0)
    })

    it('returns a number greater than 0 if the version is greater than the specified', function() {
      const v = Version.parse('1.2.1')
      expect(v.compare(Version.parse('0.0.1'))).to.be.gt(0)
      expect(v.compare(Version.parse('0.1.0'))).to.be.gt(0)
      expect(v.compare(Version.parse('1.0.0'))).to.be.gt(0)
      expect(v.compare(Version.parse('1.2.0'))).to.be.gt(0)
    })

    it('returns less than 0 if the version is less than the specified', function() {
      const v = Version.parse('1.2.1')
      expect(v.compare(Version.parse('2.0.0'))).to.be.lt(0)
      expect(v.compare(Version.parse('1.4.0'))).to.be.lt(0)
      expect(v.compare(Version.parse('1.2.3'))).to.be.lt(0)
    })
  })

  describe('satisfies', function() {
    it('returns true if the version is within the determined range', function() {
      const v = Version.parse('1.3.0')
      const min = Version.parse('1.0.0')
      const max = Version.parse('2.0.0')
      expect(v.satisfies(min, max)).to.be.true
    })

    it('returns false if the version is out of the determined range', function() {
      const v = Version.parse('1.0.0')
      const min = Version.parse('1.3.0')
      const max = Version.parse('2.0.0')
      expect(v.satisfies(min, max)).to.be.false
    })
  })
})
