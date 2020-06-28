import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import html from 'rollup-plugin-html'
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import filesize from 'rollup-plugin-filesize'
import size from 'rollup-plugin-sizes'
import visualize from 'rollup-plugin-visualizer'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import { version as clapprCoreVersion } from '@clappr/core/package.json'

const dev = !!process.env.DEV
const analyzeBundle = !!process.env.ANALYZE_BUNDLE
const minimize = !!process.env.MINIMIZE

const plugins = [
  replace({
    VERSION: JSON.stringify(pkg.version),
    CLAPPR_CORE_VERSION: JSON.stringify(clapprCoreVersion),
  }),
  resolve(),
  commonjs(),
  babel({ exclude: 'node_modules/**' }),
  html(),
  postcss(),
  size(),
  filesize(),
]

dev && plugins.push(
  serve({ contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }),
  livereload({ watch: ['dist', 'public'] }),
)

analyzeBundle && plugins.push(visualize({ open: true }))

const rollupConfig = [
  {
    input: 'src/base_bundle.js',
    output: {
      name: 'Clappr',
      file: 'dist/clappr.plainhtml5.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'src/main.js',
    output: {
      name: 'Clappr',
      file: pkg.main,
      format: 'umd',
      sourcemap: true,
    },
    plugins,
  },
]

minimize && rollupConfig.push(
  {
    input: 'src/base_bundle.js',
    output: [
      {
        name: 'Clappr',
        file: 'dist/clappr.plainhtml5.min.js',
        format: 'umd',
        sourcemap: true,
      },
    ],
    plugins: [
      ...plugins,
      terser({ include: [/^.+\.min\.js$/] }),
    ],
  },
  {
    input: 'src/main.js',
    output: [
      {
        file: 'dist/clappr.min.js',
        format: 'umd',
        name: 'Clappr',
        sourcemap: true,
      },
    ],
    plugins: [
      ...plugins,
      terser({
        include: [/^.+\.min\.js$/],
      }),
    ],
  }
)

export default rollupConfig
