const base = require('../../jest.config.base')
const pkg = require('./package.json')

module.exports = {
  ...base,
  // Player dist bundles are ~1.8 MB and already CJS-compatible; babel-jest
  // would make smoke tests prohibitively slow.
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
