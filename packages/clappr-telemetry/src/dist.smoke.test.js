/**
 * Smoke-tests the published dist/ artifacts. Unit tests resolve source
 * modules, so without this the Vite entry points have no CI signal.
 */
const fs = require('fs')
const path = require('path')
const { expectEs5Syntax, expectSourcemapFromSrc } = require('../../../test/dist-contract')

const DIST = path.join(__dirname, '..', 'dist')

const ARTIFACTS = {
  main: 'clappr-telemetry.js',
  mainMin: 'clappr-telemetry.min.js',
  esm: 'clappr-telemetry.esm.js'
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

function assertTelemetryContract(mod) {
  // Must re-require after resetModules so the prototype identity matches the
  // @clappr/core instance the artifact just resolved.
  const { ContainerPlugin } = require('@clappr/core')
  const TelemetryPlugin = mod.default || mod

  expect(typeof TelemetryPlugin).toBe('function')
  expect(Object.getPrototypeOf(TelemetryPlugin.prototype)).toBe(ContainerPlugin.prototype)
  expect(TelemetryPlugin.NetworkAdapters).toBeTruthy()
  expect(TelemetryPlugin.SamplerRegistry).toBeTruthy()
  expect(TelemetryPlugin.ObserverRegistry).toBeTruthy()
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
  test('exports TelemetryPlugin extending ContainerPlugin with registries', () => {
    assertTelemetryContract(loadArtifact(filename))
  })

  test('publishes a sourcemap comment', () => {
    assertSourceMappingURL(filename)
  })

  test('rejects post-ES5 syntax', () => {
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
