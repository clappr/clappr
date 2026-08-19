import { resolve } from 'node:path'
import { createRequire } from 'node:module'
import { defineClapprLib } from '../../vite.config.base.mjs'

const require = createRequire(import.meta.url)
const { version } = require('./package.json')

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
  replace: { VERSION: version },
  cssLoadPaths: ['src/base/scss'],
  exports: 'named'
})
