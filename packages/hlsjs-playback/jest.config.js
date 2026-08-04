const base = require('../../jest.config.base')
const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  ...base,
  transform: {
    ...base.transform,
    '^.+\\.html$': '<rootDir>/../clappr-core/src/__mocks__/htmlMock.js'
  },
  // The hls.js-embedded UMD builds are too large for babel-jest; they are
  // already CJS-compatible. ESM stays transformable (.esm.js, not .mjs).
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
  coveragePathIgnorePatterns: ['/dist/', '/node_modules/']
}
