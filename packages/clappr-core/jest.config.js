const pkg = require('./package.json')

module.exports = {
  'globals': {
    'VERSION': pkg.version
  },
  'verbose': true,
  'resolver': 'jest-directory-named-resolver',
  'transform': {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.html$': '<rootDir>/src/__mocks__/htmlMock.js'
  },
  'moduleNameMapper': {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^clappr-zepto$': 'clappr-zepto/zepto.js',
    '\\.(scss)$': '<rootDir>/src/__mocks__/styleMock.js'
  },
  'collectCoverageFrom': [
    'src/*.js',
    'src/**/*.js',
    'src/**/**/*.js'
  ]
}
