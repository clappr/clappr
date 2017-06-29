var path = require('path');
var webpack = require('webpack');

var ENTRY_POINT = 'src/clappr-dash-shaka-playback.js'

module.exports = [
  {
    devtool: 'source-maps',
    entry: path.resolve(__dirname, ENTRY_POINT),
    externals: {
      "clappr": 'Clappr',
      "shaka-player": 'shaka'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel'
        }
      ],
    },
    resolve: {
      extensions: ['', '.js'],
    },
    output: {
      filename: 'dash-shaka-playback.js',
      library: 'DashShakaPlayback',
      libraryTarget: 'umd',
    },
  },

  {
    devtool: 'source-maps',
    entry: path.resolve(__dirname, ENTRY_POINT),
    externals: {
      "clappr": 'Clappr',
      "shaka-player": 'shaka'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel'
        }
      ],
    },
    resolve: {
      extensions: ['', '.js'],
    },
    output: {
      filename: 'dash-shaka-playback.min.js',
      library: 'DashShakaPlayback',
      libraryTarget: 'umd',
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
    ]
  }
];
