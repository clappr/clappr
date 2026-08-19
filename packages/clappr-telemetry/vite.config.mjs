import { createRequire } from 'node:module'
import { defineClapprLib } from '../../vite.config.base.mjs'

const require = createRequire(import.meta.url)
const { version } = require('./package.json')
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

export default defineClapprLib({
  name: 'ClapprTelemetry',
  entry: {
    umd: 'src/main.umd.js',
    es: 'src/main.js'
  },
  fileName: {
    umd: 'clappr-telemetry.js',
    es: 'clappr-telemetry.esm.js',
    min: 'clappr-telemetry.min.js'
  },
  external: ['@clappr/core'],
  globals: { '@clappr/core': 'Clappr' },
  replace: {
    VERSION: version,
    CLAPPR_CORE_VERSION: clapprCoreVersion
  },
  server: { contentBase: ['public', 'dist', '../../'] }
})
