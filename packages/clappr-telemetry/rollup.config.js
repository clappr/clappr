const babel = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const terser = require('@rollup/plugin-terser')
const { visualizer } = require('rollup-plugin-visualizer')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')

const { version } = require('./package.json')
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

const isDev = !!process.env.DEV
const minimize = !!process.env.MINIMIZE
const analyzeBundle = !!process.env.ANALYZE_BUNDLE

const umdGlobals = { '@clappr/core': 'Clappr' }
const visualizePluginOptions = {
  open: false,
  filename: 'dist/bundle-stats.html',
  gzipSize: true
}

const umdOutput = [
  {
    file: 'dist/clappr-telemetry.js',
    format: 'umd',
    name: 'ClapprTelemetry',
    globals: umdGlobals,
    sourcemap: true,
    plugins: analyzeBundle ? [visualizer(visualizePluginOptions)] : []
  },
  ...(minimize
    ? [
      {
        file: 'dist/clappr-telemetry.min.js',
        format: 'umd',
        name: 'ClapprTelemetry',
        globals: umdGlobals,
        sourcemap: true,
        plugins: [terser()]
      }
    ]
    : [])
]

const esmOutput = {
  file: 'dist/clappr-telemetry.esm.js',
  format: 'esm',
  sourcemap: true
}

const plugins = [
  replace({
    VERSION: JSON.stringify(version),
    CLAPPR_CORE_VERSION: JSON.stringify(clapprCoreVersion),
    preventAssignment: false
  }),
  commonjs(),
  nodeResolve(),
  babel({
    exclude: ['node_modules/**', '../../node_modules/**'],
    babelHelpers: 'bundled'
  }),
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

module.exports = [
  {
    input: 'src/main.umd.js',
    external: ['@clappr/core'],
    output: umdOutput,
    plugins
  },
  {
    input: 'src/main.js',
    external: ['@clappr/core'],
    output: esmOutput,
    plugins
  }
]
