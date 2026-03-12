const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var NPM_RUN = process.env.npm_lifecycle_event

const externals = () => {
  // Telemetry plugin only needs clappr as external
  return {
    clappr: {
      amd: 'clappr',
      commonjs: 'clappr',
      commonjs2: 'clappr',
      root: 'Clappr'
    }
  }
}

const webpackConfig = (config) => {
  return {
    mode: config.mode,
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'shaka_network_adapter_plugin.js'),
    externals: config.externals,
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            path.resolve(__dirname, '../../src')
          ]
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, '../../dist'),
      filename: config.filename,
      library: 'ShakaNetworkAdapterPlugin',
      libraryTarget: 'umd',
    },
    plugins: config.plugins,
  }
}

var configurations = []

if (NPM_RUN === 'build') {
  // Unminified telemetry plugin
  configurations.push(webpackConfig({
    filename: 'dash-shaka-telemetry-plugin.js',
    plugins: [],
    externals: externals(),
    mode: 'development'
  }))
}

if (NPM_RUN === 'release') {
  // Minified telemetry plugin
  configurations.push(webpackConfig({
    filename: 'dash-shaka-telemetry-plugin.min.js',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true
        }),
      ]
    },
    externals: externals(),
    mode: 'production'
  }))
}

// https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations
module.exports = configurations
