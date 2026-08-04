/**
 * Smoke-tests the published dist/ artifacts. Core Jest maps @clappr/core to
 * source, so without this the Rollup entry points have no CI signal.
 */
const fs = require('fs')
const path = require('path')

const DIST = path.join(__dirname, '..', 'dist')

const ARTIFACTS = {
  main: 'hlsjs-playback.js',
  mainMin: 'hlsjs-playback.min.js',
  external: 'hlsjs-playback.external.js',
  externalMin: 'hlsjs-playback.external.min.js',
  esm: 'hlsjs-playback.esm.js'
}

const EMBEDS_HLS = [ARTIFACTS.main, ARTIFACTS.mainMin, ARTIFACTS.esm]
const EXTERNAL_HLS = [ARTIFACTS.external, ARTIFACTS.externalMin]

function readArtifact(name) {
  return fs.readFileSync(path.join(DIST, name), 'utf8')
}

function loadArtifact(name) {
  jest.resetModules()
  return require(path.join(DIST, name))
}

function resolvePlayback(HlsjsPlaybackExport) {
  return HlsjsPlaybackExport.default || HlsjsPlaybackExport
}

function assertPlaybackContract(HlsjsPlaybackExport) {
  // Must re-require after resetModules so the prototype identity matches the
  // @clappr/core instance the artifact just resolved.
  const { HTML5Video } = require('@clappr/core')
  const Playback = resolvePlayback(HlsjsPlaybackExport)

  expect(typeof Playback).toBe('function')
  expect(Object.getPrototypeOf(Playback.prototype)).toBe(HTML5Video.prototype)

  const HLSJS = Playback.HLSJS
  expect(HLSJS).toBeTruthy()
  expect(typeof HLSJS.isSupported).toBe('function')
  expect(HLSJS.Events).toBeTruthy()
  expect(typeof HLSJS.version).toBe('string')
  expect(HLSJS.version.length).toBeGreaterThan(0)

  jest.spyOn(HLSJS, 'isSupported').mockReturnValue(true)
  jest.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {})

  expect(Playback.canPlay('http://example.com/video.m3u8')).toBe(true)
  expect(Playback.canPlay('http://example.com/video.m3u8?token=1')).toBe(true)
  expect(Playback.canPlay('http://example.com/video.mpd')).toBe(false)

  const playback = new Playback({ src: 'http://example.com/video.m3u8' })
  playback.destroy()
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
  test('exports a HlsjsPlayback class that extends HTML5Video and exposes HLSJS', () => {
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

describe('hls.js peer identity', () => {
  test.each(EXTERNAL_HLS)('%s defers to the consumer hls.js', filename => {
    const Playback = resolvePlayback(loadArtifact(filename))
    expect(Playback.HLSJS).toBe(require('hls.js'))
  })

  test.each(EMBEDS_HLS)('%s embeds its own hls.js copy', filename => {
    const Playback = resolvePlayback(loadArtifact(filename))
    expect(Playback.HLSJS).not.toBe(require('hls.js'))
  })
})
