import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import html from 'rollup-plugin-html'
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import filesize from 'rollup-plugin-filesize'
import size from 'rollup-plugin-sizes'
import visualize from 'rollup-plugin-visualizer'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import { version as clapprCoreVersion } from '@clappr/core/package.json'

const dev = !!process.env.DEV
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const minimize = !!process.env.MINIMIZE

const servePluginOptions = { contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }
const livereloadPluginOptions = { watch: ['dist', 'public'] }
const visualizePluginOptions = { open: true }

const plugins = [
  replace({
    preventAssignment: true,
    values: {
      VERSION: JSON.stringify(pkg.version),
      CLAPPR_CORE_VERSION: JSON.stringify(clapprCoreVersion),
    }
  }),
  resolve(),
  commonjs(),
  babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
  html(),
  postcss(),
  size(),
  filesize(),
  dev && serve(servePluginOptions),
  dev && livereload(livereloadPluginOptions),
  analyzeBundle && visualize(visualizePluginOptions),
]

export default [
  {
    input: 'src/base_bundle.js',
    output: [
      {
        name: 'Clappr',
        file: 'dist/clappr.plainhtml5.js',
        format: 'umd',
        sourcemap: true,
      },
      minimize && {
        name: 'Clappr',
        file: 'dist/clappr.plainhtml5.min.js',
        format: 'iife',
        sourcemap: true,
        plugins: terser(),
      }
    ],
    plugins,
  },
  {
    input: 'src/main.js',
    output: [
      {
        name: 'Clappr',
        file: pkg.main,
        format: 'umd',
        sourcemap: true,
      },
      minimize && {
        file: 'dist/clappr.min.js',
        format: 'iife',
        name: 'Clappr',
        sourcemap: true,
        plugins: terser(),
      }
    ],
    plugins,
  }
]

