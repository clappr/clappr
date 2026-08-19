import { coverageThresholds as hlsjsCoverageThresholds } from '../packages/hlsjs-playback/vitest.config.mjs'
import { coverageThresholds as html5TvsCoverageThresholds } from '../packages/html5-tvs-playback/vitest.config.mjs'

describe('coverage thresholds', () => {
  it('pins hlsjs at 79/74/63/81', () => {
    expect(hlsjsCoverageThresholds).toEqual({
      statements: 79,
      branches: 74,
      functions: 63,
      lines: 81
    })
  })

  it('pins html5-tvs at 90 for statements, branches, functions, and lines', () => {
    expect(html5TvsCoverageThresholds).toEqual({
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90
    })
  })
})
