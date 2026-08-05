import babel from '@rollup/plugin-babel'
import filesize from 'rollup-plugin-filesize'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import size from 'rollup-plugin-sizes'
import terser from '@rollup/plugin-terser'
import visualize from 'rollup-plugin-visualizer'
import pkg from './package.json'

const dev = !!process.env.DEV
const reloadEnabled = !!process.env.RELOAD
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const minimize = !!process.env.MINIMIZE

const babelOptions = {
  exclude: ['node_modules/**', '../../node_modules/**'],
  babelHelpers: 'bundled'
}

const plugins = [
  babel(babelOptions),
  size(),
  filesize(),
  dev && serve({ contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }),
  reloadEnabled && livereload({ watch: ['dist', 'public'] }),
  analyzeBundle && visualize({ open: true })
].filter(Boolean)

const bundle = {
  input: 'src/clappr-dash-shaka-playback.js',
  external: ['@clappr/core', 'shaka-player'],
  output: [
    {
      name: 'DashShakaPlayback',
      file: pkg.main,
      format: 'umd',
      globals: { '@clappr/core': 'Clappr', 'shaka-player': 'shaka' },
      sourcemap: true
    },
    minimize && {
      name: 'DashShakaPlayback',
      file: 'dist/dash-shaka-playback.min.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr', 'shaka-player': 'shaka' },
      sourcemap: true,
      plugins: [terser()]
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    }
  ].filter(Boolean),
  plugins
}

export default bundle
