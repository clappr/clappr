const babel = require('rollup-plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const { terser } = require('rollup-plugin-terser')
const analyze = require('rollup-plugin-analyzer')
const filesize = require('rollup-plugin-filesize')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')

const { version } = require('./package.json')
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

const isDev = !!process.env.DEV
const minimize = !!process.env.MINIMIZE
const analyzeBundle = !!process.env.ANALYZE_BUNDLE

const output = [
  {
    file: 'dist/clappr-telemetry.js',
    format: 'umd',
    name: 'ClapprTelemetry',
    globals: {
      '@clappr/core': 'Clappr'
    }
  },
  {
    file: 'dist/clappr-telemetry.esm.js',
    format: 'esm'
  },
  ...(minimize
    ? [
        {
          file: 'dist/clappr-telemetry.min.js',
          format: 'umd',
          name: 'ClapprTelemetry',
          globals: {
            '@clappr/core': 'Clappr'
          },
          plugins: [terser()]
        }
      ]
    : [])
]

const plugins = [
  replace({
    VERSION: JSON.stringify(version),
    CLAPPR_CORE_VERSION: JSON.stringify(clapprCoreVersion),
    preventAssignment: false
  }),
  commonjs(),
  nodeResolve(),
  babel({
    exclude: ['node_modules/**', '../../node_modules/**']
  }),
  ...(analyzeBundle ? [analyze()] : []),
  filesize(),
  ...(isDev ? [
    serve({
      open: false,
      port: 8080,
      contentBase: ['public', 'dist', '../../']
    }),
    livereload({
      watch: ['dist']
    })
  ] : [])
]

module.exports = {
  input: 'src/main.js',
  external: ['@clappr/core'],
  output,
  plugins
}
