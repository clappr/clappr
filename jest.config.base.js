module.exports = {
  testEnvironment: 'jsdom',
  verbose: true,
  transform: {
    '^.+\\.js$': ['babel-jest', {
      babelrc: false,
      configFile: false,
      presets: require('./babel.base.json').env.test.presets.map(
        ([name, options = {}]) => [name, { ...options, modules: 'commonjs' }]
      )
    }]
  },
  moduleNameMapper: {
    '\\.(scss)(\\?inline)?$': '<rootDir>/../clappr-core/src/__mocks__/styleMock.js',
    '\\.(html)\\?raw$': '<rootDir>/../clappr-core/src/__mocks__/htmlRawMock.js'
  }
}
