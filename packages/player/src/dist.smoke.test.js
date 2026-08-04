/**
 * Smoke-tests the published dist/ artifacts. The player bundle embeds core,
 * plugins and playbacks, so identity checks are against the same module.
 */
const fs = require('fs')
const path = require('path')

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

// plainhtml5.js is demo-only and ships no map by policy.
const EXPECTED_SOURCEMAPS = [
  'clappr.js.map',
  'clappr.min.js.map',
  'clappr.plainhtml5.min.js.map'
].sort()

function loadArtifact(name) {
  jest.resetModules()
  return require(path.join(DIST, name))
}

function resolveClappr(mod) {
  return mod.default || mod
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

  for (const [, Plugin] of Object.entries(C.Plugins)) {
    expect(typeof Plugin).toBe('function')
    const matchesBase = bases.some(base =>
      prototypeChainContains(Object.getPrototypeOf(Plugin.prototype), base)
    )
    expect(matchesBase).toBe(true)
  }
}

function assertSourceMappingURL(filename) {
  const source = fs.readFileSync(path.join(DIST, filename), 'utf8')
  expect(source).toContain(`sourceMappingURL=${filename}.map`)
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
})

describe('full player HLS', () => {
  test.each(FULL_PLAYER)('%s HLS extends HTML5Video', filename => {
    const C = resolveClappr(loadArtifact(filename))
    expect(Object.getPrototypeOf(C.HLS.prototype)).toBe(C.HTML5Video.prototype)
  })
})

describe('plainhtml5 bundle', () => {
  test.each(PLAINHTML5)('%s has no HLS', filename => {
    const C = resolveClappr(loadArtifact(filename))
    expect(C.HLS).toBeUndefined()
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
