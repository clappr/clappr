import { resolve } from 'node:path'
import { defineClapprLib } from '../../vite.config.base.mjs'

export default defineClapprLib({
  name: 'Clappr',
  entry: 'src/main.js',
  fileName: {
    umd: 'clappr-core.js',
    es: 'clappr-core.esm.js',
    min: 'clappr-core.min.js'
  },
  alias: {
    '@': resolve(process.cwd(), 'src'),
    '@clappr/zepto': resolve(process.cwd(), '../clappr-zepto/src/zepto.js')
  },
  cssLoadPaths: ['src/base/scss'],
  exports: 'named'
})
