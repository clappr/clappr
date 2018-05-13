const clone = require('clone')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpackConfigDev = require('./webpack.config.js')

const config = clone(webpackConfigDev)
config.plugins = config.plugins.concat([
  new BundleAnalyzerPlugin()
])

module.exports = config
