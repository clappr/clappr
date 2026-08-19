import { defineClapprLib } from '../../vite.config.base.mjs'

export default defineClapprLib({
  name: 'Zepto',
  entry: 'src/zepto.js',
  fileName: {
    umd: 'clappr-zepto.js',
    es: 'clappr-zepto.esm.js'
  },
  moduleSideEffects: true,
  exports: 'default'
})
