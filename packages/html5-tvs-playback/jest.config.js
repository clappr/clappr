const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
  // Explicit since jest 27 flipped the default to 'node'; these suites need DOM.
  testEnvironment: 'jsdom',
  verbose: true,
  transform: {
    // babelrc/configFile disabled so sibling @clappr/core and @clappr/zepto
    // source (ESM) is compiled to CJS when resolved via moduleNameMapper outside
    // rootDir. Presets come from babel.base.json env.test; modules is forced to
    // commonjs because babel-jest's caller hint is ignored when babelrc/configFile
    // are both false.
    '^.+\\.js$': ['babel-jest', {
      babelrc: false,
      configFile: false,
      presets: require('../../babel.base.json').env.test.presets.map(
        ([name, options = {}]) => [name, { ...options, modules: 'commonjs' }]
      )
    }],
    '^.+\\.html$': '<rootDir>/../clappr-core/src/__mocks__/htmlMock.js'
  },
  moduleNameMapper: {
    '^@clappr/core$': '<rootDir>/../clappr-core/src/main.js',
    '^@clappr/zepto$': '<rootDir>/../clappr-zepto/src/zepto.js',
    '\\.(scss)$': '<rootDir>/../clappr-core/src/__mocks__/styleMock.js'
  },
  globals: {
    VERSION: ClapprCorePkg.version
  },
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
