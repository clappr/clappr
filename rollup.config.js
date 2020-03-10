
const analyze = require('rollup-plugin-analyzer')
const { terser } = require('rollup-plugin-terser')

const { baseConfig } = require('./rollup.config.base')

const minimize = !!process.env.MINIMIZE
const analyzeBundle = !!process.env.ANALYZE_BUNDLE

const output = [
  ...baseConfig.output,
  ...(minimize
    ? [
      {
        file: 'dist/clappr-core.min.js',
        format: 'umd',
        exports: 'named',
        name: 'Clappr',
        sourcemap: true,
        plugins: [
          terser({
            include: [/^.+\.min\.js$/],
          }),
        ],
      },
    ]
    : []),
  {
    file: 'dist/clappr-core.esm.js',
    format: 'esm',
    exports: 'named',
  },
]

const plugins = [
  ...baseConfig.plugins,
  ...(analyzeBundle ? [analyze()] : []),
]

module.exports = {
  ...baseConfig,
  output,
  plugins,
}
