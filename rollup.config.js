import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import jsonReader from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import html from 'rollup-plugin-html'
import namedDirectory from 'rollup-plugin-named-directory'
import postcss from 'rollup-plugin-postcss'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import filesize from 'rollup-plugin-filesize'
import size from 'rollup-plugin-sizes'
import visualize from 'rollup-plugin-visualizer'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const dev = !!process.env.DEV
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const minimize = !!process.env.MINIMIZE

const postcssOptions = {
  use: [
    ['sass', {
      includePaths: ['src/base/scss']
    }]
  ]
}
const aliasPluginOptions = { entries: { 'clappr-zepto': 'node_modules/clappr-zepto/zepto.js', '@': __dirname + '/src' } }
const replacePluginOptions = { VERSION: JSON.stringify(pkg.version) }
const babelPluginOptions = { babelHelpers: 'bundled', exclude: 'node_modules/**' }
const servePluginOptions = { contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }
const livereloadPluginOptions = { watch: ['dist', 'public'] }
const visualizePluginOptions = { open: true, filename: './public/stats.html' }

const plugins = [
  jsonReader(),
  alias(aliasPluginOptions),
  replace(replacePluginOptions),
  resolve(),
  commonjs(),
  babel(babelPluginOptions),
  namedDirectory(),
  html(),
  postcss(postcssOptions),
  size(),
  filesize(),
  dev && serve(servePluginOptions),
  dev && livereload(livereloadPluginOptions),
  analyzeBundle && visualize(visualizePluginOptions)
]

const mainBundle = {
  input: 'src/main.js',
  output: [
    {
      exports: 'named',
      name: 'Clappr',
      file: pkg.main,
      format: 'umd',
      sourcemap: true,
    },
    minimize && {
      exports: 'named',
      name: 'Clappr',
      file: 'dist/clappr-core.min.js',
      format: 'iife',
      sourcemap: true,
      plugins: terser(),
    }
  ],
  plugins,
}

const esmBundle = {
  input: 'src/main.js',
  output: {
    exports: 'named',
    name: 'Clappr',
    file: pkg.module,
    format: 'esm',
  },
  plugins,
}

export default [mainBundle, esmBundle]
