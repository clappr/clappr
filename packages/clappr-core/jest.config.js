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
  // Dist UMD/min bundles are already CJS-compatible and too large for babel-jest.
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/clappr-core\\.js$',
    '<rootDir>/dist/clappr-core\\.min\\.js$'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@clappr/zepto$': '<rootDir>/../clappr-zepto/src/zepto.js',
    '\\.(scss)$': '<rootDir>/src/__mocks__/styleMock.js'
  },
  collectCoverageFrom: [
    'src/*.js',
    'src/**/*.js',
    'src/**/**/*.js',
    '!src/**/dist.smoke.test.js'
  ]
}
