/* eslint-disable no-var */
var path = require('path')
var webpack = require('webpack')
var Clean = require('clean-webpack-plugin')

var webpackConfig = require('./webpack-base-config')
webpackConfig.entry = path.resolve(__dirname, 'src/main.js')

if (process.env.npm_lifecycle_event === 'release') {
  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }))
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    mangle: true,
    sourceMap: true,
    comments: false,
    output: {comments: false}
  })
  )
} else if (process.env.npm_lifecycle_event !== 'start') {
  webpackConfig.plugins.push(new Clean(['dist'], {verbose: false}))
}

webpackConfig.output = {
  path: path.resolve(__dirname, 'dist'),
  publicPath: '<%=baseUrl%>/',
  filename: 'clappr.js',
  library: 'Clappr',
  libraryTarget: 'umd'
}

module.exports = webpackConfig
