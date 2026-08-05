/**
 * Smoke-tests the published dist/ artifacts. Core Jest maps @clappr/core to
 * source, so without this the Rollup entry points have no CI signal.
 */
const fs = require('fs')
const path = require('path')

const DIST = path.join(__dirname, '..', 'dist')

const ARTIFACTS = {
  main: 'clappr-plugins.js',
  mainMin: 'clappr-plugins.min.js',
  esm: 'clappr-plugins.esm.js'
}

const EXPECTED_SOURCEMAPS = Object.values(ARTIFACTS)
  .map(filename => `${filename}.map`)
  .sort()

function readArtifact(name) {
  return fs.readFileSync(path.join(DIST, name), 'utf8')
}

function loadArtifact(name) {
  jest.resetModules()
  return require(path.join(DIST, name))
}

function prototypeChainContains(pluginProto, baseProto) {
  let proto = pluginProto
  while (proto) {
    if (proto === baseProto) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

function assertPluginsContract(dist) {
  // Must re-require after resetModules so the prototype identity matches the
  // @clappr/core instance the artifact just resolved.
  const { ContainerPlugin, CorePlugin, UIContainerPlugin, UICorePlugin } = require('@clappr/core')
  const bases = [
    ContainerPlugin.prototype,
    CorePlugin.prototype,
    UIContainerPlugin.prototype,
    UICorePlugin.prototype
  ]

  for (const Plugin of Object.values(dist.Plugins)) {
    expect(typeof Plugin).toBe('function')
    const matchesBase = bases.some(base =>
      prototypeChainContains(Object.getPrototypeOf(Plugin.prototype), base)
    )
    expect(matchesBase).toBe(true)
  }

  expect(
    prototypeChainContains(
      Object.getPrototypeOf(dist.Plugins.MediaControl.prototype),
      UICorePlugin.prototype
    )
  ).toBe(true)
  expect(
    prototypeChainContains(
      Object.getPrototypeOf(dist.Plugins.Poster.prototype),
      UIContainerPlugin.prototype
    )
  ).toBe(true)
  expect(
    prototypeChainContains(
      Object.getPrototypeOf(dist.Plugins.ClickToPause.prototype),
      ContainerPlugin.prototype
    )
  ).toBe(true)
}

function assertSourceMappingURL(filename) {
  expect(readArtifact(filename)).toContain(`sourceMappingURL=${filename}.map`)
}

describe.each([
  ['main UMD', ARTIFACTS.main],
  ['main UMD minified', ARTIFACTS.mainMin],
  ['ESM', ARTIFACTS.esm]
])('%s (%s)', (_label, filename) => {
  test('exports plugins that extend the consumer core plugin bases', () => {
    assertPluginsContract(loadArtifact(filename))
  })

  test('publishes a sourcemap comment', () => {
    assertSourceMappingURL(filename)
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
