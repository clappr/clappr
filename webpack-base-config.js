/* eslint-disable no-var */
var path = require('path')
var webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version)
    }),
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
        loaders: ['css', 'sass?includePaths[]='
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
        test: /\.svg/, loader: 'svg-inline'
      },
      {
        test: /\.html/, loader: 'html?minimize=false'
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname, 'src'),
    extensions: ['', '.js']
  }
}
