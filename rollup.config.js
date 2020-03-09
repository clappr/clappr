
const analyze = require('rollup-plugin-analyzer')
const { terser } = require('rollup-plugin-terser')

const { baseConfig, plugins } = require('./rollup.config.base')

const minimize = !!process.env.MINIMIZE
const analyzeBundle = !!process.env.ANALYZE_BUNDLE

minimize && baseConfig.push(
  {
    input: 'src/base_bundle.js',
    output: [
      {
        file: 'dist/clappr.plainhtml5.min.js',
        format: 'umd',
        name: 'Clappr',
        sourcemap: true,
      },
    ],
    plugins: [
      ...plugins,
      terser({
        include: [/^.+\.min\.js$/],
      }),
    ],
  },
  {
    input: 'src/main.js',
    output: [
      {
        file: 'dist/clappr.min.js',
        format: 'umd',
        name: 'Clappr',
        sourcemap: true,
      },
    ],
    plugins: [
      ...plugins,
      terser({
        include: [/^.+\.min\.js$/],
      }),
    ],
  }
)

analyzeBundle && baseConfig.forEach(item => item.plugins.push(analyze()))

module.exports = baseConfig
