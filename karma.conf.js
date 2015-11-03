// Karma configuration
// Generated on Wed Jul 02 2014 11:05:24 GMT-0300 (BRT)


var dotenv = require('dotenv');
var path = require('path');
var webpack = require('webpack');

dotenv.load();

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-sinon', 'jquery-2.1.0'],

    // list of files / patterns to load in the browser
    files: [
      'test/**/*.js',
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.js': ['webpack'],
    },


    coverageReporter: {
      reporters: [
        {type: 'lcovonly'},
        {type: 'text-summary'}
      ]
    },
    plugins: [
        require('karma-webpack'),
        require('karma-mocha'),
        'karma-chrome-launcher',
        'karma-chai-sinon',
        'karma-jquery',
        'karma-coverage',
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    webpack: {
        plugins: [
          new webpack.DefinePlugin({
            VERSION: JSON.stringify(require('./package.json').version)
          })
        ],
        module: {
            loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
            },
            {
                test: /\.scss$/,
                loaders: ['css', 'sass?includePaths[]='
                    + path.resolve(__dirname, './node_modules/compass-mixins/lib')
                    + '&includePaths[]='
                    + path.resolve(__dirname, './src/base/scss')
                ],
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.(png|woff|eot|ttf|swf|cur)/, loader: 'url-loader?limit=1'
            },
            {
                test: /\.svg/, loader: 'file-loader'
            },
            {
                test: /\.html/, loader: 'html?minimize=false'
            }
            ],
            postLoaders: [ { // << add subject as webpack's postloader
                test: /\.js$/,
                exclude: /(test|node_modules|bower_components)\//,
                loader: 'istanbul-instrumenter'
            } ]
        },
        resolve: {
            root: path.resolve(__dirname, 'src'),
            extensions: ['', '.js'],
        },

    },


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
    // to avoid DISCONNECTED messages
    browserDisconnectTimeout : 10000, // default 2000
    browserDisconnectTolerance : 1, // default 0
    browserNoActivityTimeout : 600000, //default 10000


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
