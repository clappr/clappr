/* eslint-disable no-console */
const path = require('path')
const webpack = require('webpack')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// const webpackConfig = require('./webpack-base-config')
const voidModulePath = path.resolve('./src/base/void')

const minimize = !!process.env.MINIMIZE
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const forceInlineDebug = !!process.env.CLAPPR_INLINE_DEBUG

const webpackConfig = (config) => {
  return {
    devServer: {
      contentBase: [
        path.resolve(__dirname, 'public'),
      ],
      disableHostCheck: true, // https://github.com/webpack/webpack-dev-server/issues/882
      compress: true,
      host: '0.0.0.0',
      port: 8080
    },
    mode: config.mode,
    devtool: config.devtool || 'source-maps',
    optimization: config.optimization,
    entry: path.resolve(__dirname, 'src/main.js'),
    externals: config.externals,
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [path.resolve(__dirname, './node_modules')]
        },
        {
          test: /fonts\.css$/,
          loaders: ['css-loader', 'postcss-loader'],
          include: path.resolve(__dirname, 'src/components/core/public')
        },
        {
          test: /\.scss$/,
          loaders: ['style-loader?singleton=true', 'css-loader', 'postcss-loader', 'sass-loader?includePaths[]='
            + path.resolve(__dirname, './src/base/scss')
          ],
          include: path.resolve(__dirname, 'src')
        },
        {
          test: /\.(png|woff|eot|swf|cur|ttf)/,
          loader: 'url-loader',
          options: {
            limit: 1,
            publicPath: '<%=baseUrl%>/'
          },
        },
        {
          test: /\.svg/, loader: 'svg-inline-loader'
        },
        {
          test: /\.html/, loader: 'html-loader?minimize=false'
        }
      ],
    },
    resolve: {
      alias: {
        'clappr-zepto': 'clappr-zepto/zepto.js'
      },
      modules: ['node_modules']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist/',
      filename: config.filename,
      library: 'Clappr',
      libraryTarget: 'umd'
    },
    plugins: config.plugins,
  }
}

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
