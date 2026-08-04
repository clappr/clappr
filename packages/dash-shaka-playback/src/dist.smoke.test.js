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
  esm: 'dash-shaka-playback.esm.js'
}

function readArtifact(name) {
  return fs.readFileSync(path.join(DIST, name), 'utf8')
}

function loadArtifact(name) {
  jest.resetModules()
  return require(path.join(DIST, name))
}

function assertPlaybackContract(DashShakaPlayback) {
  // Must re-require after resetModules so the prototype identity matches the
  // @clappr/core instance the artifact just resolved.
  const { HTML5Video } = require('@clappr/core')
  const Playback = DashShakaPlayback.default || DashShakaPlayback

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

  const playback = new Playback({ src: 'http://example.com/video.mpd' })
  expect(playback.shakaVersion).toBe(shaka.Player.version)
  expect(Playback.Events.SHAKA_READY).toBe('shaka:ready')

  jest.spyOn(shaka.polyfill, 'installAll').mockImplementation(() => {})
  jest.spyOn(shaka.Player, 'isBrowserSupported').mockReturnValue(true)

  expect(Playback.canPlay('http://example.com/video.mpd')).toBe(true)
  expect(Playback.canPlay('http://example.com/video.mpd?token=1')).toBe(true)
  expect(Playback.canPlay('http://example.com/video.m3u8')).toBe(false)
  expect(Playback.canPlay('http://example.com/video', 'application/dash+xml')).toBe(true)
}

function assertDoesNotEmbedCore(source) {
  // Same failure mode as hlsjs-playback.min.js shipping a full Clappr + Zepto copy.
  expect(source).not.toMatch(/\bZepto\b/)
  expect(source).not.toContain('clappr-core')
  expect(source).not.toContain('@clappr/zepto')
}

function assertDoesNotEmbedShaka(source) {
  // Closure-compiled shaka leaves these markers when bundled via commonjs.
  expect(source).not.toContain('shakaPlayer_compiled')
  expect(source).not.toContain('ManifestParser')
  expect(source.length).toBeLessThan(50000)
}

function assertSourceMap(filename) {
  const mapName = `${filename}.map`
  expect(fs.existsSync(path.join(DIST, mapName))).toBe(true)
  expect(readArtifact(filename)).toContain(`sourceMappingURL=${mapName}`)
}

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

  test('does not embed @clappr/core or Zepto', () => {
    assertDoesNotEmbedCore(readArtifact(filename))
  })

  test('publishes a sourcemap', () => {
    assertSourceMap(filename)
  })
})

describe('external and ESM builds', () => {
  test.each([
    [ARTIFACTS.external],
    [ARTIFACTS.externalMin],
    [ARTIFACTS.esm]
  ])('%s does not embed the shaka-player blob', (filename) => {
    assertDoesNotEmbedShaka(readArtifact(filename))
  })
})

describe('package exports', () => {
  test('resolves the deep dist path used by bundler consumers', () => {
    expect(
      require.resolve('dash-shaka-playback/dist/dash-shaka-playback.external.js')
    ).toBe(path.join(DIST, ARTIFACTS.external))
  })
})
