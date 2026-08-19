const base = require('../../jest.config.base')
const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  ...base,
  testEnvironmentOptions: {},
  testPathIgnorePatterns: ['/node_modules/', 'dist\\.smoke\\.test\\.js$'],
  transform: {
    ...base.transform,
    '^.+\\.html$': '<rootDir>/../clappr-core/src/__mocks__/htmlMock.js'
  },
  // Dist UMD/min builds are too large for babel-jest; they are already CJS-compatible.
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/clappr-telemetry\\.js$',
    '<rootDir>/dist/clappr-telemetry\\.min\\.js$'
  ],
  moduleNameMapper: {
    '^@clappr/core$': '<rootDir>/../clappr-core/src/main.js',
    '^@clappr/zepto$': '<rootDir>/../clappr-zepto/src/zepto.js',
    '\\.(scss)(\\?inline)?$': '<rootDir>/../clappr-core/src/__mocks__/styleMock.js',
    '\\.(html)\\?raw$': '<rootDir>/../clappr-core/src/__mocks__/htmlRawMock.js'
  },
  globals: {
    VERSION: ClapprCorePkg.version
  }
}
