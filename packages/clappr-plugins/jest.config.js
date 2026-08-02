const base = require('../../jest.config.base')
const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  ...base,
  transform: {
    ...base.transform,
    '^.+\\.html$': '<rootDir>/src/__mocks__/htmlMock.js'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@clappr/core$': '<rootDir>/../clappr-core/src/main.js',
    '^@clappr/zepto$': '<rootDir>/../clappr-zepto/src/zepto.js',
    '\\.(scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(svg)$': '<rootDir>/src/__mocks__/svgMock.js'
  },
  collectCoverageFrom: ['src/*.js', 'src/**/*.js', 'src/**/**/*.js'],
  globals: {
    CLAPPR_CORE_VERSION: ClapprCorePkg.version,
    VERSION: ClapprCorePkg.version
  }
}
