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

function assertPlaybackContract(HlsjsPlaybackExport) {
  // Must re-require after resetModules so the prototype identity matches the
  // @clappr/core instance the artifact just resolved.
  const { HTML5Video } = require('@clappr/core')
  const Playback = HlsjsPlaybackExport.default || HlsjsPlaybackExport

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
  try {
    expect(playback).toBeInstanceOf(Playback)
  } finally {
    playback.destroy()
  }
}

function assertDoesNotEmbedCore(source) {
  // Same failure mode as the pre-fix hlsjs-playback.min.js shipping a full
  // Clappr + Zepto copy (#2534).
  expect(source).not.toMatch(/\bZepto\b/)
  expect(source).not.toContain('clappr-core')
  expect(source).not.toContain('@clappr/zepto')
}

function assertDoesNotEmbedHls(source) {
  // External UMD builds must keep the hls.js require/AMD dependency.
  expect(source).toMatch(/['"]hls\.js['"]/)
  // External builds are ~14–31 KB; 100 KB leaves headroom without matching the
  // ~500 KB+ hls.js-embedded family.
  expect(source.length).toBeLessThan(100000)
}

function assertEmbedsHls(source) {
  // Positive lock: when the default artifacts stop embedding hls.js (#2538),
  // this must be updated deliberately — not by a silent layout flip.
  expect(source).not.toMatch(/require\(['"]hls\.js['"]\)/)
  expect(source.length).toBeGreaterThan(100000)
}

function assertSourceMap(filename) {
  const mapName = `${filename}.map`
  expect(fs.existsSync(path.join(DIST, mapName))).toBe(true)
  expect(readArtifact(filename)).toContain(`sourceMappingURL=${mapName}`)
}

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

  test('does not embed @clappr/core or Zepto', () => {
    assertDoesNotEmbedCore(readArtifact(filename))
  })

  test('publishes a sourcemap', () => {
    assertSourceMap(filename)
  })
})

describe('hls.js embedding contract', () => {
  test.each(EXTERNAL_HLS.map(name => [name]))('%s does not embed hls.js', filename => {
    assertDoesNotEmbedHls(readArtifact(filename))
  })

  test.each(EMBEDS_HLS.map(name => [name]))('%s embeds hls.js', filename => {
    assertEmbedsHls(readArtifact(filename))
  })
})
