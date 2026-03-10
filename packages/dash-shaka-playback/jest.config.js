const ClapprCorePkg = require('@clappr/core/package.json')

// Use the compiled dist to avoid babel-jest transform issues with monorepo source files
const clapprCoreDist = require.resolve('@clappr/core')

module.exports = {
  testEnvironment: 'jsdom',
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^clappr$': clapprCoreDist,
    '^@clappr/core$': clapprCoreDist,
    '^clappr-zepto$': 'clappr-zepto/zepto.js',
  },
  globals: { VERSION: ClapprCorePkg.version },
}
