import { createRequire } from 'node:module'
import { defineClapprLib } from '../../vite.config.base.mjs'

const require = createRequire(import.meta.url)
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

export default defineClapprLib({
  name: 'LevelSelector',
  entry: 'src/level-selector.js',
  fileName: {
    umd: 'level-selector.js',
    es: 'level-selector.esm.js',
    min: 'level-selector.min.js'
  },
  external: ['@clappr/core'],
  globals: { '@clappr/core': 'Clappr' },
  replace: { CLAPPR_CORE_VERSION: clapprCoreVersion }
})
