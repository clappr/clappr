import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { defineClapprLib } from '../../vite.config.base.mjs'

const require = createRequire(import.meta.url)
const here = dirname(fileURLToPath(import.meta.url))
const { version } = require('./package.json')
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

const alias = {
  '@clappr/core': resolve(here, '../clappr-core/src/main.js'),
  '@clappr/plugins': resolve(here, '../clappr-plugins/src/main.js'),
  '@clappr/hlsjs-playback': resolve(here, '../hlsjs-playback/src/hls.js'),
  '@clappr/zepto': resolve(here, '../clappr-zepto/src/zepto.js')
}

const replace = {
  VERSION: clapprCoreVersion,
  CLAPPR_VERSION: version,
  CLAPPR_CORE_VERSION: clapprCoreVersion
}

const clapprSpec = {
  name: 'Clappr',
  entry: 'src/main.js',
  fileName: {
    umd: 'clappr.js',
    min: 'clappr.min.js'
  },
  formats: ['umd'],
  alias,
  replace,
  cssLoadPaths: ['../clappr-core/src/base/scss'],
  devEntry: 'src/main.js',
  server: { host: '0.0.0.0', port: 8080, contentBase: ['dist', 'public'] }
}

const plainhtml5Spec = {
  name: 'Clappr',
  entry: 'src/base_bundle.js',
  fileName: {
    umd: 'clappr.plainhtml5.js',
    min: 'clappr.plainhtml5.min.js'
  },
  formats: ['umd'],
  alias,
  replace,
  cssLoadPaths: ['../clappr-core/src/base/scss'],
  sourcemap: false,
  emptyOutDir: false
}

const spec = process.env.CLAPPR_BUNDLE === 'plainhtml5' ? plainhtml5Spec : clapprSpec

export default defineClapprLib(spec)
