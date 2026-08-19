/**
 * Ensures the Rollup artifact is loadable. Core jest/rollup alias to src/,
 * so without this the dist/ entry points have no CI signal.
 */
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
