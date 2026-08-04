const base = require('../../jest.config.base')
const pkg = require('./package.json')

module.exports = {
  ...base,
  // Dist bundles are too large for babel-jest; they are already CJS-compatible.
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/clappr\\.js$',
    '<rootDir>/dist/clappr\\.min\\.js$',
    '<rootDir>/dist/clappr\\.plainhtml5\\.js$',
    '<rootDir>/dist/clappr\\.plainhtml5\\.min\\.js$'
  ],
  globals: {
    VERSION: pkg.version,
    CLAPPR_VERSION: pkg.version
  }
}
