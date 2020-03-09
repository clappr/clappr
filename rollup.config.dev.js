const livereload = require('rollup-plugin-livereload')
const serve = require('rollup-plugin-serve')

const { baseConfig, plugins } = require('./rollup.config.base')

const serveConfig = {
  contentBase: ['dist', 'public'],
  host: '0.0.0.0',
  port: 8080,
}

const updatedPlugins = [
  ...plugins,
  serve(serveConfig),
  livereload({
    watch: ['dist', 'public']
  }),
]

baseConfig.forEach(item => item.plugins = updatedPlugins)

module.exports = baseConfig
