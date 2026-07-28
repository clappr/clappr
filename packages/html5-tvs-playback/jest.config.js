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
}
