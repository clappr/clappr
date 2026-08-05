import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'
import { version as clapprCoreVersion } from '@clappr/core/package.json'
import pkg from './package.json'

const serveLocal = !!process.env.SERVE
const reloadEnabled = !!process.env.RELOAD
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const minimize = !!process.env.MINIMIZE

const babelOptionsPlugins = {
  exclude: ['node_modules/**', '../../node_modules/**'],
  babelHelpers: 'bundled'
}
const replacePluginOptions = {
  CLAPPR_CORE_VERSION: JSON.stringify(clapprCoreVersion),
  preventAssignment: false
}
const visualizePluginOptions = {
  open: false,
  filename: 'dist/bundle-stats.html',
  gzipSize: true
}

const plugins = [
  replace(replacePluginOptions),
  babel(babelOptionsPlugins),
  serveLocal && serve({ contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }),
  reloadEnabled && livereload({ watch: ['dist', 'public'] })
].filter(Boolean)

const bundle = {
  external: ['@clappr/core', 'hls.js'],
  input: 'src/hls.js',
  output: [
    {
      name: 'HlsjsPlayback',
      file: pkg.main,
      format: 'umd',
      globals: { '@clappr/core': 'Clappr', 'hls.js': 'Hls' },
      sourcemap: true,
      plugins: analyzeBundle ? [visualizer(visualizePluginOptions)] : []
    },
    minimize && {
      name: 'HlsjsPlayback',
      file: 'dist/hlsjs-playback.min.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr', 'hls.js': 'Hls' },
      sourcemap: true,
      plugins: [terser()]
    },
    {
      name: 'HlsjsPlayback',
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    }
  ].filter(Boolean),
  plugins
}

export default bundle
