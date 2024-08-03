
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
        file: 'dist/clappr-plugins.min.js',
        format: 'umd',
        name: 'ClapprPlugins',
        globals: { '@clappr/core': 'Clappr' },
        plugins: terser(),
      },
    ]
    : []),
  {
    file: 'dist/clappr-plugins.esm.js',
    format: 'esm',
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
