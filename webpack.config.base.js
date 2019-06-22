const path = require('path')
const webpack = require('webpack')

const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

const externals = {
  clappr: {
    amd: 'clappr',
    commonjs: 'clappr',
    commonjs2: 'clappr',
    root: 'Clappr'
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
      port: 8080
    },
    mode: config.mode,
    devtool: config.devtool || 'source-maps',
    optimization: config.optimization,
    entry: path.resolve(__dirname, 'src/main.js'),
    externals: {
      ...externals,
      ...config.externals,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [path.resolve(__dirname, './node_modules')]
        },
        {
          test: /(fonts)?\.s?css$/,
          loaders: ['style-loader?singleton=true', 'css-loader', 'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  path.resolve(__dirname, 'src/public'),
                  path.resolve(__dirname, 'src/public/scss')
                ]
              }
            }
            //'sass-loader?includePaths[]='
            // + path.resolve(__dirname, 'src/public')
            // + '!'
            // + path.resolve(__dirname, 'src/public/scss')
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
        },
        ...(config.rules || [])
      ],
    },
    resolve: {
      alias: {
        'clappr': '@clappr/core'
      },
      plugins: [
        new DirectoryNamedWebpackPlugin(true),
      ],
      modules: ['node_modules']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist/',
      filename: config.filename,
      library: 'ClapprPlugins',
      libraryTarget: 'umd'
    },
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(require('./package.json').version),
      }),
      ...(config.plugins || [])
    ],
  }
}

module.exports = webpackConfig
