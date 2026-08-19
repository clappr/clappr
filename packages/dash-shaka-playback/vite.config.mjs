import { defineClapprLib } from '../../vite.config.base.mjs'

export default defineClapprLib({
  name: 'DashShakaPlayback',
  entry: 'src/clappr-dash-shaka-playback.js',
  fileName: {
    umd: 'dash-shaka-playback.js',
    es: 'dash-shaka-playback.esm.mjs',
    min: 'dash-shaka-playback.min.js'
  },
  external: ['@clappr/core', 'shaka-player'],
  globals: { '@clappr/core': 'Clappr', 'shaka-player': 'shaka' }
})
