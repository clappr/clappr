const base = require('../../jest.config.base')
const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  ...base,
  testPathIgnorePatterns: ['/node_modules/', 'dist\\.smoke\\.test\\.js$'],
  transform: {
    ...base.transform,
    '^.+\\.html$': '<rootDir>/../clappr-core/src/__mocks__/htmlMock.js'
  },
  // The hls.js-embedded UMD builds are too large for babel-jest; they are
  // already CJS-compatible.
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/hlsjs-playback\\.js$',
    '<rootDir>/dist/hlsjs-playback\\.min\\.js$'
  ],
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
  collectCoverageFrom: ['src/hls.js'],
  coveragePathIgnorePatterns: ['/dist/', '/node_modules/'],
  coverageThreshold: {
    global: {
      statements: 79,
      branches: 74,
      functions: 63,
      lines: 81
    }
  }
}
