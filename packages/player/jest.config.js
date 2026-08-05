const base = require('../../jest.config.base')

module.exports = {
  ...base,
  testPathIgnorePatterns: ['/node_modules/', 'dist\\.smoke\\.test\\.js$'],
  // Dist bundles are too large for babel-jest; they are already CJS-compatible.
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/clappr\\.js$',
    '<rootDir>/dist/clappr\\.min\\.js$',
    '<rootDir>/dist/clappr\\.plainhtml5\\.js$',
    '<rootDir>/dist/clappr\\.plainhtml5\\.min\\.js$'
  ]
}
