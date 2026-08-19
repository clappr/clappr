/**
 * Smoke-tests the published dist/ artifacts. Unit tests resolve source
 * modules, so without this the Rollup entry points have no CI signal.
 */
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const { TextEncoder, TextDecoder } = require('util')

// jest-environment-jsdom omits these; must run before the require below —
// jsdom's whatwg-url throws on load without TextEncoder/TextDecoder.
global.TextEncoder = global.TextEncoder || TextEncoder
global.TextDecoder = global.TextDecoder || TextDecoder
const { JSDOM } = require('jsdom')
const {
  expectEs5Syntax,
  expectEs5Subclassable,
  expectSourcemapFromSrc
} = require('../../../test/dist-contract')

const DIST = path.join(__dirname, '..', 'dist')

const ARTIFACTS = {
  main: 'clappr-core.js',
  mainMin: 'clappr-core.min.js',
  esm: 'clappr-core.esm.js'
}

const EXPECTED_SOURCEMAPS = Object.values(ARTIFACTS)
  .map(filename => `${filename}.map`)
  .sort()

function readArtifact(name) {
  return fs.readFileSync(path.join(DIST, name), 'utf8')
}

function loadArtifact(name) {
  vi.resetModules()
  return require(path.join(DIST, name))
}

function namedExportKeys(mod) {
  return Object.keys(mod)
    .filter(key => key !== 'default' && key !== '__esModule')
    .sort()
}

function loadUmdInSandbox(filename, { amd = false } = {}) {
  const code = readArtifact(filename)
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
    runScripts: 'outside-only'
  })
  const sandbox = dom.getInternalVMContext()

  let amdExports
  if (amd) {
    sandbox.define = (depsOrFactory, maybeFactory) => {
      if (typeof depsOrFactory === 'function') {
        amdExports = depsOrFactory()
        return
      }
      const factory = maybeFactory
      const args = depsOrFactory.map(dep => {
        if (dep === 'exports') {
          amdExports = {}
          return amdExports
        }
        return undefined
      })
      factory(...args)
    }
    sandbox.define.amd = {}
  }

  vm.runInContext(code, sandbox, { filename: path.join(DIST, filename) })
  return { sandbox, amdExports }
}

async function assertCoreContract(dist) {
  const src = await import('../src/main.js')
  const srcDefault = src.default || src

  expect(Object.keys(dist.default).sort()).toEqual(Object.keys(srcDefault).sort())
  expect(namedExportKeys(dist)).toEqual(namedExportKeys(src))

  const { HTML5Video, Playback, UIObject, $ } = dist
  expect(Object.getPrototypeOf(HTML5Video.prototype)).toBe(Playback.prototype)
  expect(Object.getPrototypeOf(Playback.prototype)).toBe(UIObject.prototype)
  expect($('<div/>').length).toBe(1)
}

function assertSourceMappingURL(filename) {
  expect(readArtifact(filename)).toContain(`sourceMappingURL=${filename}.map`)
  expectSourcemapFromSrc(readArtifact(`${filename}.map`), filename)
}

describe.each([
  ['main UMD', ARTIFACTS.main],
  ['main UMD minified', ARTIFACTS.mainMin],
  ['ESM', ARTIFACTS.esm]
])('%s (%s)', (_label, filename) => {
  test('exports the core surface with a consistent internal prototype chain', async () => {
    await assertCoreContract(loadArtifact(filename))
  })

  test('publishes a sourcemap comment', () => {
    assertSourceMappingURL(filename)
  })

  test('does not emit native class syntax', () => {
    expectEs5Syntax(readArtifact(filename), filename)
  })

  test('plugin bases are ES5-subclassable', () => {
    const { BaseObject, UIObject, UICorePlugin } = loadArtifact(filename)
    expectEs5Subclassable(BaseObject)
    expectEs5Subclassable(UIObject)
    expectEs5Subclassable(UICorePlugin, { options: {} })
  })
})

describe('UMD global and AMD branches', () => {
  test.each([ARTIFACTS.main, ARTIFACTS.mainMin])(
    '%s sets global Clappr without an AMD loader',
    filename => {
      const { sandbox } = loadUmdInSandbox(filename, { amd: false })
      expect(typeof sandbox.Clappr).toBe('object')
      expect(typeof sandbox.Clappr.Player).toBe('function')
    }
  )

  test.each([ARTIFACTS.main, ARTIFACTS.mainMin])(
    '%s does not set global Clappr when define.amd is present',
    filename => {
      const { sandbox, amdExports } = loadUmdInSandbox(filename, { amd: true })
      expect(sandbox.Clappr).toBeUndefined()
      expect(typeof amdExports.Player).toBe('function')
    }
  )
})

describe('dist sourcemap inventory', () => {
  test('ships exactly the expected .map files', () => {
    const maps = fs
      .readdirSync(DIST)
      .filter(f => f.endsWith('.map'))
      .sort()
    expect(maps).toEqual(EXPECTED_SOURCEMAPS)
  })
})
