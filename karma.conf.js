// Karma configuration
// Generated on Wed Jul 02 2014 11:05:24 GMT-0300 (BRT)


var dotenv = require('dotenv');
var exec = require('child_process').exec;
exec('node bin/hook.js');
dotenv.load();

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'traceur', 'mocha', 'sinon-chai', 'jquery-2.1.0'],


    // list of files / patterns to load in the browser
    files: [
      'test/**/*spec.js',
      'src/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['traceur', 'browserify'],
      'test/**/*.js': ['traceur', 'browserify']
    },

    traceurPreprocessor: {
      options: {
        sourceMap: true
      }
    },

    browserify: {
      watch: true,
      debug: true,
      transform: ['es6ify'],
      prebundle: function(bundle) {
        bundle.require('./src/base/ui_object', { expose: 'ui_object' })
        bundle.require('./src/base/base_object', { expose: 'base_object' })
        bundle.require('./src/base/ui_container_plugin', { expose: 'ui_container_plugin' })
        bundle.require('./src/base/container_plugin', { expose: 'container_plugin' })
        bundle.require('./src/base/core_plugin', { expose: 'core_plugin' })
        bundle.require('./src/base/ui_core_plugin', { expose: 'ui_core_plugin' })
        bundle.require('./src/base/playback', { expose: 'playback' })
        bundle.require('./src/components/container', { expose: 'container' })
        bundle.require('./src/components/browser', { expose: 'browser' })
        bundle.require('./src/components/media_control', { expose: 'media_control' })
        bundle.require('./src/components/player_info', { expose: 'player_info' })
        bundle.require('./src/components/mediator', { expose: 'mediator' })
        bundle.require('./src/components/container', { expose: 'container' })
        bundle.require('./src/components/core', { expose: 'core' })
        bundle.require('./src/playbacks/hls', { expose: 'hls' })
        bundle.require('./src/playbacks/flash', { expose: 'flash' })
        bundle.require('./src/playbacks/html5_audio', { expose: 'html5_audio' })
        bundle.require('./src/playbacks/html5_video', { expose: 'html5_video' })
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
