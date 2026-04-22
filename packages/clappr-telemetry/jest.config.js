const path = require('path')

module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {},
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@clappr/core$': path.resolve(__dirname, 'src/test-support/clappr-core-mock.js')
  }
}
