/**
 * Ensures published dist/ artifacts are loadable. Unit tests resolve source,
 * so without this the Vite entry points have no CI signal.
 */
const fs = require('fs')
const path = require('path')
const { expectEs5Syntax } = require('../../../test/dist-contract')

const DIST = path.join(__dirname, '..', 'dist')

const ARTIFACTS = {
  umd: 'clappr-zepto.js',
  esm: 'clappr-zepto.esm.js'
}

function readArtifact(name) {
  return fs.readFileSync(path.join(DIST, name), 'utf8')
}

describe('dist/clappr-zepto.js', () => {
  test('UMD build exports Zepto and sets window globals', () => {
    vi.resetModules()
    delete window.Zepto
    delete window.$

    const Zepto = require('../dist/clappr-zepto.js')

    expect(typeof Zepto).toBe('function')
    expect(window.Zepto).toBe(Zepto)
    expect(window.$).toBe(Zepto)
    expect(Zepto('<div/>').length).toBe(1)
  })
})

describe.each([
  ['UMD', ARTIFACTS.umd],
  ['ESM', ARTIFACTS.esm]
])('%s (%s)', (_label, filename) => {
  test('rejects post-ES5 syntax', () => {
    expectEs5Syntax(readArtifact(filename), filename)
  })
})
