import VideoEventObserver from './video_event_observer'
import { emitTelemetry } from '../utils'
import { EVENT_TYPES, TELEMETRY_SOURCES, DEFAULT_VIDEO_EVENTS } from '../utils/constants'

vi.mock('../utils', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    emitTelemetry: vi.fn()
  }
})

const makeVideoEl = (overrides = {}) => ({
  currentTime: 10,
  readyState: 4,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  ...overrides
})

const makePlayback = (videoEl) => ({ el: videoEl })

const makeContainer = (cfg = {}) => ({
  options: { telemetry: { videoState: cfg } },
  trigger: vi.fn()
})

describe('VideoEventObserver', () => {
  let observer, container, playback, videoEl

  beforeEach(() => {
    vi.clearAllMocks()
    videoEl = makeVideoEl()
    playback = makePlayback(videoEl)
    container = makeContainer({ enabled: true })
    observer = new VideoEventObserver(playback, container)
  })

  describe('constructor', () => {
    it('uses DEFAULT_VIDEO_EVENTS when not configured', () => {
      expect(observer._videoEvents).toEqual(DEFAULT_VIDEO_EVENTS)
    })

    it('reads custom videoEvents list', () => {
      const o = new VideoEventObserver(playback, makeContainer({ videoEvents: ['waiting', 'error'] }))
      expect(o._videoEvents).toEqual(['waiting', 'error'])
    })
  })

  describe('bind()', () => {
    it('attaches one listener per configured event', () => {
      observer.bind()
      expect(videoEl.addEventListener).toHaveBeenCalledTimes(observer._videoEvents.length)
    })

    it('does nothing when videoEl is null', () => {
      const o = new VideoEventObserver({ el: null }, container)
      expect(() => o.bind()).not.toThrow()
      expect(emitTelemetry).not.toHaveBeenCalled()
    })

    it('does not attach duplicate listeners when called twice', () => {
      observer.bind()
      observer.bind()
      expect(videoEl.addEventListener).toHaveBeenCalledTimes(observer._videoEvents.length)
    })
  })

  describe('_onVideoEvent()', () => {
    it('emits MEDIA_EVENT with event name, currentTime, readyState and snapshot', () => {
      observer.bind()
      const handler = videoEl.addEventListener.mock.calls.find(([name]) => name === 'waiting')?.[1]
      handler?.()
      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.MEDIA_EVENT,
        { name: 'waiting', currentTime: 10, readyState: 4, snapshot: {} },
        TELEMETRY_SOURCES.VIDEO_EVENT_OBSERVER
      )
    })

    it('includes snapshot from samplerRegistry when provided', () => {
      const snapshotData = { buffer: { bufferAhead: 5 } }
      const mockSamplerRegistry = { snapshot: vi.fn(() => snapshotData) }
      const o = new VideoEventObserver(playback, container, mockSamplerRegistry)
      o.bind()
      const handler = videoEl.addEventListener.mock.calls.find(([name]) => name === 'waiting')?.[1]
      handler?.()
      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.MEDIA_EVENT,
        expect.objectContaining({ snapshot: snapshotData }),
        TELEMETRY_SOURCES.VIDEO_EVENT_OBSERVER
      )
    })

    it('uses empty object as snapshot when samplerRegistry is null', () => {
      const o = new VideoEventObserver(playback, container, null)
      o.bind()
      const handler = videoEl.addEventListener.mock.calls.find(([name]) => name === 'waiting')?.[1]
      handler?.()
      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.MEDIA_EVENT,
        expect.objectContaining({ snapshot: {} }),
        TELEMETRY_SOURCES.VIDEO_EVENT_OBSERVER
      )
    })

    it('does nothing when videoEl is null', () => {
      const o = new VideoEventObserver({ el: null }, container)
      o._onVideoEvent('waiting')
      expect(emitTelemetry).not.toHaveBeenCalled()
    })
  })

  describe('destroy()', () => {
    it('removes all attached event listeners', () => {
      observer.bind()
      observer.destroy()
      expect(videoEl.removeEventListener).toHaveBeenCalledTimes(observer._videoEvents.length)
    })

    it('clears event handlers map even when videoEl is null', () => {
      observer._eventHandlers.set('waiting', vi.fn())
      observer._playback = { el: null }
      expect(() => observer.destroy()).not.toThrow()
      expect(observer._eventHandlers.size).toBe(0)
    })

    it('is safe to call multiple times', () => {
      observer.bind()
      expect(() => {
        observer.destroy()
        observer.destroy()
      }).not.toThrow()
    })

    it('nulls playback, container and samplerRegistry references', () => {
      const mockSamplerRegistry = { snapshot: vi.fn() }
      const o = new VideoEventObserver(playback, container, mockSamplerRegistry)
      o.destroy()
      expect(o._playback).toBeNull()
      expect(o._container).toBeNull()
      expect(o._samplerRegistry).toBeNull()
    })
  })
})
