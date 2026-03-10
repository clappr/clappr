const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var NPM_RUN = process.env.npm_lifecycle_event

const externals = () => {
  // By default, only Clappr is defined as external library
  return {
    clappr: {
      amd: 'clappr',
      commonjs: 'clappr',
      commonjs2: 'clappr',
      root: 'Clappr'
    },
    '@clappr/core': {
      amd: '@clappr/core',
      commonjs: '@clappr/core',
      commonjs2: '@clappr/core',
      root: 'ClapprCore'
    }
  }
}

const telemetryExternals = () => {
  // Telemetry plugin only needs clappr as external
  // @clappr/core will be bundled since it's needed for the plugin
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
    devServer: {
      contentBase: [
        path.resolve(__dirname, 'public'),
      ],
      disableHostCheck: true, // https://github.com/webpack/webpack-dev-server/issues/882
      compress: true,
      host: '0.0.0.0',
      port: 8181
    },
    mode: config.mode,
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src/clappr-dash-shaka-playback.js'),
    externals: config.externals,
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            path.resolve(__dirname, 'src')
          ]
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist/',
      filename: config.filename,
      library: 'DashShakaPlayback',
      libraryTarget: 'umd',
      globalObject: 'window'
    },
    plugins: config.plugins,
  }
}

const telemetryWebpackConfig = (config) => {
  return {
    mode: config.mode,
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src/telemetry/shaka_network_adapter_plugin.js'),
    externals: config.externals,
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            path.resolve(__dirname, 'src')
          ]
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: config.filename,
      library: 'ShakaNetworkAdapterPlugin',
      libraryTarget: 'umd',
      globalObject: 'window'
    },
    plugins: config.plugins,
  }
}

var configurations = []

if (NPM_RUN === 'build' || NPM_RUN === 'start') {
  // Unminified bundle with shaka-player
  configurations.push(webpackConfig({
    filename: 'dash-shaka-playback.js',
    plugins: [],
    externals: externals(),
    mode: 'development'
  }))

  // Unminified bundle without shaka-player
  var customExt = externals()
  customExt['shaka-player'] = 'shaka'
  configurations.push(webpackConfig({
    filename: 'dash-shaka-playback.external.js',
    plugins: [],
    externals: customExt,
    mode: 'development'
  }))

  // Telemetry plugin unminified
  configurations.push(telemetryWebpackConfig({
    filename: 'dash-shaka-telemetry-plugin.js',
    plugins: [],
    externals: telemetryExternals(),
    mode: 'development'
  }))
}

if (NPM_RUN === 'release') {
  // Minified bundle with shaka-player
  configurations.push(webpackConfig({
    filename: 'dash-shaka-playback.min.js',
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

  // Minified bundle without shaka-player
  var customExt = externals()
  customExt['shaka-player'] = 'shaka'
  configurations.push(webpackConfig({
    filename: 'dash-shaka-playback.external.min.js',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true
        }),
      ]
    },
    externals: customExt,
    mode: 'production'
  }))

  // Telemetry plugin minified
  configurations.push(telemetryWebpackConfig({
    filename: 'dash-shaka-telemetry-plugin.min.js',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true
        }),
      ]
    },
    externals: telemetryExternals(),
    mode: 'production'
  }))
}

// https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations
module.exports = configurations
