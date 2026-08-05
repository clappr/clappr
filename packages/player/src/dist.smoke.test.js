/**
 * Smoke-tests the published dist/ artifacts. The player bundle embeds core,
 * plugins and playbacks, so identity checks are against the same module.
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
const { expectNoNativeClasses, expectEs5Subclassable } = require('../../../test/dist-contract')

const DIST = path.join(__dirname, '..', 'dist')
const pkg = require('../package.json')

const ARTIFACTS = {
  main: 'clappr.js',
  mainMin: 'clappr.min.js',
  plainhtml5: 'clappr.plainhtml5.js',
  plainhtml5Min: 'clappr.plainhtml5.min.js'
}

const FULL_PLAYER = [ARTIFACTS.main, ARTIFACTS.mainMin]
const PLAINHTML5 = [ARTIFACTS.plainhtml5, ARTIFACTS.plainhtml5Min]
const UMD_ARTIFACTS = Object.values(ARTIFACTS)

// Demo-only unminified entry: no map per AGENTS.md sourcemap policy.
const EXPECTED_SOURCEMAPS = [
  'clappr.js.map',
  'clappr.min.js.map',
  'clappr.plainhtml5.min.js.map'
].sort()

function readArtifact(name) {
  return fs.readFileSync(path.join(DIST, name), 'utf8')
}

function loadArtifact(name) {
  jest.resetModules()
  return require(path.join(DIST, name))
}

function resolveClappr(mod) {
  return mod.default || mod
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

function prototypeChainContains(pluginProto, baseProto) {
  let proto = pluginProto
  while (proto) {
    if (proto === baseProto) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

function assertSharedBundleContract(C) {
  expect(C.version).toBe(pkg.version)

  const bases = [
    C.ContainerPlugin.prototype,
    C.CorePlugin.prototype,
    C.UIContainerPlugin.prototype,
    C.UICorePlugin.prototype
  ]

  for (const Plugin of Object.values(C.Plugins)) {
    expect(typeof Plugin).toBe('function')
    const matchesBase = bases.some(base =>
      prototypeChainContains(Object.getPrototypeOf(Plugin.prototype), base)
    )
    expect(matchesBase).toBe(true)
  }
}

function assertSourceMappingURL(filename) {
  expect(readArtifact(filename)).toContain(`sourceMappingURL=${filename}.map`)
}

describe.each([
  ['main UMD', ARTIFACTS.main],
  ['main UMD minified', ARTIFACTS.mainMin],
  ['plainhtml5 UMD', ARTIFACTS.plainhtml5],
  ['plainhtml5 UMD minified', ARTIFACTS.plainhtml5Min]
])('%s (%s)', (_label, filename) => {
  test('exports plugins that extend the same-bundle plugin bases', () => {
    assertSharedBundleContract(resolveClappr(loadArtifact(filename)))
  })

  test('plugin bases are ES5-subclassable', () => {
    expectEs5Subclassable(resolveClappr(loadArtifact(filename)).BaseObject)
  })
})

describe('full player HLS', () => {
  test.each(FULL_PLAYER)('%s HLS extends HTML5Video', filename => {
    const C = resolveClappr(loadArtifact(filename))
    expect(Object.getPrototypeOf(C.HLS.prototype)).toBe(C.HTML5Video.prototype)
  })

  test.each(FULL_PLAYER)('%s embeds its own hls.js copy', filename => {
    const C = resolveClappr(loadArtifact(filename))
    expect(C.HLS.HLSJS).toBeDefined()
    expect(C.HLS.HLSJS).not.toBe(require('hls.js'))
  })
})

describe('plainhtml5 bundle', () => {
  test.each(PLAINHTML5)('%s has no HLS', filename => {
    const C = resolveClappr(loadArtifact(filename))
    expect(C.HLS).toBeUndefined()
  })

  test.each(PLAINHTML5)('%s does not emit native class syntax', filename => {
    expectNoNativeClasses(readArtifact(filename))
  })
})

describe('UMD global and AMD branches', () => {
  test.each(UMD_ARTIFACTS)('%s sets global Clappr without an AMD loader', filename => {
    const { sandbox } = loadUmdInSandbox(filename, { amd: false })
    expect(typeof sandbox.Clappr).toBe('object')
    expect(typeof sandbox.Clappr.Player).toBe('function')
  })

  test.each(UMD_ARTIFACTS)('%s does not set global Clappr when define.amd is present', filename => {
    const { sandbox, amdExports } = loadUmdInSandbox(filename, { amd: true })
    expect(sandbox.Clappr).toBeUndefined()
    expect(typeof amdExports.Player).toBe('function')
  })
})

describe('sourcemap comments', () => {
  test.each([ARTIFACTS.main, ARTIFACTS.mainMin, ARTIFACTS.plainhtml5Min])(
    '%s publishes a sourcemap comment',
    filename => {
      assertSourceMappingURL(filename)
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
