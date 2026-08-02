const ClapprCorePkg = require('@clappr/core/package.json')

module.exports = {
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
    '^.+\\.html$': '<rootDir>/src/__mocks__/htmlMock.js'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@clappr/core$': '<rootDir>/../clappr-core/src/main.js',
    '^@clappr/zepto$': '<rootDir>/../clappr-zepto/src/zepto.js',
    '\\.(scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(svg)$': '<rootDir>/src/__mocks__/svgMock.js'
  },
  collectCoverageFrom: ['src/*.js', 'src/**/*.js', 'src/**/**/*.js'],
  globals: {
    CLAPPR_CORE_VERSION: ClapprCorePkg.version,
    VERSION: ClapprCorePkg.version
  }
}
