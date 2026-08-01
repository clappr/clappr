const pkg = require('./package.json')

module.exports = {
  'testEnvironment': 'jsdom',
  'globals': {
    'VERSION': pkg.version
  },
  'verbose': true,
  'resolver': 'jest-directory-named-resolver',
  'transform': {
    // babelrc/configFile disabled so the sibling @clappr/zepto source (ESM
    // export default) is compiled to CJS when resolved via moduleNameMapper
    // outside rootDir. Presets come from babel.base.json env.test; modules
    // is forced to commonjs because babel-jest's caller hint is ignored when
    // babelrc/configFile are both false.
    '^.+\\.js$': ['babel-jest', {
      babelrc: false,
      configFile: false,
      presets: require('../../babel.base.json').env.test.presets.map(
        ([name, options = {}]) => [name, { ...options, modules: 'commonjs' }]
      )
    }],
    '^.+\\.html$': '<rootDir>/src/__mocks__/htmlMock.js'
  },
  'moduleNameMapper': {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Resolve to source so package tests/IDE runners don't depend on (or stale) dist/
    '^@clappr/zepto$': '<rootDir>/../clappr-zepto/src/zepto.js',
    '\\.(scss)$': '<rootDir>/src/__mocks__/styleMock.js'
  },
  'collectCoverageFrom': [
    'src/*.js',
    'src/**/*.js',
    'src/**/**/*.js'
  ]
}
