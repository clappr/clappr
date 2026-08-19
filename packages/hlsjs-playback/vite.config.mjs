import { createRequire } from 'node:module'
import { defineClapprLib } from '../../vite.config.base.mjs'

const require = createRequire(import.meta.url)
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

export default defineClapprLib({
  name: 'HlsjsPlayback',
  entry: 'src/hls.js',
  fileName: {
    umd: 'hlsjs-playback.js',
    es: 'hlsjs-playback.esm.js',
    min: 'hlsjs-playback.min.js'
  },
  external: ['@clappr/core', 'hls.js'],
  globals: { '@clappr/core': 'Clappr', 'hls.js': 'Hls' },
  replace: { CLAPPR_CORE_VERSION: clapprCoreVersion }
})
