var path = require('path');
var webpack = require('webpack');

module.exports = [
  {
    entry: path.resolve(__dirname, 'index.js'),
    externals: {
      clappr: 'Clappr'
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
    entry: path.resolve(__dirname, 'index.js'),
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
