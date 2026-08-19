const base = require('../../jest.config.base')
const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  ...base,
  testPathIgnorePatterns: ['/node_modules/', 'dist\\.smoke\\.test\\.js$'],
  transform: {
    ...base.transform,
    '^.+\\.html$': '<rootDir>/../clappr-core/src/__mocks__/htmlMock.js'
  },
  moduleNameMapper: {
    '^@clappr/core$': '<rootDir>/../clappr-core/src/main.js',
    '^@clappr/zepto$': '<rootDir>/../clappr-zepto/src/zepto.js',
    '\\.(scss)(\\?inline)?$': '<rootDir>/../clappr-core/src/__mocks__/styleMock.js',
    '\\.(html)\\?raw$': '<rootDir>/../clappr-core/src/__mocks__/htmlRawMock.js'
  },
  globals: {
    VERSION: ClapprCorePkg.version
  },
  collectCoverageFrom: ['src/*.js', 'src/**/*.js', '!src/**/dist.smoke.test.js'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
