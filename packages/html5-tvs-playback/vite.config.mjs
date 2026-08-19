import { defineClapprLib } from '../../vite.config.base.mjs'

export default defineClapprLib({
  name: 'HTML5TVsPlayback',
  entry: 'src/html5_playback.js',
  fileName: {
    umd: 'clappr-html5-tvs-playback.js',
    es: 'clappr-html5-tvs-playback.esm.js',
    min: 'clappr-html5-tvs-playback.min.js'
  },
  external: ['@clappr/core'],
  globals: { '@clappr/core': 'Clappr' }
})
