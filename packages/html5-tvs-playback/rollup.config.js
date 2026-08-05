import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import serve from 'rollup-plugin-serve'
import size from 'rollup-plugin-sizes'
import terser from '@rollup/plugin-terser'
import visualize from 'rollup-plugin-visualizer'
import pkg from './package.json'

const dev = !!process.env.DEV
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const minimize = !!process.env.MINIMIZE

const babelOptionsUMD = { exclude: ['node_modules/**', '../../node_modules/**'], babelHelpers: 'bundled' }
const babelOptionsESM = {
  exclude: ['node_modules/**', '../../node_modules/**'],
  babelHelpers: 'runtime',
  plugins: ['@babel/plugin-transform-runtime'],
}

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
      sourcemap: true,
    },
    minimize && {
      name: 'HTML5TVsPlayback',
      file: 'dist/clappr-html5-tvs-playback.min.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
      sourcemap: true,
      plugins: terser(),
    },
  ].filter(Boolean),
  plugins: [babel(babelOptionsUMD), resolve(), commonjs(), ...plugins.filter(Boolean)],
}

const esmBundle = {
  input: 'src/html5_playback.js',
  external: ['@clappr/core', /@babel\/runtime/],
  output: {
    name: 'HTML5TVsPlayback',
    file: pkg.module,
    format: 'esm',
    globals: { '@clappr/core': 'Clappr' },
    sourcemap: true,
  },
  plugins: [babel(babelOptionsESM), ...plugins.filter(Boolean)],
}

export default [mainBundle, esmBundle]
