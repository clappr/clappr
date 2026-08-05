/**
 * Smoke-tests the published dist/ artifacts. Unit tests resolve source
 * modules, so without this the Rollup entry points have no CI signal.
 */
const fs = require('fs')
const path = require('path')
const vm = require('vm')

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

function namedExportKeys(mod) {
  return Object.keys(mod)
    .filter(key => key !== 'default' && key !== '__esModule')
    .sort()
}

function createBrowserSandbox() {
  const element = () => ({
    style: {},
    classList: {
      add() {},
      remove() {},
      contains() {
        return false
      }
    },
    setAttribute() {},
    getAttribute() {
      return null
    },
    removeAttribute() {},
    appendChild(child) {
      return child
    },
    removeChild(child) {
      return child
    },
    insertBefore(child) {
      return child
    },
    addEventListener() {},
    removeEventListener() {},
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0 }),
    children: [],
    childNodes: [],
    parentNode: null,
    ownerDocument: null
  })

  const document = {
    documentElement: element(),
    head: element(),
    body: element(),
    createElement: () => element(),
    createElementNS: () => element(),
    createTextNode: text => ({ nodeValue: text }),
    createDocumentFragment: () => element(),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByTagName: () => [],
    addEventListener() {},
    removeEventListener() {},
    defaultView: null
  }
  document.documentElement.ownerDocument = document
  document.head.ownerDocument = document
  document.body.ownerDocument = document

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: cb => setTimeout(cb, 0),
    cancelAnimationFrame: clearTimeout,
    getComputedStyle: () => new Proxy({}, { get: () => '' }),
    matchMedia: () => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {}
    }),
    performance: { now: () => Date.now() },
    navigator: { userAgent: 'Jest', platform: 'node', language: 'en' },
    location: {
      href: 'http://localhost/',
      protocol: 'http:',
      hostname: 'localhost',
      pathname: '/'
    },
    document,
    HTMLElement: function HTMLElement() {},
    HTMLMediaElement: function HTMLMediaElement() {},
    HTMLVideoElement: function HTMLVideoElement() {},
    Node: function Node() {},
    Element: function Element() {},
    Event: function Event() {},
    CustomEvent: function CustomEvent() {},
    MutationObserver: function MutationObserver() {
      this.observe = () => {}
      this.disconnect = () => {}
    },
    addEventListener() {},
    removeEventListener() {}
  }

  sandbox.window = sandbox
  sandbox.self = sandbox
  sandbox.globalThis = sandbox
  document.defaultView = sandbox
  return sandbox
}

function loadUmdInSandbox(filename, { amd = false } = {}) {
  const code = readArtifact(filename)
  const sandbox = createBrowserSandbox()
  let amdExports

  if (amd) {
    sandbox.define = (depsOrFactory, maybeFactory) => {
      if (typeof depsOrFactory === 'function') {
        amdExports = depsOrFactory()
        return
      }
      const factory = maybeFactory
      const args = depsOrFactory.map(dep => {
        if (dep === 'exports') {
          amdExports = {}
          return amdExports
        }
        return undefined
      })
      factory(...args)
    }
    sandbox.define.amd = {}
  }

  vm.runInNewContext(code, sandbox, { filename: path.join(DIST, filename) })
  return { sandbox, amdExports }
}

function assertCoreContract(dist) {
  const src = require('../src/main.js')

  expect(Object.keys(dist.default).sort()).toEqual(Object.keys(src.default).sort())
  expect(namedExportKeys(dist)).toEqual(namedExportKeys(src))

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

describe('UMD global and AMD branches', () => {
  test.each([ARTIFACTS.main, ARTIFACTS.mainMin])(
    '%s sets global Clappr without an AMD loader',
    filename => {
      const { sandbox } = loadUmdInSandbox(filename, { amd: false })
      expect(typeof sandbox.Clappr).toBe('object')
      expect(typeof sandbox.Clappr.Player).toBe('function')
    }
  )

  test.each([ARTIFACTS.main, ARTIFACTS.mainMin])(
    '%s does not set global Clappr when define.amd is present',
    filename => {
      const { sandbox, amdExports } = loadUmdInSandbox(filename, { amd: true })
      expect(sandbox.Clappr).toBeUndefined()
      expect(typeof amdExports.Player).toBe('function')
    }
  )
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
