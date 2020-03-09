const path = require('path')

const babel = require('rollup-plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const html = require('rollup-plugin-html')
const namedDirectory = require('rollup-plugin-named-directory')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const postcss = require('rollup-plugin-postcss')
const replace = require('@rollup/plugin-replace')
const resolve = require('@rollup/plugin-node-resolve')
const svg = require('rollup-plugin-svg')

const { version } = require('./package.json')
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

const plugins = [
  replace({
    VERSION: JSON.stringify(version),
    CLAPPR_CORE_VERSION: JSON.stringify(clapprCoreVersion),
  }),
  commonjs(),
  nodeBuiltins(),
  nodeGlobals(),
  resolve(),
  namedDirectory(),
  babel({
    exclude: 'node_modules/**'
  }),
  html(),
  svg(),
  postcss(),
]

let baseConfig = [
  {
    input: 'src/base_bundle.js',
    output: [
      {
        file: 'dist/clappr.plainhtml5.js',
        format: 'umd',
        name: 'Clappr',
        sourcemap: true,
      },
    ],
    plugins,
  },
  {
    input: 'src/main.js',
    output: [
      {
        file: 'dist/clappr.js',
        format: 'umd',
        name: 'Clappr',
        sourcemap: true,
      },
    ],
    plugins,
  }
]

module.exports = {
  baseConfig,
  plugins,
}
