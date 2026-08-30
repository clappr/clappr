/**
 * Smoke-tests the published dist/ artifacts. Core Jest maps @clappr/core to
 * source, so without this the Rollup entry points have no CI signal.
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
const { expectEs5Syntax, expectSourcemapFromSrc } = require('../../../test/dist-contract')

const DIST = path.join(__dirname, '..', 'dist')

const ARTIFACTS = {
  main: 'level-selector.js',
  mainMin: 'level-selector.min.js',
  esm: 'level-selector.esm.js'
}

const UMD_ARTIFACTS = [ARTIFACTS.main, ARTIFACTS.mainMin]

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

function resolveLevelSelector(LevelSelectorExport) {
  return LevelSelectorExport.default || LevelSelectorExport
}

function prototypeChainContains(pluginProto, baseProto) {
  let proto = pluginProto
  while (proto) {
    if (proto === baseProto) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

function loadUmdInSandbox(filename) {
  const code = readArtifact(filename)
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
    runScripts: 'outside-only'
  })
  const sandbox = dom.getInternalVMContext()
  sandbox.Clappr = require('@clappr/core')

  vm.runInContext(code, sandbox, { filename: path.join(DIST, filename) })
  return sandbox
}

function assertLevelSelectorContract(LevelSelectorExport) {
  // Must re-require after resetModules so the prototype identity matches the
  // @clappr/core instance the artifact just resolved.
  const { UICorePlugin } = require('@clappr/core')
  const LevelSelector = resolveLevelSelector(LevelSelectorExport)

  expect(typeof LevelSelector).toBe('function')
  expect(
    prototypeChainContains(
      Object.getPrototypeOf(LevelSelector.prototype),
      UICorePlugin.prototype
    )
  ).toBe(true)
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
  test('exports LevelSelector extending UICorePlugin', () => {
    assertLevelSelectorContract(loadArtifact(filename))
  })

  test('publishes a sourcemap comment', () => {
    assertSourceMappingURL(filename)
  })

  test('does not emit native class syntax', () => {
    expectEs5Syntax(readArtifact(filename), filename)
  })
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

describe('UMD global LevelSelector', () => {
  test.each(UMD_ARTIFACTS)('%s exposes LevelSelector on the sandbox', filename => {
    const sandbox = loadUmdInSandbox(filename)
    expect(typeof sandbox.LevelSelector).toBe('function')
    assertLevelSelectorContract(sandbox.LevelSelector)
  })
})
