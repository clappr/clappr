const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  // Explicit since jest 27 flipped the default to 'node'; these suites need DOM.
  testEnvironment: 'jsdom',
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^clappr$': '<rootDir>/node_modules/@clappr/core/dist/clappr-core.js'
  },
  globals: { CLAPPR_CORE_VERSION: ClapprCorePkg.version }
}
