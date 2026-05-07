import PlaybackTimingSampler from './playback_timing_sampler'

const makeEl = () => {
  const listeners = {}
  return {
    addEventListener: jest.fn((event, handler) => { listeners[event] = handler }),
    removeEventListener: jest.fn((event, handler) => { if (listeners[event] === handler) delete listeners[event] }),
    _emit: (event) => listeners[event]?.()
  }
}

const makePlayback = (el) => ({ el })

describe('PlaybackTimingSampler', () => {
  let sampler
  let el

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(0)
    el = makeEl()
    sampler = new PlaybackTimingSampler(makePlayback(el), null)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('isEnabled()', () => {
    it('returns true when timingSample.enabled is true', () => {
      expect(PlaybackTimingSampler.isEnabled({ timingSample: { enabled: true } })).toBe(true)
    })

    it('returns false when timingSample.enabled is false', () => {
      expect(PlaybackTimingSampler.isEnabled({ timingSample: { enabled: false } })).toBe(false)
    })

    it('returns false when timingSample is absent', () => {
      expect(PlaybackTimingSampler.isEnabled({})).toBe(false)
    })

    it('returns false when cfg is null', () => {
      expect(PlaybackTimingSampler.isEnabled(null)).toBe(false)
    })
  })

  describe('constructor', () => {
    it('registers listeners for play, playing, waiting, pause and ended on el', () => {
      expect(el.addEventListener).toHaveBeenCalledWith('play', expect.any(Function), { passive: true })
      expect(el.addEventListener).toHaveBeenCalledWith('playing', expect.any(Function), { passive: true })
      expect(el.addEventListener).toHaveBeenCalledWith('waiting', expect.any(Function), { passive: true })
      expect(el.addEventListener).toHaveBeenCalledWith('pause', expect.any(Function), { passive: true })
      expect(el.addEventListener).toHaveBeenCalledWith('ended', expect.any(Function), { passive: true })
    })

    it('does not throw when playback has no el', () => {
      expect(() => new PlaybackTimingSampler({ el: null }, null)).not.toThrow()
      expect(() => new PlaybackTimingSampler(null, null)).not.toThrow()
    })
  })

  describe('playing', () => {
    it('accumulates timePlayingMs while playing', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(100)
      expect(sampler.collect().timePlayingMs).toBe(100)
    })

    it('records joinTimeMs as the interval between play and the first playing event', () => {
      jest.setSystemTime(100)
      el._emit('play')
      jest.setSystemTime(350)
      el._emit('playing')
      expect(sampler.collect().joinTimeMs).toBe(250)
    })

    it('joinTimeMs does not change on subsequent playing events', () => {
      jest.setSystemTime(100)
      el._emit('play')
      jest.setSystemTime(200)
      el._emit('playing')
      jest.setSystemTime(500)
      el._emit('waiting')
      el._emit('playing')
      expect(sampler.collect().joinTimeMs).toBe(100)
    })

    it('joinTimeMs is null if playing fires without a prior play event', () => {
      el._emit('playing')
      expect(sampler.collect().joinTimeMs).toBeNull()
    })

    it('joinTimeMs is null before any event', () => {
      expect(sampler.collect().joinTimeMs).toBeNull()
    })
  })

  describe('waiting while playing', () => {
    it('accumulates timeWaitingMs', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(100)
      el._emit('waiting')
      jest.advanceTimersByTime(50)
      expect(sampler.collect().timeWaitingMs).toBe(50)
    })

    it('stops accumulating timePlayingMs during waiting', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(100)
      el._emit('waiting')
      jest.advanceTimersByTime(50)
      expect(sampler.collect().timePlayingMs).toBe(100)
    })
  })

  describe('full sequence', () => {
    it('idle → playing(100ms) → waiting(50ms) → playing(200ms)', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(100)
      el._emit('waiting')
      jest.advanceTimersByTime(50)
      el._emit('playing')
      jest.advanceTimersByTime(200)

      const result = sampler.collect()
      expect(result.timePlayingMs).toBe(300)
      expect(result.timeWaitingMs).toBe(50)
    })
  })

  describe('collect() live', () => {
    it('includes current state time without requiring a new event', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(150)
      expect(sampler.collect().timePlayingMs).toBe(150)
      jest.advanceTimersByTime(50)
      expect(sampler.collect().timePlayingMs).toBe(200)
    })

    it('returns null after destroy', () => {
      sampler.destroy()
      expect(sampler.collect()).toBeNull()
    })
  })

  describe('pause', () => {
    it('stops accumulating timePlayingMs on pause', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(100)
      el._emit('pause')
      jest.advanceTimersByTime(200)
      expect(sampler.collect().timePlayingMs).toBe(100)
    })

    it('does not accumulate timeWaitingMs during pause', () => {
      el._emit('play')
      el._emit('playing')
      el._emit('pause')
      jest.advanceTimersByTime(200)
      expect(sampler.collect().timeWaitingMs).toBe(0)
    })

    it('resumes counting after playing event following pause', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(100)
      el._emit('pause')
      jest.advanceTimersByTime(200)
      el._emit('playing')
      jest.advanceTimersByTime(50)
      expect(sampler.collect().timePlayingMs).toBe(150)
    })
  })

  describe('ended', () => {
    it('stops accumulating timePlayingMs on ended', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(100)
      el._emit('ended')
      jest.advanceTimersByTime(200)
      expect(sampler.collect().timePlayingMs).toBe(100)
    })
  })

  describe('destroy()', () => {
    it('removes all five listeners from el', () => {
      sampler.destroy()
      expect(el.removeEventListener).toHaveBeenCalledWith('play', expect.any(Function))
      expect(el.removeEventListener).toHaveBeenCalledWith('playing', expect.any(Function))
      expect(el.removeEventListener).toHaveBeenCalledWith('waiting', expect.any(Function))
      expect(el.removeEventListener).toHaveBeenCalledWith('pause', expect.any(Function))
      expect(el.removeEventListener).toHaveBeenCalledWith('ended', expect.any(Function))
    })

    it('ignores events after destroy', () => {
      sampler.destroy()
      el._emit('playing')
      expect(sampler.collect()).toBeNull()
    })

    it('is idempotent', () => {
      expect(() => { sampler.destroy(); sampler.destroy() }).not.toThrow()
    })
  })
})
