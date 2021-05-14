const path = require('path')

const babel = require('rollup-plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const html = require('rollup-plugin-html')
const namedDirectory = require('rollup-plugin-named-directory')
const postcss = require('rollup-plugin-postcss')
const replace = require('@rollup/plugin-replace')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const svg = require('rollup-plugin-svg')

const { version } = require('./package.json')
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

const postcssOptions = {
  use: [
    ['sass', {
      includePaths: [
        path.resolve('node_modules/@clappr/core/src/base/scss')
      ]
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
      globals: {
        '@clappr/core': 'Clappr',
      }
    },
  ],
  plugins: [
    replace({
      VERSION: JSON.stringify(version),
      CLAPPR_CORE_VERSION: JSON.stringify(clapprCoreVersion),
      preventAssignment: false,
    }),
    commonjs(),
    nodeResolve(),
    namedDirectory(),
    babel({
      exclude: 'node_modules/**'
    }),
    html(),
    svg(),
    postcss(postcssOptions),
  ],
}

module.exports = {
  baseConfig,
  postcssOptions,
}
