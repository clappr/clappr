import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import autoprefixer from 'autoprefixer'
import postcssUrl from 'postcss-url'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)
const babelCore = require('@babel/core')
const REPO_ROOT = fileURLToPath(new URL('./', import.meta.url))
const PACKAGES_DIR = fileURLToPath(new URL('./packages/', import.meta.url))
const BABEL_CONFIG = fileURLToPath(new URL('./babel.base.json', import.meta.url))
const BROWSERSLISTRC = fileURLToPath(new URL('./.browserslistrc', import.meta.url))

export function clapprSiblingSourceAlias() {
  return {
    '@clappr/core': resolve(PACKAGES_DIR, 'clappr-core/src/main.js'),
    '@clappr/zepto': resolve(PACKAGES_DIR, 'clappr-zepto/src/zepto.js'),
    '@clappr/plugins': resolve(PACKAGES_DIR, 'clappr-plugins/src/main.js'),
    '@clappr/hlsjs-playback': resolve(PACKAGES_DIR, 'hlsjs-playback/src/hls.js')
  }
}

const BROWSERSLIST_TO_ESBUILD = {
  chrome: 'chrome',
  and_chr: 'chrome',
  edge: 'edge',
  firefox: 'firefox',
  and_ff: 'firefox',
  safari: 'safari',
  ios_saf: 'ios',
  ie: 'ie',
  ie_mob: 'ie',
  opera: 'opera'
}

