import { defineConfig, defaultExclude } from 'vitest/config'
import { clapprSiblingSourceAlias } from './vite.config.base.mjs'

const SMOKE_GLOB = '**/dist.smoke.test.js'

function isSmokeRun() {
  return process.argv.some(arg => /dist\.smoke\.test/.test(arg))
}

export function defineClapprVitest(options = {}) {
  const smoke = options.smoke === true || isSmokeRun()
  const alias = {
    ...clapprSiblingSourceAlias(),
    ...(options.alias || {})
  }
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
