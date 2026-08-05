/**
 * Smoke-tests the published dist/ artifacts. The player bundle embeds core,
 * plugins and playbacks, so identity checks are against the same module.
 */
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const DIST = path.join(__dirname, '..', 'dist')
const pkg = require('../package.json')

const ARTIFACTS = {
  main: 'clappr.js',
  mainMin: 'clappr.min.js',
  plainhtml5: 'clappr.plainhtml5.js',
  plainhtml5Min: 'clappr.plainhtml5.min.js'
}

const FULL_PLAYER = [ARTIFACTS.main, ARTIFACTS.mainMin]
const PLAINHTML5 = [ARTIFACTS.plainhtml5, ARTIFACTS.plainhtml5Min]
const UMD_ARTIFACTS = Object.values(ARTIFACTS)

// Demo-only unminified entry: no map per AGENTS.md sourcemap policy.
const EXPECTED_SOURCEMAPS = [
  'clappr.js.map',
  'clappr.min.js.map',
  'clappr.plainhtml5.min.js.map'
].sort()

function readArtifact(name) {
  return fs.readFileSync(path.join(DIST, name), 'utf8')
}

function loadArtifact(name) {
  jest.resetModules()
  return require(path.join(DIST, name))
}

function resolveClappr(mod) {
  return mod.default || mod
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

function prototypeChainContains(pluginProto, baseProto) {
  let proto = pluginProto
  while (proto) {
    if (proto === baseProto) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

function assertSharedBundleContract(C) {
  expect(C.version).toBe(pkg.version)

  const bases = [
    C.ContainerPlugin.prototype,
    C.CorePlugin.prototype,
    C.UIContainerPlugin.prototype,
    C.UICorePlugin.prototype
  ]

  for (const Plugin of Object.values(C.Plugins)) {
    expect(typeof Plugin).toBe('function')
    const matchesBase = bases.some(base =>
      prototypeChainContains(Object.getPrototypeOf(Plugin.prototype), base)
    )
    expect(matchesBase).toBe(true)
  }
}

function assertSourceMappingURL(filename) {
  expect(readArtifact(filename)).toContain(`sourceMappingURL=${filename}.map`)
}

describe.each([
  ['main UMD', ARTIFACTS.main],
  ['main UMD minified', ARTIFACTS.mainMin],
  ['plainhtml5 UMD', ARTIFACTS.plainhtml5],
  ['plainhtml5 UMD minified', ARTIFACTS.plainhtml5Min]
])('%s (%s)', (_label, filename) => {
  test('exports plugins that extend the same-bundle plugin bases', () => {
    assertSharedBundleContract(resolveClappr(loadArtifact(filename)))
  })
})

describe('full player HLS', () => {
  test.each(FULL_PLAYER)('%s HLS extends HTML5Video', filename => {
    const C = resolveClappr(loadArtifact(filename))
    expect(Object.getPrototypeOf(C.HLS.prototype)).toBe(C.HTML5Video.prototype)
  })
})

describe('plainhtml5 bundle', () => {
  test.each(PLAINHTML5)('%s has no HLS', filename => {
    const C = resolveClappr(loadArtifact(filename))
    expect(C.HLS).toBeUndefined()
  })
})

describe('UMD global and AMD branches', () => {
  test.each(UMD_ARTIFACTS)('%s sets global Clappr without an AMD loader', filename => {
    const { sandbox } = loadUmdInSandbox(filename, { amd: false })
    expect(typeof sandbox.Clappr).toBe('object')
    expect(typeof sandbox.Clappr.Player).toBe('function')
  })

  test.each(UMD_ARTIFACTS)('%s does not set global Clappr when define.amd is present', filename => {
    const { sandbox, amdExports } = loadUmdInSandbox(filename, { amd: true })
    expect(sandbox.Clappr).toBeUndefined()
    expect(typeof amdExports.Player).toBe('function')
  })
})

describe('sourcemap comments', () => {
  test.each([ARTIFACTS.main, ARTIFACTS.mainMin, ARTIFACTS.plainhtml5Min])(
    '%s publishes a sourcemap comment',
    filename => {
      assertSourceMappingURL(filename)
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
