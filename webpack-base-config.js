/* eslint-disable no-var */
var path = require('path')
var webpack = require('webpack')

var DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

module.exports = {
  node: { Buffer: false, global: false, process: true, setImmediate: false },
  plugins: [
    new DirectoryNamedWebpackPlugin(true),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version)
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, './node_modules')]
        // config in .babelrc
      },
      {
        test: /\.scss$/,
        loaders: ['css-loader', 'sass-loader?includePaths[]='
            + require('node-bourbon').includePaths
            + '&includePaths[]='
            + path.resolve(__dirname, './src/base/scss')
        ],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.(png|woff|eot|ttf|swf|cur)/, loader: 'url-loader?limit=1'
      },
      {
        test: /\.svg/, loader: 'svg-inline-loader'
      },
      {
        test: /\.html/, loader: 'html-loader?minimize=false'
      }
    ]
  },
  resolve: {
    alias: {
      'clappr-zepto': 'clappr-zepto/zepto.js'
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
}
