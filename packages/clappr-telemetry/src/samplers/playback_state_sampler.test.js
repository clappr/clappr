import PlaybackStateSampler from './playback_state_sampler'
import { Events } from '@clappr/core'
import { EVENT_TYPES } from '../utils/constants'

beforeAll(() => {
  Events.register('CONTAINER_TELEMETRY_TRACE')
})

const makeVideoEl = (overrides = {}) => ({
  networkState: 2,
  paused: false,
  playbackRate: 1,
  currentTime: 10,
  ...overrides
})

const makePlayback = (videoEl) => ({ el: videoEl })

const makeContainer = () => ({
  on: jest.fn(),
  off: jest.fn()
})

const trace = (type, data = {}) => ({ type, data })

describe('PlaybackStateSampler', () => {
  let sampler, playback, container

  beforeEach(() => {
    container = makeContainer()
    playback = makePlayback(makeVideoEl())
    sampler = new PlaybackStateSampler(playback, container)
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
    it('returns networkState, paused, playbackRate, currentTime and null bitrate fields', () => {
      expect(sampler.collect()).toEqual({
        networkState: 2,
        paused: false,
        playbackRate: 1,
        currentTime: 10,
        bitrateKbps: null,
        width: null,
        height: null,
        switchesUp: 0,
        switchesDown: 0
      })
    })

    it('rounds currentTime to 1 decimal', () => {
      const s = new PlaybackStateSampler(makePlayback(makeVideoEl({ currentTime: 10.456 })), container)
      expect(s.collect().currentTime).toBe(10.5)
    })

    it('returns null when videoEl is null', () => {
      const s = new PlaybackStateSampler({ el: null }, container)
      expect(s.collect()).toBeNull()
    })

    it('returns null when playback is null', () => {
      const s = new PlaybackStateSampler(null, container)
      expect(s.collect()).toBeNull()
    })

    it('reflects paused: true', () => {
      const s = new PlaybackStateSampler(makePlayback(makeVideoEl({ paused: true })), container)
      expect(s.collect().paused).toBe(true)
    })

    it('reflects custom playbackRate', () => {
      const s = new PlaybackStateSampler(makePlayback(makeVideoEl({ playbackRate: 1.5 })), container)
      expect(s.collect().playbackRate).toBe(1.5)
    })
  })

  describe('BITRATE_INIT', () => {
    it('define bitrateKbps, width e height', () => {
      sampler._onTrace(trace(EVENT_TYPES.BITRATE_INIT, { current: { bitrate: 2000000, width: 1920, height: 1080 } }))
      const result = sampler.collect()
      expect(result.bitrateKbps).toBe(2000)
      expect(result.width).toBe(1920)
      expect(result.height).toBe(1080)
    })

    it('não conta switchesUp nem switchesDown', () => {
      sampler._onTrace(trace(EVENT_TYPES.BITRATE_INIT, { current: { bitrate: 2000000 } }))
      expect(sampler.collect().switchesUp).toBe(0)
      expect(sampler.collect().switchesDown).toBe(0)
    })

    it('define previousBitrateKbps para que BITRATE_CHANGE seguinte conte switch corretamente', () => {
      sampler._onTrace(trace(EVENT_TYPES.BITRATE_INIT, { current: { bitrate: 1000000 } }))
      sampler._onTrace(trace(EVENT_TYPES.BITRATE_CHANGE, { current: { bitrate: 2000000 } }))
      expect(sampler.collect().switchesUp).toBe(1)
    })
  })

  describe('BITRATE_CHANGE', () => {
    const bitrateChange = (current) => trace(EVENT_TYPES.BITRATE_CHANGE, { current })

    it('atualiza bitrateKbps, width e height', () => {
      sampler._onTrace(bitrateChange({ bitrate: 3000000, width: 1280, height: 720 }))
      const result = sampler.collect()
      expect(result.bitrateKbps).toBe(3000)
      expect(result.width).toBe(1280)
      expect(result.height).toBe(720)
    })

    it('incrementa switchesUp no aumento de bitrate', () => {
      sampler._onTrace(bitrateChange({ bitrate: 1000000 }))
      sampler._onTrace(bitrateChange({ bitrate: 2000000 }))
      expect(sampler.collect().switchesUp).toBe(1)
    })

    it('incrementa switchesDown na queda de bitrate', () => {
      sampler._onTrace(bitrateChange({ bitrate: 2000000 }))
      sampler._onTrace(bitrateChange({ bitrate: 1000000 }))
      expect(sampler.collect().switchesDown).toBe(1)
    })

    it('não conta switch no primeiro BITRATE_CHANGE', () => {
      sampler._onTrace(bitrateChange({ bitrate: 1000000 }))
      expect(sampler.collect().switchesUp).toBe(0)
      expect(sampler.collect().switchesDown).toBe(0)
    })

    it('ignora bitrate quando current.bitrate é null', () => {
      sampler._onTrace(bitrateChange({ bitrate: null, width: 1280, height: 720 }))
      expect(sampler.collect().bitrateKbps).toBeNull()
      expect(sampler.collect().width).toBe(1280)
    })
  })

  describe('destroy()', () => {
    it('collect() returns null after destroy', () => {
      sampler.destroy()
      expect(sampler.collect()).toBeNull()
    })

    it('unregisters listener on CONTAINER_TELEMETRY_TRACE', () => {
      sampler.destroy()
      expect(container.off).toHaveBeenCalledWith(
        Events.Custom.CONTAINER_TELEMETRY_TRACE,
        expect.any(Function)
      )
    })

    it('is safe to call multiple times', () => {
      expect(() => {
        sampler.destroy()
        sampler.destroy()
      }).not.toThrow()
    })
  })
})
