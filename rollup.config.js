import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import jsonReader from '@rollup/plugin-json'
import nodeBuiltins from 'rollup-plugin-node-builtins'
import nodeGlobals from 'rollup-plugin-node-globals'
import namedDirectory from 'rollup-plugin-named-directory'
import html from 'rollup-plugin-html'
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel'
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
const babelPluginOptions = { exclude: 'node_modules/**' }
const servePluginOptions = { contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }
const livereloadPluginOptions = { watch: ['dist', 'public'] }
const visualizePluginOptions = { open: true }
const terserPluginOptions = { include: [/^.+\.min\.js$/] }

const plugins = [
  jsonReader(),
  alias(aliasPluginOptions),
  replace(replacePluginOptions),
  resolve(),
  commonjs(),
  nodeBuiltins(),
  nodeGlobals(),
  babel(babelPluginOptions),
  namedDirectory(),
  html(),
  postcss(postcssOptions),
  size(),
  filesize()
]

dev && plugins.push(serve(servePluginOptions), livereload(livereloadPluginOptions))
analyzeBundle && plugins.push(visualize(visualizePluginOptions))

const rollupConfig = [
  {
    input: 'src/main.js',
    output: {
      exports: 'named',
      name: 'Clappr',
      file: pkg.main,
      format: 'umd',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'src/main.js',
    output: {
      exports: 'named',
      name: 'Clappr',
      file: pkg.module,
      format: 'esm',
    },
    plugins,
  }
]

minimize && rollupConfig.push(
  {
    input: 'src/main.js',
    output: [
      {
        exports: 'named',
        name: 'Clappr',
        file: 'dist/clappr-core.min.js',
        format: 'umd',
        sourcemap: true,
      },
    ],
    plugins: [
      ...plugins,
      terser(terserPluginOptions),
    ],
  }
)

export default rollupConfig
