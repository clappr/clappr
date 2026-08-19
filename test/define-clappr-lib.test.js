import { mkdtempSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { defineClapprLib } from '../vite.config.base.mjs'

const MISSING_ENTRY = 'src/this-file-does-not-exist.js'

const missingEntrySpec = {
  name: 'MissingEntry',
  entry: MISSING_ENTRY,
  fileName: {
    umd: 'missing-entry.js',
    es: 'missing-entry.esm.js',
    min: 'missing-entry.min.js'
  }
}

describe('defineClapprLib missing entry', () => {
  it('throws without writing dist when the returned config function runs', () => {
    const previousCwd = process.cwd()
    const tmpCwd = mkdtempSync(join(tmpdir(), 'clappr-lib-'))
    process.chdir(tmpCwd)
    try {
      expect(() => defineClapprLib(missingEntrySpec)({ mode: 'production' })).toThrow(
        /missing entry/
      )
      expect(readdirSync(tmpCwd)).not.toContain('dist')
    } finally {
      process.chdir(previousCwd)
    }
  })
})
