const VERSION_REGEX = /(\d+)(?:\.(\d+))?(?:\.(\d+))?/

export default class Version {
  static parse(str = '') {
    const matches = str.match(VERSION_REGEX) || []
    const [,major, minor, patch] = matches
    if (typeof(major) === 'undefined') return null

    return new Version(major, minor, patch)
  }

  constructor(major, minor, patch) {
    this.major = parseInt(major || 0, 10)
    this.minor = parseInt(minor || 0, 10)
    this.patch = parseInt(patch || 0, 10)
  }

  compare(other) {
    let diff = this.major - other.major
    diff = diff || (this.minor - other.minor)
    diff = diff || (this.patch - other.patch)
    return diff
  }

  inc(type = 'patch') {
    typeof(this[type]) !== 'undefined' && (this[type] += 1)
    return this
  }

  satisfies(min, max) {
    return this.compare(min) >= 0 && (!max || this.compare(max) < 0)
  }

  toString() {
    return `${this.major}.${this.minor}.${this.patch}`
  }
}
