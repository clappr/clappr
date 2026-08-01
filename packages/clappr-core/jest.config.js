const pkg = require('./package.json')

module.exports = {
  'testEnvironment': 'jsdom',
  'globals': {
    'VERSION': pkg.version
  },
  'verbose': true,
  'resolver': 'jest-directory-named-resolver',
  'transform': {
    // Inline babel config with babelrc/configFile disabled. Needed so the
    // sibling @clappr/zepto source (ESM export default) is compiled to CJS
    // when resolved via moduleNameMapper outside rootDir.
    // Intentionally not reached by babel.base.json — keep this preset in sync
    // with babel.base.json env.test by hand.
    '^.+\\.js$': ['babel-jest', {
      babelrc: false,
      configFile: false,
      presets: [['@babel/preset-env', { modules: 'commonjs' }]]
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
