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


const voidModulePath = path.resolve('./src/base/void');

if (process.env.CLAPPR_PLAIN_HTML5_ONLY === 'yes') {
    console.log('NOTE: Building only with plain HTML5 playback plugins, but will result in smaller build size');
    webpackConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/playbacks\/flash/, voidModulePath),
        new webpack.NormalModuleReplacementPlugin(/playbacks\/base_flash_playback/, voidModulePath),
        new webpack.NormalModuleReplacementPlugin(/playbacks\/flashls/, voidModulePath),
        new webpack.NormalModuleReplacementPlugin(/playbacks\/hls/, voidModulePath)
    );
}
webpackConfig.output = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'clappr.js',
  library: 'Clappr',
  libraryTarget: 'umd'
}

module.exports = webpackConfig
