import { createRequire } from 'node:module'
import { viteDefine } from '../../vite.config.base.mjs'
import { defineClapprVitest } from '../../vitest.config.base.mjs'

const require = createRequire(import.meta.url)
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

export const coverageThresholds = {
  statements: 90,
  branches: 90,
  functions: 90,
  lines: 90
}

export default defineClapprVitest({
  define: viteDefine({ VERSION: clapprCoreVersion }),
  coverageInclude: ['src/**/*.js'],
  coverageThresholds
})
