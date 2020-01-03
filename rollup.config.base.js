const path = require('path')

const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const externalGlobals = require('rollup-plugin-external-globals')
const html = require('rollup-plugin-html')
const namedDirectory = require('rollup-plugin-named-directory')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const postcss = require('rollup-plugin-postcss')
const replace = require('@rollup/plugin-replace')
const resolve = require('@rollup/plugin-node-resolve')
const svg = require('rollup-plugin-svg')

const { version } = require('./package.json')

const postcssOptions = {
  use: [
    ['sass', {
      includePaths: [path.resolve('src/public/scss')]
    }]
  ]
}

const baseConfig = {
  input: 'src/main.js',
  external: ['@clappr/core'],
  output: [
    {
      file: 'dist/clappr-plugins.js',
      format: 'umd',
      name: 'ClapprPlugins',
    },
  ],
  plugins: [
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
    svg(),
    postcss(postcssOptions),
    externalGlobals({
      '@clappr/core': 'Clappr',
    }),
  ],
}

module.exports = {
  baseConfig
}
