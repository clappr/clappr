import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

import baseConfig from './rollup.config'

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

export default {
  ...baseConfig,
  plugins,
}
