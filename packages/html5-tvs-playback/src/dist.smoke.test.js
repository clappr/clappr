/**
 * Smoke-tests the published dist/ artifacts. Core Jest maps @clappr/core to
 * source, so without this the Rollup entry points have no CI signal.
 */
const fs = require('fs')
const path = require('path')
const { expectNoNativeClasses } = require('../../../test/dist-contract')

const DIST = path.join(__dirname, '..', 'dist')

const ARTIFACTS = {
  main: 'clappr-html5-tvs-playback.js',
  mainMin: 'clappr-html5-tvs-playback.min.js',
  esm: 'clappr-html5-tvs-playback.esm.js'
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

  test('does not import @babel/runtime', () => {
    expect(readArtifact(filename)).not.toMatch(/@babel\/runtime/)
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
