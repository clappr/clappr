import { createRequire } from 'node:module'
import { defineClapprLib } from '../../vite.config.base.mjs'

const require = createRequire(import.meta.url)
const { version } = require('./package.json')
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

export default defineClapprLib({
  name: 'ClapprPlugins',
  entry: 'src/main.js',
  fileName: {
    umd: 'clappr-plugins.js',
    es: 'clappr-plugins.esm.js',
    min: 'clappr-plugins.min.js'
  },
  external: ['@clappr/core'],
  globals: { '@clappr/core': 'Clappr' },
  replace: {
    VERSION: version,
    CLAPPR_CORE_VERSION: clapprCoreVersion
  },
  cssLoadPaths: ['../clappr-core/src/base/scss']
})
