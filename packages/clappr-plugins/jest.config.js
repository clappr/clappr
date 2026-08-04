const base = require('../../jest.config.base')
const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  ...base,
  transform: {
    ...base.transform,
    '^.+\\.html$': '<rootDir>/src/__mocks__/htmlMock.js'
  },
  // Dist UMD/min builds are too large for babel-jest; they are already CJS-compatible.
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/clappr-plugins\\.js$',
    '<rootDir>/dist/clappr-plugins\\.min\\.js$'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@clappr/core$': '<rootDir>/../clappr-core/src/main.js',
    '^@clappr/zepto$': '<rootDir>/../clappr-zepto/src/zepto.js',
    '\\.(scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(svg)$': '<rootDir>/src/__mocks__/svgMock.js'
  },
  collectCoverageFrom: ['src/*.js', 'src/**/*.js', 'src/**/**/*.js', '!src/**/dist.smoke.test.js'],
  globals: {
    CLAPPR_CORE_VERSION: ClapprCorePkg.version,
    VERSION: ClapprCorePkg.version
  }
}
