/* eslint-disable no-console */
const webpack = require('webpack')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = require('./webpack.config.base')

const packageName = 'hls-playback'

const minimize = !!process.env.MINIMIZE
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const forceInlineDebug = !!process.env.CLAPPR_INLINE_DEBUG

const externals = () => {
  // By default, only Clappr is defined as external library
  return {
    clappr: {
      amd: '@clappr/core',
      commonjs: '@clappr/core',
      commonjs2: '@clappr/core',
      root: 'Clappr'
    }
  }
}

const customExt = externals()
customExt['hls.js'] = {
  amd: 'hls.js',
  commonjs: 'hls.js',
  commonjs2: 'hls.js',
  root: 'Hls'
}

let configurations = []

configurations.push(webpackConfig({
  filename: `${packageName}.js`,
  plugins: analyzeBundle ? [new BundleAnalyzerPlugin()] : [],
  mode: 'development',
  externals: externals(),
}))

configurations.push(webpackConfig({
  filename: `${packageName}.external.js`,
  plugins: analyzeBundle ? [new BundleAnalyzerPlugin()] : [],
  mode: 'development',
  externals: customExt,
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
    mode: 'production',
    externals: externals(),
  }))

  configurations.push(webpackConfig({
    filename: `${packageName}.external.min.js`,
    plugins: [
      loaderOptions,
    ],
    optimization: {
      minimizer: [
        uglify,
      ],
    },
    mode: 'production',
    externals: customExt,
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
    mode: 'development',
    externals: externals(),
  }))

  configurations.push(webpackConfig({
    filename: `${packageName}.external.debug.min.js`,
    devtool: 'inline-source-map',
    plugins: [
      loaderOptions,
    ],
    mode: 'development',
    externals: customExt,
  }))
}

module.exports = configurations
