import { Events } from '@clappr/core'
import PlaybackTimingSampler from './playback_timing_sampler'

const makePlayback = () => {
  const listeners = {}
  return {
    on: jest.fn((event, handler) => { listeners[event] = handler }),
    off: jest.fn(),
    _emit: (event, data) => listeners[event]?.(data)
  }
}

const makeContainer = () => ({
  on: jest.fn(),
  off: jest.fn()
})

describe('PlaybackTimingSampler', () => {
  let sampler
  let playback
  let container

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(0)
    playback = makePlayback()
    container = makeContainer()
    sampler = new PlaybackTimingSampler(playback, container)
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
    it('registers listeners on playback for all required events', () => {
      expect(playback.on).toHaveBeenCalledWith(Events.PLAYBACK_PLAY_INTENT, expect.any(Function))
      expect(playback.on).toHaveBeenCalledWith(Events.PLAYBACK_PLAY, expect.any(Function))
      expect(playback.on).toHaveBeenCalledWith(Events.PLAYBACK_BUFFERING, expect.any(Function))
      expect(playback.on).toHaveBeenCalledWith(Events.PLAYBACK_PAUSE, expect.any(Function))
      expect(playback.on).toHaveBeenCalledWith(Events.PLAYBACK_ENDED, expect.any(Function))
      expect(playback.on).toHaveBeenCalledWith(Events.PLAYBACK_STOP, expect.any(Function))
    })

    it('does not throw when playback is null', () => {
      expect(() => new PlaybackTimingSampler(null, null)).not.toThrow()
    })
  })

  describe('timePlayingMs', () => {
    it('accumulates while playing', () => {
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      playback._emit(Events.PLAYBACK_PLAY)
      jest.advanceTimersByTime(100)
      expect(sampler.collect().timePlayingMs).toBe(100)
    })

    it('stops accumulating on pause', () => {
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      playback._emit(Events.PLAYBACK_PLAY)
      jest.advanceTimersByTime(100)
      playback._emit(Events.PLAYBACK_PAUSE)
      jest.advanceTimersByTime(200)
      expect(sampler.collect().timePlayingMs).toBe(100)
    })

    it('stops accumulating on ended', () => {
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      playback._emit(Events.PLAYBACK_PLAY)
      jest.advanceTimersByTime(100)
      playback._emit(Events.PLAYBACK_ENDED)
      jest.advanceTimersByTime(200)
      expect(sampler.collect().timePlayingMs).toBe(100)
    })

    it('stops accumulating during buffering', () => {
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      playback._emit(Events.PLAYBACK_PLAY)
      jest.advanceTimersByTime(100)
      playback._emit(Events.PLAYBACK_BUFFERING)
      jest.advanceTimersByTime(50)
      expect(sampler.collect().timePlayingMs).toBe(100)
    })

    it('resumes after buffering', () => {
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      playback._emit(Events.PLAYBACK_PLAY)
      jest.advanceTimersByTime(100)
      playback._emit(Events.PLAYBACK_BUFFERING)
      jest.advanceTimersByTime(50)
      playback._emit(Events.PLAYBACK_PLAY)
      jest.advanceTimersByTime(200)
      expect(sampler.collect().timePlayingMs).toBe(300)
    })
  })

  describe('timeWaitingMs', () => {
    it('accumulates during buffering', () => {
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      playback._emit(Events.PLAYBACK_PLAY)
      jest.advanceTimersByTime(100)
      playback._emit(Events.PLAYBACK_BUFFERING)
      jest.advanceTimersByTime(50)
      expect(sampler.collect().timeWaitingMs).toBe(50)
    })

    it('does not accumulate during pause', () => {
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      playback._emit(Events.PLAYBACK_PLAY)
      playback._emit(Events.PLAYBACK_PAUSE)
      jest.advanceTimersByTime(200)
      expect(sampler.collect().timeWaitingMs).toBe(0)
    })
  })

  describe('joinTimeMs', () => {
    it('is the interval between PLAY_INTENT and first PLAY', () => {
      jest.setSystemTime(100)
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      jest.setSystemTime(350)
      playback._emit(Events.PLAYBACK_PLAY)
      expect(sampler.collect().joinTimeMs).toBe(250)
    })

    it('does not change on subsequent PLAY events', () => {
      jest.setSystemTime(100)
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      jest.setSystemTime(200)
      playback._emit(Events.PLAYBACK_PLAY)
      jest.setSystemTime(500)
      playback._emit(Events.PLAYBACK_BUFFERING)
      playback._emit(Events.PLAYBACK_PLAY)
      expect(sampler.collect().joinTimeMs).toBe(100)
    })

    it('is null when PLAY fires without a prior PLAY_INTENT', () => {
      playback._emit(Events.PLAYBACK_PLAY)
      expect(sampler.collect().joinTimeMs).toBeNull()
    })

    it('is null before any event', () => {
      expect(sampler.collect().joinTimeMs).toBeNull()
    })
  })

  describe('autoplayStartupTimeMs', () => {
    it('is null when there was a PLAY_INTENT', () => {
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      playback._emit(Events.PLAYBACK_PLAY)
      expect(sampler.collect().autoplayStartupTimeMs).toBeNull()
    })

    it('equals time since session start when there was no PLAY_INTENT', () => {
      jest.setSystemTime(0)
      sampler = new PlaybackTimingSampler(playback, container)
      jest.setSystemTime(2000)
      playback._emit(Events.PLAYBACK_PLAY)
      expect(sampler.collect().autoplayStartupTimeMs).toBe(2000)
    })

    it('is null before first PLAY fires', () => {
      expect(sampler.collect().autoplayStartupTimeMs).toBeNull()
    })
  })

  describe('collect() live', () => {
    it('includes current state time without requiring a new event', () => {
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      playback._emit(Events.PLAYBACK_PLAY)
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

  describe('full sequence: idle → playing(100ms) → waiting(50ms) → playing(200ms)', () => {
    it('accumulates correctly', () => {
      playback._emit(Events.PLAYBACK_PLAY_INTENT)
      playback._emit(Events.PLAYBACK_PLAY)
      jest.advanceTimersByTime(100)
      playback._emit(Events.PLAYBACK_BUFFERING)
      jest.advanceTimersByTime(50)
      playback._emit(Events.PLAYBACK_PLAY)
      jest.advanceTimersByTime(200)

      const result = sampler.collect()
      expect(result.timePlayingMs).toBe(300)
      expect(result.timeWaitingMs).toBe(50)
    })
  })

  describe('destroy()', () => {
    it('unregisters all events from playback', () => {
      sampler.destroy()
      expect(playback.off).toHaveBeenCalledWith(Events.PLAYBACK_PLAY_INTENT, expect.any(Function))
      expect(playback.off).toHaveBeenCalledWith(Events.PLAYBACK_PLAY, expect.any(Function))
      expect(playback.off).toHaveBeenCalledWith(Events.PLAYBACK_BUFFERING, expect.any(Function))
      expect(playback.off).toHaveBeenCalledWith(Events.PLAYBACK_PAUSE, expect.any(Function))
      expect(playback.off).toHaveBeenCalledWith(Events.PLAYBACK_ENDED, expect.any(Function))
      expect(playback.off).toHaveBeenCalledWith(Events.PLAYBACK_STOP, expect.any(Function))
    })

    it('ignores events after destroy', () => {
      sampler.destroy()
      playback._emit(Events.PLAYBACK_PLAY)
      expect(sampler.collect()).toBeNull()
    })

    it('is idempotent', () => {
      expect(() => { sampler.destroy(); sampler.destroy() }).not.toThrow()
    })
  })
})
