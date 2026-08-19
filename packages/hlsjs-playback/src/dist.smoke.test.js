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
const { expectEs5Syntax } = require('../../../test/dist-contract')

const DIST = path.join(__dirname, '..', 'dist')

const ARTIFACTS = {
  main: 'hlsjs-playback.js',
  mainMin: 'hlsjs-playback.min.js',
  esm: 'hlsjs-playback.esm.js'
}

const UMD_ARTIFACTS = [ARTIFACTS.main, ARTIFACTS.mainMin]

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

function loadUmdInSandbox(filename, { hls } = {}) {
  const code = readArtifact(filename)
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
    runScripts: 'outside-only'
  })
  const sandbox = dom.getInternalVMContext()
  sandbox.Clappr = require('@clappr/core')
  if (hls !== undefined) sandbox.Hls = hls

  vm.runInContext(code, sandbox, { filename: path.join(DIST, filename) })
  return sandbox
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
  ['ESM', ARTIFACTS.esm]
])('%s (%s)', (_label, filename) => {
  test('exports a HlsjsPlayback class that extends HTML5Video and exposes HLSJS', () => {
    assertPlaybackContract(loadArtifact(filename))
  })

  test('publishes a sourcemap comment', () => {
    assertSourceMappingURL(filename)
  })

  test('does not emit native class syntax', () => {
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

describe('hls.js peer identity', () => {
  test.each(Object.values(ARTIFACTS))('%s defers to the consumer hls.js', filename => {
    const Playback = resolvePlayback(loadArtifact(filename))
    expect(Playback.HLSJS).toBe(require('hls.js'))
  })
})

describe('UMD global.Hls branch', () => {
  test.each(UMD_ARTIFACTS)('%s resolves HLSJS from window.Hls', filename => {
    const hls = require('hls.js')
    const sandbox = loadUmdInSandbox(filename, { hls })
    expect(sandbox.HlsjsPlayback.HLSJS).toBe(hls)
  })

  test.each(UMD_ARTIFACTS)('%s throws a clear error when window.Hls is missing', filename => {
    expect(() => loadUmdInSandbox(filename)).toThrow(
      '@clappr/hlsjs-playback requires hls.js (^1) to be loaded before it'
    )
  })
})
