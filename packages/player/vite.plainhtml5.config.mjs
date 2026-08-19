import { clapprSiblingSourceAlias, defineClapprLib } from '../../vite.config.base.mjs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { version } = require('./package.json')
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

export default defineClapprLib({
  name: 'Clappr',
  entry: 'src/base_bundle.js',
  fileName: {
    umd: 'clappr.plainhtml5.js',
    min: 'clappr.plainhtml5.min.js'
  },
  formats: ['umd'],
  alias: clapprSiblingSourceAlias(),
  replace: {
    VERSION: clapprCoreVersion,
    CLAPPR_VERSION: version,
    CLAPPR_CORE_VERSION: clapprCoreVersion
  },
  cssLoadPaths: ['../clappr-core/src/base/scss'],
  sourcemap: false,
  emptyOutDir: false
})
