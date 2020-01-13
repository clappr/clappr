
const { baseConfig } = require('./rollup.config.base')

const rollupPreprocessor = {
  ...baseConfig,
  external: [],
  output: {
    format: 'iife', // Helps prevent naming collisions.
    name: 'ClapprPlugins', // Required for 'iife' format.
    sourcemap: 'inline', // Sensible for testing.
  },
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-sinon'],

    // list of files / patterns to load in the browser
    files: [
      { pattern: 'node_modules/@clappr/core/dist/clappr-core.js', served: true, included: true },
      { pattern: 'src/**/*.test.js', watched: true },
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.test.js': ['rollup'],
    },

    rollupPreprocessor,

    coverageReporter: {
      reporters: [
        { type: 'lcovonly' },
        { type: 'text-summary' }
      ],
      dir: 'coverage',
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },

    plugins: [
      require('karma-rollup-preprocessor'),
      require('karma-mocha'),
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-chai-sinon',
      'karma-coverage'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'Firefox', 'Safari'],
    browsers: [!process.env.TRAVIS ? 'Chrome' : 'Chrome_travis_ci', 'Firefox'],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // to avoid DISCONNECTED messages
    browserDisconnectTimeout : 10000, // default 2000
    browserDisconnectTolerance : 1, // default 0
    browserNoActivityTimeout : 600000, //default 10000


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
