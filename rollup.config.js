
import { terser } from 'rollup-plugin-terser'

import baseConfig from './rollup.config.base'

const output = [
  ...baseConfig.output,
  {
    file: 'dist/clappr-core.min.js',
    format: 'umd',
    name: 'Clappr',
  },
  {
    file: 'dist/clappr-core.esm.js',
    format: 'esm',
  },
]

const plugins = [
  ...baseConfig.plugins,
  terser({
    include: [/^.+\.min\.js$/],
  })
]

export default {
  ...baseConfig,
  output,
  plugins,
}
