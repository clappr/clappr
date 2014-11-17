// Karma configuration
// Generated on Wed Jul 02 2014 11:05:24 GMT-0300 (BRT)


var dotenv = require('dotenv');
var exec = require('child_process').exec;
dotenv.load();

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha', 'sinon-chai', 'jquery-2.1.0'],

    // list of files / patterns to load in the browser
    files: [
      'dist/underscore-min.js',
      'dist/clappr.min.js',
      'test/**/*spec.js',
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.js': ['browserify'],
    },

    browserify: {
      watch: true,
      debug: true,
      transform: ['es6ify'],
      prebundle: function(bundle) {
        bundle.external('ui_object');
        bundle.external('base_object');
        bundle.external('ui_container_plugin');
        bundle.external('container_plugin');
        bundle.external('ui_core_plugin');
        bundle.external('core_plugin');
        bundle.external('media_control');
        bundle.external('playback');
        bundle.external('browser');
        bundle.external('player_info');
        bundle.external('underscore');
        bundle.external('jquery');
        bundle.external('mediator');
        bundle.external('container');
        bundle.external('underscore');
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


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
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
