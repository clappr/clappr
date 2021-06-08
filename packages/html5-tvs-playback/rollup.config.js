import { createBabelInputPluginFactory } from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import serve from 'rollup-plugin-serve'
import filesize from 'rollup-plugin-filesize'
import size from 'rollup-plugin-sizes'
import visualize from 'rollup-plugin-visualizer'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import babelConfig from './babel.config.json'

const dev = !!process.env.DEV
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const minimize = !!process.env.MINIMIZE

const babelPluginForUMDBundle = createBabelInputPluginFactory()
const babelPluginForESMBundle = createBabelInputPluginFactory()
const babelPluginOptions = { ...babelConfig, exclude: 'node_modules/**', babelHelpers: 'bundled' }

const plugins = [
  size(),
  filesize(),
  dev && serve({ contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }),
  analyzeBundle && visualize({ open: true }),
]

const mainBundle = {
  input: 'src/html5_playback.js',
  external: ['@clappr/core'],
  output: [
    {
      name: 'HTML5TVsPlayback',
      file: pkg.main,
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
    },
    minimize && {
      name: 'HTML5TVsPlayback',
      file: 'dist/clappr-html5-tvs-playback.min.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
      plugins: terser(),
    },
  ],
  plugins: [babelPluginForUMDBundle(babelPluginOptions), resolve(), commonjs(), ...plugins],
}

const esmBundle = {
  input: 'src/html5_playback.js',
  external: ['@clappr/core', /@babel\/runtime/],
  output: {
    name: 'HTML5TVsPlayback',
    file: pkg.module,
    format: 'esm',
    globals: { '@clappr/core': 'Clappr' },
  },
  plugins: [
    babelPluginForESMBundle({
      ...babelPluginOptions,
      plugins: ['@babel/plugin-transform-runtime'],
      babelHelpers: 'runtime',
    }),
    ...plugins,
  ],
}

export default [mainBundle, esmBundle]
