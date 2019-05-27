/* eslint-disable no-console */
const path = require('path')
const webpack = require('webpack')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = require('./webpack.config.base')
const voidModulePath = path.resolve('./src/base/void')

const minimize = !!process.env.MINIMIZE
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const forceInlineDebug = !!process.env.CLAPPR_INLINE_DEBUG


const plainHtml5Plugins = [
  new webpack.NormalModuleReplacementPlugin(/playbacks\/flash/, voidModulePath),
  new webpack.NormalModuleReplacementPlugin(/playbacks\/base_flash_playback/, voidModulePath),
  new webpack.NormalModuleReplacementPlugin(/playbacks\/flashls/, voidModulePath),
  new webpack.NormalModuleReplacementPlugin(/playbacks\/hls/, voidModulePath),
]

let configurations = []

configurations.push(webpackConfig({
  filename: 'clappr.js',
  plugins: analyzeBundle ? [ new BundleAnalyzerPlugin() ] : [],
  mode: 'development'
}))

if (!analyzeBundle) {
  configurations.push(webpackConfig({
    filename: 'clappr.plainhtml5.js',
    plugins: plainHtml5Plugins,
    mode: 'production'
  }))
}

const loaderOptions = new webpack.LoaderOptionsPlugin({ minimize, debug: !minimize })
const uglify = new UglifyJsPlugin({
  uglifyOptions: {
    warnings: false,
    compress: {},
    mangle: true,
    sourceMap: true,
    comments: false,
    output: { comments: false }
  },
})

if (minimize) {
  console.log('NOTE: Enabled minifying bundle (uglify)')

  configurations.push(webpackConfig({
    filename: 'clappr.min.js',
    plugins: [
      loaderOptions,
    ],
    optimization: {
      minimizer: [
        uglify,
      ],
    },
    mode: 'production'
  }))


  console.log('NOTE: Building flavor plainhtml5 with only plain HTML5 playback plugins, but will result in smaller build size')
  configurations.push(webpackConfig({
    filename: 'clappr.plainhtml5.min.js',
    plugins: [
      loaderOptions,
      ...plainHtml5Plugins,
    ],
    optimization: {
      minimizer: [
        uglify,
      ],
    },
    mode: 'production'
  }))
}

if (forceInlineDebug) {
  console.log('NOTE: Enabling inline source-maps - this may not be suitable for production usage')
  configurations.push(webpackConfig({
    filename: 'clappr.debug.min.js',
    devtool: 'inline-source-map',
    plugins: [
      loaderOptions,
    ],
    mode: 'development'
  }))
}

module.exports = configurations
