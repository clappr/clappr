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
  main: 'dash-shaka-playback.js',
  mainMin: 'dash-shaka-playback.min.js',
  esm: 'dash-shaka-playback.esm.mjs'
}

const UMD_ARTIFACTS = [ARTIFACTS.main, ARTIFACTS.mainMin]

function readArtifact(name) {
  return fs.readFileSync(path.join(DIST, name), 'utf8')
}

function loadArtifact(name) {
  vi.resetModules()
  return require(path.join(DIST, name))
}

function resolvePlayback(DashShakaPlayback) {
  return DashShakaPlayback.default || DashShakaPlayback
}

function loadUmdInSandbox(filename, { shaka } = {}) {
  const code = readArtifact(filename)
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
    runScripts: 'outside-only'
  })
  const sandbox = dom.getInternalVMContext()
  sandbox.Clappr = require('@clappr/core')
  if (shaka !== undefined) sandbox.shaka = shaka

  vm.runInContext(code, sandbox, { filename: path.join(DIST, filename) })
  return sandbox
}

function assertPlaybackContract(DashShakaPlayback) {
  // Must re-require after resetModules so the prototype identity matches the
  // @clappr/core instance the artifact just resolved.
  const { HTML5Video } = require('@clappr/core')
  const Playback = resolvePlayback(DashShakaPlayback)

  expect(typeof Playback).toBe('function')
  expect(Object.getPrototypeOf(Playback.prototype)).toBe(HTML5Video.prototype)

  const shaka = Playback.shakaPlayer
  expect(shaka).toBeTruthy()
  expect(typeof shaka.polyfill).toBe('function')
  expect(typeof shaka.Player).toBe('function')
  expect(shaka.util).toBeTruthy()
  expect(shaka.net).toBeTruthy()
  expect(shaka.media).toBeTruthy()
  expect(typeof shaka.Player.version).toBe('string')
  expect(shaka.Player.version.length).toBeGreaterThan(0)

  vi.spyOn(shaka.polyfill, 'installAll').mockImplementation(() => {})
  vi.spyOn(shaka.Player, 'isBrowserSupported').mockReturnValue(true)
  vi.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {})

  const playback = new Playback({ src: 'http://example.com/video.mpd' })
  try {
    expect(playback.shakaVersion).toBe(shaka.Player.version)
    expect(Playback.Events.SHAKA_READY).toBe('shaka:ready')

    expect(Playback.canPlay('http://example.com/video.mpd')).toBe(true)
    expect(Playback.canPlay('http://example.com/video.mpd?token=1')).toBe(true)
    expect(Playback.canPlay('http://example.com/video.m3u8')).toBe(false)
    expect(Playback.canPlay('http://example.com/video', 'application/dash+xml')).toBe(true)
  } finally {
    playback.destroy()
  }
}

function assertSourceMappingURL(filename) {
  expect(readArtifact(filename)).toContain(`sourceMappingURL=${filename}.map`)
  expectSourcemapFromSrc(readArtifact(`${filename}.map`), filename)
}

const EXPECTED_ARTIFACTS = Object.values(ARTIFACTS).sort()
const EXPECTED_SOURCEMAPS = EXPECTED_ARTIFACTS.map(filename => `${filename}.map`).sort()

afterEach(() => {
  vi.restoreAllMocks()
})

describe.each([
  ['main UMD', ARTIFACTS.main],
  ['main UMD minified', ARTIFACTS.mainMin],
  ['ESM', ARTIFACTS.esm]
])('%s (%s)', (_label, filename) => {
  test('exports a DashShakaPlayback class that extends HTML5Video and exposes shaka', () => {
    assertPlaybackContract(loadArtifact(filename))
  })

  test('publishes a sourcemap comment', () => {
    assertSourceMappingURL(filename)
  })

  test('does not emit native class syntax', () => {
    expectEs5Syntax(readArtifact(filename), filename)
  })
})

// Expects `release` / MINIMIZE=true (CI: yarn build:dist). Plain `yarn build`
// omits .min.js and fails this inventory — that is not a product bug.
describe('dist inventory', () => {
  test('ships exactly the expected artifacts', () => {
    const artifacts = fs
      .readdirSync(DIST)
      .filter(f => /\.(js|mjs)$/.test(f))
      .sort()
    expect(artifacts).toEqual(EXPECTED_ARTIFACTS)
  })

  test('ships exactly the expected .map files', () => {
    const maps = fs
      .readdirSync(DIST)
      .filter(f => f.endsWith('.map'))
      .sort()
    expect(maps).toEqual(EXPECTED_SOURCEMAPS)
  })
})

describe('shaka-player peer identity', () => {
  test.each(Object.values(ARTIFACTS))('%s defers to the consumer shaka-player', filename => {
    const Playback = resolvePlayback(loadArtifact(filename))
    expect(Playback.shakaPlayer).toBe(require('shaka-player'))
  })
})

describe('UMD global.shaka branch', () => {
  test.each(UMD_ARTIFACTS)('%s resolves shaka from window.shaka', filename => {
    const shaka = require('shaka-player')
    const sandbox = loadUmdInSandbox(filename, { shaka })
    expect(sandbox.DashShakaPlayback.shakaPlayer).toBe(shaka)
  })

  test.each(UMD_ARTIFACTS)('%s throws a clear error when window.shaka is missing', filename => {
    expect(() => loadUmdInSandbox(filename)).toThrow(
      'dash-shaka-playback requires shaka-player to be loaded before it'
    )
  })

  test.each(UMD_ARTIFACTS)('%s throws when window.shaka lacks Player', filename => {
    expect(() => loadUmdInSandbox(filename, { shaka: {} })).toThrow(
      'dash-shaka-playback requires shaka-player to be loaded before it'
    )
  })
})

describe('package exports', () => {
  test('resolves the deep dist path used by bundler consumers', () => {
    expect(require.resolve('dash-shaka-playback/dist/dash-shaka-playback.min.js')).toBe(
      path.join(DIST, ARTIFACTS.mainMin)
    )
  })
})
