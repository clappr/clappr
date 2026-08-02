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
  }
}
