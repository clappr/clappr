import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import filesize from 'rollup-plugin-filesize'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import size from 'rollup-plugin-sizes'
import { terser } from 'rollup-plugin-terser'
import visualize from 'rollup-plugin-visualizer'
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

const plugins = [
  replace(replacePluginOptions),
  resolve(),
  commonjs(),
  babel(babelOptionsPlugins),
  size(),
  filesize(),
  serveLocal && serve({ contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }),
  reloadEnabled && livereload({ watch: ['dist', 'public'] }),
  analyzeBundle && visualize({ open: true })
].filter(Boolean)

const mainBundle = {
  external: ['@clappr/core'],
  input: 'src/hls.js',
  output: [
    {
      name: 'HlsjsPlayback',
      file: pkg.main,
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
      sourcemap: true
    },
    minimize && {
      name: 'HlsjsPlayback',
      file: 'dist/hlsjs-playback.min.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
      sourcemap: true,
      plugins: [terser()]
    },
    // ESM stays on mainBundle (embeds hls.js): player aliases this file via
    // workspaceDistAlias. dash-shaka puts ESM on externalBundle instead.
    {
      name: 'HlsjsPlayback',
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    }
  ].filter(Boolean),
  plugins
}

const externalBundle = {
  external: ['@clappr/core', 'hls.js'],
  input: 'src/hls.js',
  output: [
    {
      name: 'HlsjsPlayback',
      file: 'dist/hlsjs-playback.external.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr', 'hls.js': 'Hls' },
      sourcemap: true
    },
    minimize && {
      name: 'HlsjsPlayback',
      file: 'dist/hlsjs-playback.external.min.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr', 'hls.js': 'Hls' },
      sourcemap: true,
      plugins: [terser()]
    }
  ].filter(Boolean),
  plugins
}

export default [mainBundle, externalBundle]
