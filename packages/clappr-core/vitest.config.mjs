import { resolve } from 'node:path'
import { createRequire } from 'node:module'
import { clapprResolveAlias, viteDefine } from '../../vite.config.base.mjs'
import { defineClapprVitest } from '../../vitest.config.base.mjs'

const require = createRequire(import.meta.url)
const { version } = require('./package.json')

export default defineClapprVitest({
  alias: clapprResolveAlias({
    '@': resolve(process.cwd(), 'src')
  }),
  define: viteDefine({ VERSION: version })
})
