/**
 * Smoke-tests the published dist/ artifacts. Core Jest maps @clappr/core to
 * source, so without this the Rollup entry points have no CI signal.
 */
const fs = require('fs')
const path = require('path')

const DIST = path.join(__dirname, '..', 'dist')

const ARTIFACTS = {
  main: 'dash-shaka-playback.js',
  mainMin: 'dash-shaka-playback.min.js',
  external: 'dash-shaka-playback.external.js',
  externalMin: 'dash-shaka-playback.external.min.js',
  esm: 'dash-shaka-playback.esm.mjs'
}

const EMBEDS_SHAKA = [ARTIFACTS.main, ARTIFACTS.mainMin]
const EXTERNAL_SHAKA = [ARTIFACTS.external, ARTIFACTS.externalMin, ARTIFACTS.esm]

function readArtifact(name) {
  return fs.readFileSync(path.join(DIST, name), 'utf8')
}

function loadArtifact(name) {
  jest.resetModules()
  return require(path.join(DIST, name))
}

function resolvePlayback(DashShakaPlayback) {
  return DashShakaPlayback.default || DashShakaPlayback
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

  jest.spyOn(shaka.polyfill, 'installAll').mockImplementation(() => {})
  jest.spyOn(shaka.Player, 'isBrowserSupported').mockReturnValue(true)
  jest.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {})

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
}

const EXPECTED_SOURCEMAPS = Object.values(ARTIFACTS)
  .map(filename => `${filename}.map`)
  .sort()

afterEach(() => {
  jest.restoreAllMocks()
})

describe.each([
  ['main UMD', ARTIFACTS.main],
  ['main UMD minified', ARTIFACTS.mainMin],
  ['external UMD', ARTIFACTS.external],
  ['external UMD minified', ARTIFACTS.externalMin],
  ['ESM', ARTIFACTS.esm]
])('%s (%s)', (_label, filename) => {
  test('exports a DashShakaPlayback class that extends HTML5Video and exposes shaka', () => {
    assertPlaybackContract(loadArtifact(filename))
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

describe('shaka-player peer identity', () => {
  test.each(EXTERNAL_SHAKA)('%s defers to the consumer shaka-player', filename => {
    const Playback = resolvePlayback(loadArtifact(filename))
    expect(Playback.shakaPlayer).toBe(require('shaka-player'))
  })

  test.each(EMBEDS_SHAKA)('%s embeds its own shaka-player copy', filename => {
    const Playback = resolvePlayback(loadArtifact(filename))
    expect(Playback.shakaPlayer).not.toBe(require('shaka-player'))
  })
})

describe('package exports', () => {
  test('resolves the deep dist path used by bundler consumers', () => {
    expect(require.resolve('dash-shaka-playback/dist/dash-shaka-playback.external.js')).toBe(
      path.join(DIST, ARTIFACTS.external)
    )
  })
})
