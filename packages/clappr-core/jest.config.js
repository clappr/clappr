const base = require('../../jest.config.base')
const pkg = require('./package.json')

module.exports = {
  ...base,
  globals: {
    VERSION: pkg.version
  },
  transform: {
    ...base.transform,
    '^.+\\.html$': '<rootDir>/src/__mocks__/htmlMock.js'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@clappr/zepto$': '<rootDir>/../clappr-zepto/src/zepto.js',
    '\\.(scss)$': '<rootDir>/src/__mocks__/styleMock.js'
  },
  collectCoverageFrom: [
    'src/*.js',
    'src/**/*.js',
    'src/**/**/*.js'
  ]
}
