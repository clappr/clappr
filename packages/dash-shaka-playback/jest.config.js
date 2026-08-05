const base = require('../../jest.config.base')
const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  ...base,
  testPathIgnorePatterns: ['/node_modules/', 'dist\\.smoke\\.test\\.js$'],
  transform: {
    // Cover the published .esm.mjs artifact as well as source .js
    '^.+\\.m?js$': base.transform['^.+\\.js$'],
    '^.+\\.html$': '<rootDir>/../clappr-core/src/__mocks__/htmlMock.js'
  },
  // The shaka-embedded UMD builds are Closure-compiled and too large for babel-jest;
  // they are already CJS-compatible. Transform the ESM artifact so Jest can load it.
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/dash-shaka-playback\\.js$',
    '<rootDir>/dist/dash-shaka-playback\\.min\\.js$'
  ],
  moduleFileExtensions: ['js', 'mjs', 'json', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@clappr/core$': '<rootDir>/../clappr-core/src/main.js',
    '^@clappr/zepto$': '<rootDir>/../clappr-zepto/src/zepto.js',
    '\\.(scss)$': '<rootDir>/../clappr-core/src/__mocks__/styleMock.js'
  },
  globals: {
    CLAPPR_CORE_VERSION: ClapprCorePkg.version,
    VERSION: ClapprCorePkg.version
  },
  coveragePathIgnorePatterns: ['/dist/', '/node_modules/']
}
