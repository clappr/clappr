import { createRequire } from 'node:module'
import { clapprSiblingSourceAlias, defineClapprLib } from '../../vite.config.base.mjs'

const require = createRequire(import.meta.url)
const { version: clapprCoreVersion } = require('@clappr/core/package.json')
const { version: clapprVersion } = require('../player/package.json')

export default defineClapprLib({
  name: 'ClapprTelemetry',
  entry: 'src/main.umd.js',
  fileName: {
    umd: 'clappr-telemetry.js',
    min: 'clappr-telemetry.min.js'
  },
  formats: ['umd'],
  external: ['@clappr/core'],
  globals: { '@clappr/core': 'Clappr' },
  replace: {
    CLAPPR_CORE_VERSION: clapprCoreVersion
  },
  // Demo imports player source; keep these off the library build so core stays external.
  serveReplace: {
    CLAPPR_VERSION: clapprVersion
  },
  serveAlias: clapprSiblingSourceAlias(),
  cssLoadPaths: ['../clappr-core/src/base/scss'],
  publicDir: '../player/public'
})
