import PlaybackStateSampler from './playback_state_sampler'

const makeVideoEl = (overrides = {}) => ({
  networkState: 2,
  paused: false,
  playbackRate: 1,
  currentTime: 10,
  ...overrides
})

const makePlayback = (videoEl) => ({ el: videoEl })

describe('PlaybackStateSampler', () => {
  let sampler, playback

  beforeEach(() => {
    playback = makePlayback(makeVideoEl())
    sampler = new PlaybackStateSampler(playback)
  })

  describe('isEnabled()', () => {
    it('returns false by default', () => {
      expect(PlaybackStateSampler.isEnabled({})).toBe(false)
    })

    it('returns true when playbackStateSample.enabled is true', () => {
      expect(PlaybackStateSampler.isEnabled({ playbackStateSample: { enabled: true } })).toBe(true)
    })

    it('returns false when playbackStateSample.enabled is false', () => {
      expect(PlaybackStateSampler.isEnabled({ playbackStateSample: { enabled: false } })).toBe(false)
    })

    it('returns false when cfg is null', () => {
      expect(PlaybackStateSampler.isEnabled(null)).toBe(false)
    })
  })

  describe('collect()', () => {
    it('returns networkState, paused, playbackRate and currentTime', () => {
      expect(sampler.collect()).toEqual({
        networkState: 2,
        paused: false,
        playbackRate: 1,
        currentTime: 10
      })
    })

    it('rounds currentTime to 1 decimal', () => {
      const p = makePlayback(makeVideoEl({ currentTime: 10.456 }))
      const s = new PlaybackStateSampler(p)
      expect(s.collect().currentTime).toBe(10.5)
    })

    it('returns null when videoEl is null', () => {
      const s = new PlaybackStateSampler({ el: null })
      expect(s.collect()).toBeNull()
    })

    it('returns null when playback is null', () => {
      const s = new PlaybackStateSampler(null)
      expect(s.collect()).toBeNull()
    })

    it('reflects paused: true', () => {
      const p = makePlayback(makeVideoEl({ paused: true }))
      const s = new PlaybackStateSampler(p)
      expect(s.collect().paused).toBe(true)
    })

    it('reflects custom playbackRate', () => {
      const p = makePlayback(makeVideoEl({ playbackRate: 1.5 }))
      const s = new PlaybackStateSampler(p)
      expect(s.collect().playbackRate).toBe(1.5)
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
