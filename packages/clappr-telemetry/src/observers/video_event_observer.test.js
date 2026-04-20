import VideoEventObserver from './video_event_observer'
import { emitTelemetry } from '../utils'
import { EVENT_TYPES, TELEMETRY_SOURCES, DEFAULT_VIDEO_EVENTS } from '../utils/constants'

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  emitTelemetry: jest.fn()
}))

const makeVideoEl = (overrides = {}) => ({
  currentTime: 10,
  readyState: 4,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  ...overrides
})

const makePlayback = (videoEl) => ({ el: videoEl })

const makeContainer = (cfg = {}) => ({
  options: { telemetry: { videoState: cfg } },
  trigger: jest.fn()
})

describe('VideoEventObserver', () => {
  let observer, container, playback, videoEl

  beforeEach(() => {
    jest.clearAllMocks()
    videoEl = makeVideoEl()
    playback = makePlayback(videoEl)
    container = makeContainer({ enabled: true })
    observer = new VideoEventObserver(playback, container)
  })

  describe('constructor', () => {
    it('is disabled by default when enabled is not set', () => {
      const o = new VideoEventObserver(playback, makeContainer())
      expect(o._enabled).toBe(false)
    })

    it('reads enabled: true from options', () => {
      const o = new VideoEventObserver(playback, makeContainer({ enabled: true }))
      expect(o._enabled).toBe(true)
    })

    it('reads enabled: false from options', () => {
      const o = new VideoEventObserver(playback, makeContainer({ enabled: false }))
      expect(o._enabled).toBe(false)
    })

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

    it('does nothing when disabled', () => {
      const o = new VideoEventObserver(playback, makeContainer({ enabled: false }))
      o.bind()
      expect(videoEl.addEventListener).not.toHaveBeenCalled()
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
      const mockSamplerRegistry = { snapshot: jest.fn(() => snapshotData) }
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
      observer._eventHandlers.set('waiting', jest.fn())
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
      const mockSamplerRegistry = { snapshot: jest.fn() }
      const o = new VideoEventObserver(playback, container, mockSamplerRegistry)
      o.destroy()
      expect(o._playback).toBeNull()
      expect(o._container).toBeNull()
      expect(o._samplerRegistry).toBeNull()
    })
  })
})
