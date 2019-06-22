/* eslint-disable no-console */
const webpack = require('webpack')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = require('./webpack.config.base')

const packageName = 'clappr-plugins'

const minimize = !!process.env.MINIMIZE
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const forceInlineDebug = !!process.env.CLAPPR_INLINE_DEBUG

let configurations = []

configurations.push(webpackConfig({
  filename: `${packageName}.js`,
  plugins: analyzeBundle ? [ new BundleAnalyzerPlugin() ] : [],
  mode: 'development'
}))

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
    filename: `${packageName}.min.js`,
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
}

if (forceInlineDebug) {
  console.log('NOTE: Enabling inline source-maps - this may not be suitable for production usage')
  configurations.push(webpackConfig({
    filename: `${packageName}.debug.min.js`,
    devtool: 'inline-source-map',
    plugins: [
      loaderOptions,
    ],
    mode: 'development'
  }))
}

module.exports = configurations
