const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  testEnvironment: 'jsdom',
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.html$': '<rootDir>/src/__mocks__/htmlMock.js'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^clappr$': '<rootDir>/node_modules/@clappr/core/dist/clappr-core.js',
    '\\.(scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(svg)$': '<rootDir>/src/__mocks__/svgMock.js',
    '^clappr-zepto$': 'clappr-zepto/zepto.js'
  },
  collectCoverageFrom: ['src/*.js', 'src/**/*.js', 'src/**/**/*.js'],
  globals: { CLAPPR_CORE_VERSION: ClapprCorePkg.version }
}
