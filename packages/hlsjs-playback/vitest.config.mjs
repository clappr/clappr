import { createRequire } from 'node:module'
import { viteDefine } from '../../vite.config.base.mjs'
import { defineClapprVitest } from '../../vitest.config.base.mjs'

const require = createRequire(import.meta.url)
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

export const coverageThresholds = {
  statements: 79,
  branches: 74,
  functions: 63,
  lines: 81
}

export default defineClapprVitest({
  define: viteDefine({
    VERSION: clapprCoreVersion,
    CLAPPR_CORE_VERSION: clapprCoreVersion
  }),
  coverageInclude: ['src/hls.js'],
  coverageThresholds
})
