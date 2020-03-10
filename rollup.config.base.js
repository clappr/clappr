const path = require('path')

const alias = require('@rollup/plugin-alias')
const babel = require('rollup-plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const html = require('rollup-plugin-html')
const namedDirectory = require('rollup-plugin-named-directory')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const postcss = require('rollup-plugin-postcss')
const replace = require('@rollup/plugin-replace')
const resolve = require('@rollup/plugin-node-resolve')

const { version } = require('./package.json')

const postcssOptions = {
  use: [
    ['sass', {
      includePaths: [path.resolve('src/base/scss')]
    }]
  ]
}

const baseConfig = {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/clappr-core.js',
      format: 'umd',
      name: 'Clappr',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    alias({
      entries: {
        'clappr-zepto': 'node_modules/clappr-zepto/zepto.js',
      }
    }),
    replace({
      VERSION: JSON.stringify(version),
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
    postcss(postcssOptions),
  ],
}

module.exports = {
  baseConfig
}
