import { defineConfig, defaultExclude } from 'vitest/config'
import { clapprResolveAlias, clapprSiblingSourceAlias } from './vite.config.base.mjs'

const SMOKE_GLOB = '**/dist.smoke.test.js'

function isSmokeRun() {
  return process.argv.some(arg => /dist\.smoke\.test/.test(arg))
}

/**
 * @param {object} [options]
 * @param {Record<string, string>} [options.alias]
 * @param {Record<string, string>} [options.define]
 * @param {string[]} [options.exclude]
 * @param {string[]} [options.coverageInclude]
 * @param {string[]} [options.coverageExclude]
 * @param {Record<string, number>} [options.coverageThresholds]
 * @param {boolean} [options.smoke]
 */
export function defineClapprVitest(options = {}) {
  const smoke = options.smoke === true || isSmokeRun()
  const alias = clapprResolveAlias({
    ...clapprSiblingSourceAlias(),
    ...(options.alias || {})
  })
  const coverage = {
    provider: 'v8'
  }
  if (options.coverageInclude) coverage.include = options.coverageInclude
  if (options.coverageExclude) coverage.exclude = options.coverageExclude
  if (options.coverageThresholds) coverage.thresholds = options.coverageThresholds

  const test = {
    environment: 'jsdom',
    globals: true,
    exclude: smoke
      ? [...defaultExclude]
      : [...defaultExclude, SMOKE_GLOB, ...(options.exclude || [])],
    coverage
  }
  if (smoke) test.include = [SMOKE_GLOB]

  return defineConfig({
    define: options.define,
    resolve: { alias },
    test
  })
}

export default defineClapprVitest()
