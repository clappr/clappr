const base = require('../../jest.config.base')
const path = require('path')

module.exports = {
  ...base,
  testEnvironmentOptions: {},
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@clappr/core$': path.resolve(__dirname, 'src/test-support/clappr-core-mock.js')
  }
}
