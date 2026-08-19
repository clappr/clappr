import DecodingSampler from './decoding_sampler'

const makeQuality = ({ totalVideoFrames = 0, droppedVideoFrames = 0 } = {}) => ({
  totalVideoFrames,
  droppedVideoFrames
})

const makeVideoEl = ({ currentTime = 5, quality = makeQuality() } = {}) => ({
  currentTime,
  getVideoPlaybackQuality: () => quality
})

const makePlayback = videoEl => ({ el: videoEl })

describe('DecodingSampler', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes a static name used as payload key', () => {
    expect(DecodingSampler.name).toBe('decoding')
  })

  describe('collect()', () => {
    it('returns data on the first call — seed happens in constructor', () => {
      vi
        .spyOn(performance, 'now')
        .mockReturnValueOnce(0) // constructor _seed()
        .mockReturnValueOnce(1000) // collect()
      const sampler = new DecodingSampler(makePlayback(makeVideoEl()))
      expect(sampler.collect()).not.toBeNull()
    })

    it('computes correct fps and dropRatio', () => {
      vi
        .spyOn(performance, 'now')
        .mockReturnValueOnce(0) // constructor _seed()
        .mockReturnValueOnce(1000) // collect()

      const el = {
        currentTime: 5,
        getVideoPlaybackQuality: vi
          .fn()
          .mockReturnValueOnce(makeQuality({ totalVideoFrames: 0, droppedVideoFrames: 0 })) // constructor
          .mockReturnValueOnce(makeQuality({ totalVideoFrames: 24, droppedVideoFrames: 6 })) // collect
      }

      const result = new DecodingSampler({ el }).collect()

      expect(result.decodedFps).toBeCloseTo(24)
      expect(result.droppedFps).toBeCloseTo(6)
      expect(result.dropRatio).toBeCloseTo(6 / 30)
      expect(result.totalDecoded).toBe(24)
      expect(result.totalDropped).toBe(6)
    })

    it('returns dropRatio of 0 when no frames were processed', () => {
      vi.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(1000)

      const el = {
        currentTime: 0,
        getVideoPlaybackQuality: vi
          .fn()
          .mockReturnValueOnce(makeQuality()) // constructor
          .mockReturnValueOnce(makeQuality()) // collect
      }

      expect(new DecodingSampler({ el }).collect().dropRatio).toBe(0)
    })

    it('returns null when elapsed time is zero (timer precision edge case)', () => {
      vi.spyOn(performance, 'now').mockReturnValue(0)
      const el = { currentTime: 0, getVideoPlaybackQuality: vi.fn().mockReturnValue(makeQuality()) }
      const sampler = new DecodingSampler({ el })
      expect(sampler.collect()).toBeNull()
    })

    it('returns null when videoEl is null', () => {
      expect(new DecodingSampler({ el: null }).collect()).toBeNull()
    })

    it('returns null when getVideoPlaybackQuality is not available', () => {
      expect(new DecodingSampler({ el: { currentTime: 0 } }).collect()).toBeNull()
    })

    it('returns null when playback is null', () => {
      expect(new DecodingSampler(null).collect()).toBeNull()
    })

    it('returns null and re-seeds when droppedVideoFrames delta exceeds totalVideoFrames delta', () => {
      vi
        .spyOn(performance, 'now')
        .mockReturnValueOnce(0)// constructor _seed()
        .mockReturnValueOnce(1000) // collect()
        .mockReturnValueOnce(2000) // _seed() re-baseline

      const el = {
        currentTime: 5,
        getVideoPlaybackQuality: vi
          .fn()
          .mockReturnValueOnce(makeQuality({ totalVideoFrames: 100, droppedVideoFrames: 10 })) // constructor
          .mockReturnValueOnce(makeQuality({ totalVideoFrames: 105, droppedVideoFrames: 0 })) // collect — dropped reset
          .mockReturnValueOnce(makeQuality({ totalVideoFrames: 105, droppedVideoFrames: 0 })) // _seed()
      }

      const sampler = new DecodingSampler({ el })
      expect(sampler.collect()).toBeNull()
    })

    it('returns null and re-seeds when counters reset (source change)', () => {
      vi
        .spyOn(performance, 'now')
        .mockReturnValueOnce(0) // constructor _seed()
        .mockReturnValueOnce(1000) // collect()
        .mockReturnValueOnce(2000) // _seed() inside collect after reset

      const el = {
        currentTime: 5,
        getVideoPlaybackQuality: vi
          .fn()
          .mockReturnValueOnce(makeQuality({ totalVideoFrames: 100, droppedVideoFrames: 2 })) // constructor
          .mockReturnValueOnce(makeQuality({ totalVideoFrames: 10, droppedVideoFrames: 0 })) // collect — counters reset
          .mockReturnValueOnce(makeQuality({ totalVideoFrames: 10, droppedVideoFrames: 0 })) // _seed() re-baseline
      }

      const sampler = new DecodingSampler({ el })
      expect(sampler.collect()).toBeNull()
    })

    it('returns null on first collect() when element was unavailable at construction', () => {
      vi.spyOn(performance, 'now').mockReturnValue(1000)
      const playback = { el: { currentTime: 0 } } // no getVideoPlaybackQuality at construction
      const s = new DecodingSampler(playback)
      playback.el.getVideoPlaybackQuality = () => makeQuality() // becomes available later
      expect(s.collect()).toBeNull() // fallback seed, returns null
    })
  })

  describe('destroy()', () => {
    it('collect() returns null after destroy', () => {
      vi.spyOn(performance, 'now').mockReturnValue(0)
      const sampler = new DecodingSampler(makePlayback(makeVideoEl()))
      sampler.destroy()
      expect(sampler.collect()).toBeNull()
    })

    it('is safe to call multiple times', () => {
      vi.spyOn(performance, 'now').mockReturnValue(0)
      const sampler = new DecodingSampler(makePlayback(makeVideoEl()))
      expect(() => {
        sampler.destroy()
        sampler.destroy()
      }).not.toThrow()
    })
  })
})
