import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import html from 'rollup-plugin-html'
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import terser from '@rollup/plugin-terser'
import pkg from './package.json'
import { version as clapprCoreVersion } from '@clappr/core/package.json'

const dev = !!process.env.DEV
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const minimize = !!process.env.MINIMIZE

const servePluginOptions = { contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }
const livereloadPluginOptions = { watch: ['dist', 'public'] }
const visualizePluginOptions = {
  open: false,
  filename: 'dist/bundle-stats.html',
  gzipSize: true
}

// Resolve workspace packages to concrete dist files. Avoids a CI ENOTDIR from
// node-resolve treating package "module" paths like
// `.../clappr-plugins.esm.js/package.json` as directories.
const workspaceDistAlias = {
  name: 'workspace-dist-alias',
  resolveId(source) {
    const map = {
      '@clappr/core': path.resolve(__dirname, '../clappr-core/dist/clappr-core.esm.js'),
      '@clappr/plugins': path.resolve(__dirname, '../clappr-plugins/dist/clappr-plugins.esm.js'),
      '@clappr/hlsjs-playback': path.resolve(__dirname, '../hlsjs-playback/dist/hlsjs-playback.esm.js')
    }
    return map[source] || null
  }
}

const plugins = [
  replace({
    preventAssignment: true,
    values: {
      CLAPPR_VERSION: JSON.stringify(pkg.version),
      CLAPPR_CORE_VERSION: JSON.stringify(clapprCoreVersion)
    }
  }),
  workspaceDistAlias,
  resolve(),
  commonjs(),
  babel({ exclude: ['node_modules/**', '../../node_modules/**'], babelHelpers: 'bundled', compact: false }),
  html(),
  postcss(),
  dev && serve(servePluginOptions),
  dev && livereload(livereloadPluginOptions)
]

export default (async () => {
  const analyzePlugins = analyzeBundle
    ? [(await import('rollup-plugin-visualizer')).visualizer(visualizePluginOptions)]
    : []

  return [
    {
      input: 'src/base_bundle.js',
      output: [
        {
          name: 'Clappr',
          file: 'dist/clappr.plainhtml5.js',
          format: 'umd'
        },
        minimize && {
          name: 'Clappr',
          file: 'dist/clappr.plainhtml5.min.js',
          format: 'umd',
          sourcemap: true,
          plugins: terser()
        }
      ],
      plugins
    },
    {
      input: 'src/main.js',
      output: [
        {
          name: 'Clappr',
          file: pkg.main,
          format: 'umd',
          sourcemap: true,
          plugins: analyzePlugins
        },
        minimize && {
          file: 'dist/clappr.min.js',
          format: 'umd',
          name: 'Clappr',
          sourcemap: true,
          plugins: terser()
        }
      ],
      plugins
    }
  ]
})()
