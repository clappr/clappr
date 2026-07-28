const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  verbose: true,
  transform: { '^.+\\.js$': 'babel-jest' },
  collectCoverageFrom: ['src/*.js', 'src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^clappr$': '<rootDir>/node_modules/@clappr/core/dist/clappr-core.js',
  },
  globals: { CLAPPR_CORE_VERSION: ClapprCorePkg.version },
}
