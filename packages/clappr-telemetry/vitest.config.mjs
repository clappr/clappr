import { createRequire } from 'node:module'
import { viteDefine } from '../../vite.config.base.mjs'
import { defineClapprVitest } from '../../vitest.config.base.mjs'

const require = createRequire(import.meta.url)
const { version: clapprCoreVersion } = require('@clappr/core/package.json')

export default defineClapprVitest({
  define: viteDefine({ VERSION: clapprCoreVersion })
})
