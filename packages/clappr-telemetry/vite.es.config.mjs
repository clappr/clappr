import { createRequire } from 'node:module'
import { defineClapprLib } from '../../vite.config.base.mjs'

const require = createRequire(import.meta.url)
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

export default defineClapprLib({
  name: 'ClapprTelemetry',
  entry: 'src/main.js',
  fileName: {
    es: 'clappr-telemetry.esm.js'
  },
  formats: ['es'],
  external: ['@clappr/core'],
  replace: {
    CLAPPR_CORE_VERSION: clapprCoreVersion
  },
  emptyOutDir: false
})
