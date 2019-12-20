const livereload = require('rollup-plugin-livereload')
const serve = require('rollup-plugin-serve')

const { baseConfig } = require('./rollup.config.base')

const serveConfig = {
  contentBase: ['dist', 'public'],
  host: '0.0.0.0',
  port: 8080,
}

const plugins = [
  ...baseConfig.plugins,
  serve(serveConfig),
  livereload(),
]

module.exports = {
  ...baseConfig,
  plugins,
}
