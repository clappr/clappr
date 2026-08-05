/**
 * Smoke-tests the published dist/ artifacts. Core Jest maps @clappr/core to
 * source, so without this the Rollup entry points have no CI signal.
 */
const fs = require('fs')
const path = require('path')
const semver = require('semver')
const { expectNoNativeClasses } = require('../../../test/dist-contract')

const DIST = path.join(__dirname, '..', 'dist')
const PKG = require('../package.json')

const ARTIFACTS = {
  main: 'clappr-html5-tvs-playback.js',
  mainMin: 'clappr-html5-tvs-playback.min.js',
  esm: 'clappr-html5-tvs-playback.esm.js'
}

const EXPECTED_SOURCEMAPS = Object.values(ARTIFACTS)
  .map(filename => `${filename}.map`)
  .sort()

// Earliest @babel/runtime that ships each helper the ESM may import.
const HELPER_SINCE = {
  classCallCheck: '7.0.0',
  createClass: '7.0.0',
  inherits: '7.0.0',
  callSuper: '7.23.9',
  superPropGet: '7.25.0'
}

function readArtifact(name) {
  return fs.readFileSync(path.join(DIST, name), 'utf8')
}

function loadArtifact(name) {
  jest.resetModules()
  return require(path.join(DIST, name))
}

function runtimeHelpersIn(code) {
  const names = new Set()
  for (const match of code.matchAll(/@babel\/runtime\/helpers\/([A-Za-z0-9_]+)/g)) {
    names.add(match[1])
  }
  return [...names].sort()
}

function assertPlaybackContract(mod) {
  // Must re-require after resetModules so the prototype identity matches the
  // @clappr/core instance the artifact just resolved.
  const { Playback } = require('@clappr/core')
  const HTML5TVsPlayback = mod.default || mod

  expect(typeof HTML5TVsPlayback).toBe('function')
  expect(Object.getPrototypeOf(HTML5TVsPlayback.prototype)).toBe(Playback.prototype)

  expect(HTML5TVsPlayback.canPlay('http://example.com/video.mp4', 'video/mp4')).toBe(true)
  expect(HTML5TVsPlayback.canPlay('http://example.com/video', 'mock/xpto')).toBe(false)
}

function assertSourceMappingURL(filename) {
  expect(readArtifact(filename)).toContain(`sourceMappingURL=${filename}.map`)
}

describe.each([
  ['main UMD', ARTIFACTS.main],
  ['main UMD minified', ARTIFACTS.mainMin],
  ['ESM', ARTIFACTS.esm]
])('%s (%s)', (_label, filename) => {
  test('exports HTML5TVsPlayback extending Playback with canPlay', () => {
    assertPlaybackContract(loadArtifact(filename))
  })

  test('publishes a sourcemap comment', () => {
    assertSourceMappingURL(filename)
  })

  test('does not emit native class syntax', () => {
    expectNoNativeClasses(readArtifact(filename))
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

describe('ESM @babel/runtime contract', () => {
  const helpers = runtimeHelpersIn(readArtifact(ARTIFACTS.esm))
  const range = PKG.dependencies['@babel/runtime']
  const requiredFloor = helpers
    .map(name => HELPER_SINCE[name])
    .filter(Boolean)
    .sort(semver.compare)
    .at(-1)

  test('UMD builds do not import @babel/runtime', () => {
    expect(readArtifact(ARTIFACTS.main)).not.toMatch(/@babel\/runtime/)
    expect(readArtifact(ARTIFACTS.mainMin)).not.toMatch(/@babel\/runtime/)
  })

  test('imports helpers that resolve in the workspace install', () => {
    expect(helpers.length).toBeGreaterThan(0)
    for (const name of helpers) {
      require.resolve(`@babel/runtime/helpers/${name}`)
    }
  })

  test('every imported helper has a catalogued floor', () => {
    expect(helpers.filter(name => !(name in HELPER_SINCE))).toEqual([])
  })

  test('published range covers the floor implied by imported helpers', () => {
    expect(requiredFloor).toBeDefined()
    expect(semver.gte(semver.minVersion(range), requiredFloor)).toBe(true)
    expect(semver.satisfies('8.0.0', range)).toBe(true)
  })
})
