/**
 * Smoke-tests the published dist/ artifacts. Unit tests resolve source
 * modules, so without this the Rollup entry points have no CI signal.
 */
const fs = require('fs')
const path = require('path')

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
  jest.resetModules()
  return require(path.join(DIST, name))
}

function assertCoreContract(dist) {
  const src = require('../src/main.js')

  expect(Object.keys(dist.default).sort()).toEqual(Object.keys(src.default).sort())

  const { HTML5Video, Playback, UIObject, $ } = dist
  expect(Object.getPrototypeOf(HTML5Video.prototype)).toBe(Playback.prototype)
  expect(Object.getPrototypeOf(Playback.prototype)).toBe(UIObject.prototype)
  expect($('<div/>').length).toBe(1)
}

function assertSourceMappingURL(filename) {
  expect(readArtifact(filename)).toContain(`sourceMappingURL=${filename}.map`)
}

describe.each([
  ['main UMD', ARTIFACTS.main],
  ['main UMD minified', ARTIFACTS.mainMin],
  ['ESM', ARTIFACTS.esm]
])('%s (%s)', (_label, filename) => {
  test('exports the core surface with a consistent internal prototype chain', () => {
    assertCoreContract(loadArtifact(filename))
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
