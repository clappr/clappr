var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  externals: {
    clappr: 'Clappr',
    shaka: 'shaka'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
            compact: true,
        }
      }
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  output: {
    filename: 'clappr-dash-shaka.js',
    library: 'ClapprDashShaka',
    libraryTarget: 'umd',
  },
};
