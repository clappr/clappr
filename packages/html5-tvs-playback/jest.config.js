module.exports = {
  // Explicit since jest 27 flipped the default to 'node'; these suites need DOM.
  testEnvironment: 'jsdom',
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
}
