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
    it('registers listeners for play, playing and waiting on el', () => {
      expect(el.addEventListener).toHaveBeenCalledWith('play', expect.any(Function), { passive: true })
      expect(el.addEventListener).toHaveBeenCalledWith('playing', expect.any(Function), { passive: true })
      expect(el.addEventListener).toHaveBeenCalledWith('waiting', expect.any(Function), { passive: true })
    })

    it('does not throw when playback has no el', () => {
      expect(() => new PlaybackTimingSampler({ el: null }, null)).not.toThrow()
      expect(() => new PlaybackTimingSampler(null, null)).not.toThrow()
    })
  })

  describe('playing', () => {
    it('acumula timePlayingMs enquanto em playing', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(100)
      expect(sampler.collect().timePlayingMs).toBe(100)
    })

    it('registra joinTimeMs como intervalo entre play e primeiro playing', () => {
      jest.setSystemTime(100)
      el._emit('play')
      jest.setSystemTime(350)
      el._emit('playing')
      expect(sampler.collect().joinTimeMs).toBe(250)
    })

    it('joinTimeMs não muda em playings subsequentes', () => {
      jest.setSystemTime(100)
      el._emit('play')
      jest.setSystemTime(200)
      el._emit('playing')
      jest.setSystemTime(500)
      el._emit('waiting')
      el._emit('playing')
      expect(sampler.collect().joinTimeMs).toBe(100)
    })

    it('joinTimeMs é null se playing ocorre sem play anterior', () => {
      el._emit('playing')
      expect(sampler.collect().joinTimeMs).toBeNull()
    })

    it('joinTimeMs é null antes de qualquer evento', () => {
      expect(sampler.collect().joinTimeMs).toBeNull()
    })
  })

  describe('waiting durante playing', () => {
    it('acumula timeWaitingMs', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(100)
      el._emit('waiting')
      jest.advanceTimersByTime(50)
      expect(sampler.collect().timeWaitingMs).toBe(50)
    })

    it('para de acumular timePlayingMs durante waiting', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(100)
      el._emit('waiting')
      jest.advanceTimersByTime(50)
      expect(sampler.collect().timePlayingMs).toBe(100)
    })
  })

  describe('sequência completa', () => {
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
    it('inclui tempo corrente do estado ativo sem precisar de novo evento', () => {
      el._emit('play')
      el._emit('playing')
      jest.advanceTimersByTime(150)
      expect(sampler.collect().timePlayingMs).toBe(150)
      jest.advanceTimersByTime(50)
      expect(sampler.collect().timePlayingMs).toBe(200)
    })

    it('retorna null após destroy', () => {
      sampler.destroy()
      expect(sampler.collect()).toBeNull()
    })
  })

  describe('destroy()', () => {
    it('remove os três listeners do el', () => {
      sampler.destroy()
      expect(el.removeEventListener).toHaveBeenCalledWith('play', expect.any(Function))
      expect(el.removeEventListener).toHaveBeenCalledWith('playing', expect.any(Function))
      expect(el.removeEventListener).toHaveBeenCalledWith('waiting', expect.any(Function))
    })

    it('ignora eventos após destroy', () => {
      sampler.destroy()
      el._emit('playing')
      expect(sampler.collect()).toBeNull()
    })

    it('é idempotente', () => {
      expect(() => { sampler.destroy(); sampler.destroy() }).not.toThrow()
    })
  })
})
