const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  // Explicit since jest 27 flipped the default to 'node'; these suites need DOM.
  testEnvironment: 'jsdom',
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  globals: { CLAPPR_CORE_VERSION: ClapprCorePkg.version }
}
