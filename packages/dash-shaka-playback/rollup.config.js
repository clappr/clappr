import babel from '@rollup/plugin-babel'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from './package.json'

const dev = !!process.env.DEV
const reloadEnabled = !!process.env.RELOAD
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const minimize = !!process.env.MINIMIZE

const babelOptions = {
  exclude: ['node_modules/**', '../../node_modules/**'],
  babelHelpers: 'bundled'
}
const visualizePluginOptions = {
  open: false,
  filename: 'dist/bundle-stats.html',
  gzipSize: true
}

const plugins = [
  babel(babelOptions),
  dev && serve({ contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }),
  reloadEnabled && livereload({ watch: ['dist', 'public'] })
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
      sourcemap: true,
      plugins: analyzeBundle ? [visualizer(visualizePluginOptions)] : []
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
