const base = require('../../jest.config.base')

module.exports = {
  ...base,
  testPathIgnorePatterns: ['/node_modules/', 'dist\\.smoke\\.test\\.js$'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
}
