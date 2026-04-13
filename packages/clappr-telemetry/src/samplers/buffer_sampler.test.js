import BufferSampler from './buffer_sampler'
import { makeBuffered } from '../__fixtures__'

const makeVideoEl = ({ currentTime = 10, ranges = [[0, 30]] } = {}) => ({
  currentTime,
  buffered: makeBuffered(ranges)
})

const makePlayback = (videoEl) => ({ el: videoEl })

const makeContainer = (cfg = {}) => ({
  options: { telemetry: { bufferSample: cfg } }
})

describe('BufferSampler', () => {
  let sampler
  let container
  let playback

  beforeEach(() => {
    container = makeContainer()
    playback = makePlayback(makeVideoEl())
    sampler = new BufferSampler(playback, container)
  })

  describe('isEnabled()', () => {
    it('returns false by default', () => {
      expect(BufferSampler.isEnabled({})).toBe(false)
    })

    it('returns true when bufferSample.enabled is true', () => {
      expect(BufferSampler.isEnabled({ bufferSample: { enabled: true } })).toBe(true)
    })

    it('returns false when bufferSample.enabled is false', () => {
      expect(BufferSampler.isEnabled({ bufferSample: { enabled: false } })).toBe(false)
    })

    it('returns false when cfg is null', () => {
      expect(BufferSampler.isEnabled(null)).toBe(false)
    })
  })

  describe('collect()', () => {
    it('returns bufferAhead and currentTime', () => {
      const result = sampler.collect()
      expect(result).toEqual(expect.objectContaining({ bufferAhead: 20, currentTime: 10 }))
    })

    it('includes rangesCompact by default', () => {
      const result = sampler.collect()
      expect(result.rangesCompact).toEqual([[0, 30]])
    })

    it('omits rangesCompact when includeRanges is false', () => {
      const c = makeContainer({ includeRanges: false })
      const s = new BufferSampler(makePlayback(makeVideoEl()), c)
      const result = s.collect()
      expect(result).not.toHaveProperty('rangesCompact')
    })

    it('returns null when videoEl is null', () => {
      sampler = new BufferSampler({ el: null }, container)
      expect(sampler.collect()).toBeNull()
    })

    it('returns null when playback is null', () => {
      sampler = new BufferSampler(null, container)
      expect(sampler.collect()).toBeNull()
    })

    it('returns bufferAhead 0 when currentTime is in a gap between ranges', () => {
      sampler = new BufferSampler(makePlayback(makeVideoEl({ currentTime: 15, ranges: [[0, 10], [20, 30]] })), container)
      expect(sampler.collect().bufferAhead).toBe(0)
    })

    it('returns null when currentTime is NaN', () => {
      sampler = new BufferSampler(makePlayback(makeVideoEl({ currentTime: NaN })), container)
      expect(sampler.collect()).toBeNull()
    })

    it('returns null when currentTime is Infinity', () => {
      sampler = new BufferSampler(makePlayback(makeVideoEl({ currentTime: Infinity })), container)
      expect(sampler.collect()).toBeNull()
    })
  })

  describe('destroy()', () => {
    it('collect() returns null after destroy', () => {
      sampler.destroy()
      expect(sampler.collect()).toBeNull()
    })

    it('is safe to call multiple times', () => {
      expect(() => {
        sampler.destroy()
        sampler.destroy()
      }).not.toThrow()
    })
  })
})
