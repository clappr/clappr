var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
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
           test: /\.(png|woff|eot|ttf|swf)/, loader: 'url-loader?limit=1'
       },
       {
           test: /\.svg/, loader: 'file-loader'
       },
       {
           test: /\.html/, loader: 'html?minimize=false'
       }
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/latest/',
    filename: 'clappr.js',
    libraryTarget: 'umd',
  },
};
