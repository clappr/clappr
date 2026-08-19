import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import babel from '@rollup/plugin-babel'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)
const babelCore = require('@babel/core')
const REPO_ROOT = fileURLToPath(new URL('./', import.meta.url))
const BABEL_CONFIG = fileURLToPath(new URL('./babel.base.json', import.meta.url))
const BROWSERSLISTRC = fileURLToPath(new URL('./.browserslistrc', import.meta.url))

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

function listedEntries(pkgSpec) {
  if (typeof pkgSpec.entry === 'string') return [pkgSpec.entry]
  if (!pkgSpec.entry || typeof pkgSpec.entry !== 'object') {
    throw new Error('defineClapprLib: PackageSpec.entry is required')
  }
  return [pkgSpec.entry.es, pkgSpec.entry.umd].filter(Boolean)
}

function resolveFromCwd(entryPath) {
  return isAbsolute(entryPath) ? entryPath : resolve(process.cwd(), entryPath)
}

function assertEntriesExist(pkgSpec) {
  const entries = listedEntries(pkgSpec)
  if (entries.length === 0) {
    throw new Error('defineClapprLib: PackageSpec.entry is required')
  }
  for (const entry of entries) {
    const abs = resolveFromCwd(entry)
    if (!existsSync(abs)) {
      throw new Error(`defineClapprLib: missing entry "${entry}" (resolved: ${abs})`)
    }
  }
}

function entryFor(pkgSpec, mode) {
  if (typeof pkgSpec.entry === 'string') return pkgSpec.entry
  if (mode === 'minify') return pkgSpec.entry.umd
  return pkgSpec.entry.umd || pkgSpec.entry.es
}

function viteDefine(replace) {
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

function babelEs5Output({ compact = false } = {}) {
  const transform = code =>
    babelCore.transformAsync(code, {
      babelrc: false,
      configFile: BABEL_CONFIG,
      cwd: REPO_ROOT,
      filename: resolve(REPO_ROOT, 'clappr-lib-chunk.js'),
      compact,
      sourceMaps: true,
      inputSourceMap: false
    })

  return {
    name: 'clappr-babel-es5-output',
    enforce: 'post',
    async generateBundle(_options, bundle) {
      await Promise.all(
        Object.values(bundle)
          .filter(item => item.type === 'chunk')
          .map(async chunk => {
            const result = await transform(chunk.code)
            chunk.code = result.code
            if (result.map) chunk.map = result.map
          })
      )
    }
  }
}

function serveContentBase(dirs) {
  return {
    name: 'clappr-serve-content-base',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
        const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '')
        for (const dir of dirs) {
          const root = resolve(process.cwd(), dir)
          const file = resolve(root, rel)
          if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) continue
          createReadStream(file).pipe(res)
          return
        }
        next()
      })
    }
  }
}

function clapprPlugins(pkgSpec, { compact = false } = {}) {
  const plugins = []
  if (pkgSpec.babel !== false) {
    plugins.push(
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        extensions: ['.js', '.jsx', '.mjs'],
        configFile: BABEL_CONFIG,
        cwd: REPO_ROOT
      }),
      // SPEC_DEVIATION: Rolldown reprints object shorthand after renderChunk.
      // Reason: generateBundle is the last hook that can reapply babel.base.json to ES5.
      babelEs5Output({ compact })
    )
  }
  if (process.env.ANALYZE_BUNDLE) {
    plugins.push(
      visualizer({
        open: false,
        filename: 'dist/bundle-stats.html',
        gzipSize: true
      })
    )
  }
  return plugins
}

/**
 * @param {object} pkgSpec
 * @returns {(env: { mode?: string }) => import('vite').UserConfig}
 */
export function defineClapprLib(pkgSpec) {
  const cssTarget = cssTargetFromBrowserslistrc()

  return function clapprViteConfig(env = {}) {
    assertEntriesExist(pkgSpec)

    const mode = env.mode || 'production'
    const alias = pkgSpec.alias || {}

    if (mode === 'development') {
      const server = pkgSpec.server || {}
      return defineConfig({
        appType: 'custom',
        publicDir: false,
        define: viteDefine(pkgSpec.replace),
        resolve: { alias },
        plugins: [serveContentBase(server.contentBase || ['public', 'dist'])],
        server: {
          host: server.host || '0.0.0.0',
          port: server.port || 8080
        },
        build: { write: false, cssTarget }
      })
    }

    const isMinify = mode === 'minify'
    const formats = isMinify ? ['umd'] : pkgSpec.formats || ['umd', 'es']

    return defineConfig({
      publicDir: false,
      plugins: clapprPlugins(pkgSpec, { compact: isMinify }),
      define: viteDefine(pkgSpec.replace),
      resolve: { alias },
      build: {
        target: false,
        cssTarget,
        sourcemap: true,
        minify: isMinify ? 'terser' : false,
        terserOptions: isMinify ? { ecma: 5 } : undefined,
        emptyOutDir: !isMinify,
        copyPublicDir: false,
        lib: {
          entry: resolveFromCwd(entryFor(pkgSpec, mode)),
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