function readBrowserslistQueries() {
  return readFileSync(BROWSERSLISTRC, 'utf8')
    .split('\n')
    .map(line => line.replace(/#.*$/, '').trim())
    .filter(Boolean)
}

function cssTargetFromBrowserslistrc() {
  const queries = readBrowserslistQueries()
  const browsers = require('browserslist')(queries, { path: REPO_ROOT })
  const targets = []
  for (const browser of browsers) {
    const [name, version] = browser.split(' ')
    const esbuildName = BROWSERSLIST_TO_ESBUILD[name]
    if (!esbuildName || !version) continue
    targets.push(`${esbuildName}${version.split('-')[0]}`)
  }
  return [...new Set(targets)]
}

function resolveFromCwd(entryPath) {
  return isAbsolute(entryPath) ? entryPath : resolve(process.cwd(), entryPath)
}

function assertEntryExists(pkgSpec) {
  if (typeof pkgSpec.entry !== 'string' || !pkgSpec.entry) {
    throw new Error('defineClapprLib: PackageSpec.entry is required')
  }
  const abs = resolveFromCwd(pkgSpec.entry)
  if (!existsSync(abs)) {
    throw new Error(`defineClapprLib: missing entry "${pkgSpec.entry}" (resolved: ${abs})`)
  }
}

function formatsFor(pkgSpec, isMinify) {
  if (isMinify) return ['umd']
  return pkgSpec.formats || ['umd', 'es']
}

function viteCss(pkgSpec) {
  const css = {
    postcss: {
      plugins: [autoprefixer(), postcssUrl({ url: 'rebase' })]
    }
  }
  if (pkgSpec.cssLoadPaths && pkgSpec.cssLoadPaths.length > 0) {
    css.preprocessorOptions = {
      scss: {
        loadPaths: pkgSpec.cssLoadPaths.map(resolveFromCwd)
      }
    }
  }
  return css
}

function packageVersion() {
  try {
    return require(resolve(process.cwd(), 'package.json')).version
  } catch {
    return undefined
  }
}

function resolvedReplace(pkgSpec) {
  const version = packageVersion()
  return {
    ...(version ? { VERSION: version } : {}),
    ...(pkgSpec.replace || {})
  }
}

export function viteDefine(replace) {
  if (!replace) return undefined
  return Object.fromEntries(
    Object.entries(replace).map(([key, value]) => [key, JSON.stringify(value)])
  )
}

function libFileName(pkgSpec, isMinify) {
  return format => {
    if (isMinify) return pkgSpec.fileName.min
    if (format === 'es') return pkgSpec.fileName.es
    return pkgSpec.fileName.umd
  }
}

function toInputSourceMap(map) {
  if (!map) return false
  if (typeof map === 'string') return JSON.parse(map)
  if (typeof map.toJSON === 'function') return map.toJSON()
  return map
}

// SPEC_DEVIATION: Rolldown reprints object shorthand after renderChunk, so ES5
// must be applied in generateBundle — the last hook that still sees final code.
function babelEs5Output({ compact = false } = {}) {
  return {
    name: 'clappr-babel-es5-output',
    enforce: 'post',
    async generateBundle(_options, bundle) {
      await Promise.all(
        Object.values(bundle)
          .filter(item => item.type === 'chunk')
          .map(async chunk => {
            const result = await babelCore.transformAsync(chunk.code, {
              babelrc: false,
              configFile: BABEL_CONFIG,
              cwd: REPO_ROOT,
              filename: resolveFromCwd(chunk.fileName),
              compact,
              sourceMaps: true,
              inputSourceMap: toInputSourceMap(chunk.map)
            })
            chunk.code = result.code
            if (result.map) chunk.map = result.map
          })
      )
    }
  }
}

export function clapprAssetStrings() {
  return {
    name: 'clappr-asset-strings',
    enforce: 'pre',
    resolveId(source, importer, options) {
      if (options?.isEntry || options?.scan || !importer || source.includes('?')) return null
      // Relative specifiers only. Absolute paths (Unix `/Users/.../index.html`)
      // are Vite HTML entries; rewriting those to `?raw` breaks html-proxy.
      if (!source.startsWith('.')) return null
      if (!/\.[cm]?jsx?$/.test(importer.split('?')[0])) return null
      if (/\.(html|svg)$/.test(source)) {
        return this.resolve(`${source}?raw`, importer, { ...options, skipSelf: true })
      }
      if (/\.scss$/.test(source)) {
        return this.resolve(`${source}?inline`, importer, { ...options, skipSelf: true })
      }
      return null
    }
  }
}

function umdAmdDefine() {
  return {
    name: 'clappr-umd-amd-define',
    generateBundle(_options, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type !== 'chunk') continue
        // Vite UMD emits define([]) ; smoke tests require define(factory) for AMD.
        item.code = item.code.replace(
          /define\.amd\s*\?\s*define\(\s*\[\s*\]\s*,/g,
          'define.amd ? define('
        )
      }
    }
  }
}

function clapprPlugins({ compact = false } = {}) {
  const plugins = [clapprAssetStrings(), babelEs5Output({ compact })]
  if (process.env.ANALYZE_BUNDLE) {
    plugins.push(
      visualizer({
        open: false,
        filename: 'dist/bundle-stats.html',
        gzipSize: true
      })
    )
  }
  plugins.push(umdAmdDefine())
  return plugins
}

function serveConfig(pkgSpec, alias, define, css, cssTarget) {
  const server = pkgSpec.server || {}
  return defineConfig({
    publicDir: pkgSpec.publicDir === undefined ? 'public' : pkgSpec.publicDir,
    define,
    resolve: { alias },
    css,
    plugins: [clapprAssetStrings()],
    server: {
      host: server.host || 'localhost',
      port: server.port || 8080,
      fs: { allow: [REPO_ROOT] }
    },
    build: { cssTarget }
  })
}

export function defineClapprLib(pkgSpec) {
  const cssTarget = cssTargetFromBrowserslistrc()

  return function clapprViteConfig(env = {}) {
    assertEntryExists(pkgSpec)

    const mode = env.mode || 'production'
    const alias = {
      ...(pkgSpec.alias || {}),
      ...(env.command === 'serve' ? pkgSpec.serveAlias || {} : {})
    }
    const define = viteDefine({
      ...resolvedReplace(pkgSpec),
      ...(env.command === 'serve' ? pkgSpec.serveReplace || {} : {})
    })
    const css = viteCss(pkgSpec)

    if (env.command === 'serve') {
      return serveConfig(pkgSpec, alias, define, css, cssTarget)
    }

    const isMinify = mode === 'minify'
    const formats = formatsFor(pkgSpec, isMinify)

    return defineConfig({
      publicDir: false,
      plugins: clapprPlugins({ compact: isMinify }),
      define,
      resolve: { alias },
      css,
      build: {
        target: false,
        cssTarget,
        sourcemap: isMinify || pkgSpec.sourcemap !== false,
        minify: isMinify ? 'terser' : false,
        terserOptions: isMinify ? { ecma: 5 } : undefined,
        emptyOutDir: pkgSpec.emptyOutDir === false ? false : mode === 'production',
        copyPublicDir: false,
        lib: {
          entry: resolveFromCwd(pkgSpec.entry),
          name: pkgSpec.name,
          formats,
          fileName: libFileName(pkgSpec, isMinify)
        },
        rolldownOptions: {
          external: pkgSpec.external || [],
          treeshake:
            pkgSpec.moduleSideEffects == null
              ? undefined
              : { moduleSideEffects: pkgSpec.moduleSideEffects },
          output: {
            globals: pkgSpec.globals || {},
            name: pkgSpec.name,
            exports: pkgSpec.exports
          }
        }
      }
    })
  }
}
