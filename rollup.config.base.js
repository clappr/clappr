import path from 'path'

import alias from '@rollup/plugin-alias'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import html from 'rollup-plugin-html'
import namedDirectory from 'rollup-plugin-named-directory'
import nodeBuiltins from 'rollup-plugin-node-builtins'
import nodeGlobals from 'rollup-plugin-node-globals'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'

import { version } from './package.json'

const postcssOptions = {
  use: [
    ['sass', {
      includePaths: [path.resolve('src/base/scss')]
    }]
  ]
}

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/clappr-core.js',
      format: 'umd',
      name: 'Clappr',
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
