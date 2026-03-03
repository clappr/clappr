import { Container, Playback, Events } from '../main'
import VideoStatePlugin from './video_state_plugin'
import { TRACE_EVENT, TelemetryEventTypes } from './constants'

/**
 * Creates a fake TimeRanges object.
 */
const createFakeTimeRanges = (ranges = []) => ({
  length: ranges.length,
  start: (i) => ranges[i][0],
  end: (i) => ranges[i][1],
})

/**
 * Creates a fake video element for testing.
 */
const createFakeVideoElement = (overrides = {}) => {
  const el = document.createElement('video')
  Object.defineProperties(el, {
    currentTime: { value: 10, writable: true, configurable: true },
    readyState: { value: 4, writable: true, configurable: true },
    networkState: { value: 2, writable: true, configurable: true },
    paused: { value: false, writable: true, configurable: true },
    playbackRate: { value: 1, writable: true, configurable: true },
    buffered: {
      value: overrides.buffered || createFakeTimeRanges([[0, 20]]),
      writable: true,
      configurable: true,
    },
  })
  // Keep spy-able references
  el.addEventListener = jest.fn(el.addEventListener.bind(el))
  el.removeEventListener = jest.fn(el.removeEventListener.bind(el))
  Object.assign(el, overrides)
  return el
}

class FakePlayback extends Playback {
  get name() { return 'fake-playback' }
}

describe('VideoStatePlugin', () => {
  let container, plugin, playback

  beforeEach(() => {
    jest.useFakeTimers()
    playback = new FakePlayback({ src: 'http://example.com/video.mp4' })
    playback.el = createFakeVideoElement()
    container = new Container({ playback })
    plugin = new VideoStatePlugin(container)
    container.addPlugin(plugin)
  })

  afterEach(() => {
    plugin.destroy()
    jest.useRealTimers()
  })

  describe('lifecycle', () => {
    it('should have the correct plugin name', () => {
      expect(plugin.name).toBe('video-state-telemetry')
    })

    it('should be a container plugin', () => {
      expect(VideoStatePlugin.type).toBe('container')
    })

    it('should attach video listeners on CONTAINER_READY', () => {
      container.trigger(Events.CONTAINER_READY)
      expect(playback.el.addEventListener).toHaveBeenCalled()
    })

    it('should not attach listeners if disabled via options', () => {
      plugin.destroy()
      const disabledPlayback = new FakePlayback({ src: 'http://example.com/video.mp4' })
      disabledPlayback.el = createFakeVideoElement()
      const disabledContainer = new Container({
        playback: disabledPlayback,
        telemetry: { videoState: { enabled: false } },
      })
      const disabledPlugin = new VideoStatePlugin(disabledContainer)
      disabledContainer.addPlugin(disabledPlugin)

      disabledContainer.trigger(Events.CONTAINER_READY)
      expect(disabledPlayback.el.addEventListener).not.toHaveBeenCalled()
      disabledPlugin.destroy()
    })

    it('should detach video listeners on destroy', () => {
      container.trigger(Events.CONTAINER_READY)
      const addCallCount = playback.el.addEventListener.mock.calls.length

      plugin.destroy()

      expect(playback.el.removeEventListener).toHaveBeenCalledTimes(addCallCount)
    })

    it('should stop sampling interval on destroy', () => {
      container.trigger(Events.CONTAINER_READY)
      plugin.destroy()

      const triggerSpy = jest.spyOn(container, 'trigger')
      jest.advanceTimersByTime(5000)

      const telemetryEvents = triggerSpy.mock.calls.filter(([event]) => event === TRACE_EVENT)
      expect(telemetryEvents).toHaveLength(0)
    })
  })

  describe('media.event emission', () => {
    it('should emit media.event when a video event fires', () => {
      container.trigger(Events.CONTAINER_READY)
      const triggerSpy = jest.spyOn(container, 'trigger')

      // Simulate a "waiting" event on the video element
      const waitingHandler = playback.el.addEventListener.mock.calls.find(
        ([name]) => name === 'waiting',
      )?.[1]

      expect(waitingHandler).toBeDefined()
      waitingHandler()

      const traceCall = triggerSpy.mock.calls.find(([event]) => event === TRACE_EVENT)
      expect(traceCall).toBeDefined()

      const envelope = traceCall[1]
      expect(envelope.type).toBe(TelemetryEventTypes.MEDIA_EVENT)
      expect(envelope.source).toBe('video-state-telemetry')
      expect(envelope.data).toEqual({
        name: 'waiting',
        currentTime: 10,
        readyState: 4,
      })
      expect(envelope.v).toBe('1.0')
    })

    it('should attach listeners for all default video events', () => {
      container.trigger(Events.CONTAINER_READY)

      const attachedEvents = playback.el.addEventListener.mock.calls.map(([name]) => name)

      const expectedEvents = [
        'waiting', 'playing', 'stalled', 'seeking', 'seeked',
        'ended', 'canplay', 'canplaythrough', 'loadedmetadata',
        'loadeddata', 'error', 'emptied', 'suspend', 'abort',
      ]

      expectedEvents.forEach((eventName) => {
        expect(attachedEvents).toContain(eventName)
      })
    })

    it('should use passive listeners', () => {
      container.trigger(Events.CONTAINER_READY)

      playback.el.addEventListener.mock.calls.forEach(([, , options]) => {
        expect(options).toEqual({ passive: true })
      })
    })
  })

  describe('media.state.sample emission', () => {
    it('should emit media.state.sample periodically', () => {
      container.trigger(Events.CONTAINER_READY)
      const triggerSpy = jest.spyOn(container, 'trigger')

      jest.advanceTimersByTime(1000)

      const sampleCalls = triggerSpy.mock.calls.filter(
        ([event, envelope]) => event === TRACE_EVENT && envelope.type === TelemetryEventTypes.MEDIA_STATE_SAMPLE,
      )

      expect(sampleCalls.length).toBeGreaterThanOrEqual(1)

      const envelope = sampleCalls[0][1]
      expect(envelope.data).toEqual({
        currentTime: 10,
        readyState: 4,
        networkState: 2,
        paused: false,
        playbackRate: 1,
      })
    })

    it('should respect custom sampleIntervalMs', () => {
      plugin.destroy()
      const customPlugin = new VideoStatePlugin(
        new Container({
          playback,
          telemetry: { videoState: { sampleIntervalMs: 2000 } },
        }),
      )
      const customContainer = customPlugin.container
      customContainer.addPlugin(customPlugin)

      const triggerSpy = jest.spyOn(customContainer, 'trigger')
      customContainer.trigger(Events.CONTAINER_READY)

      jest.advanceTimersByTime(1000)
      const samplesAt1s = triggerSpy.mock.calls.filter(
        ([event, envelope]) => event === TRACE_EVENT && envelope?.type === TelemetryEventTypes.MEDIA_STATE_SAMPLE,
      )
      expect(samplesAt1s).toHaveLength(0)

      jest.advanceTimersByTime(1000)
      const samplesAt2s = triggerSpy.mock.calls.filter(
        ([event, envelope]) => event === TRACE_EVENT && envelope?.type === TelemetryEventTypes.MEDIA_STATE_SAMPLE,
      )
      expect(samplesAt2s).toHaveLength(1)

      customPlugin.destroy()
    })
  })

  describe('media.event contract', () => {
    it('should produce envelope matching the canonical schema', () => {
      container.trigger(Events.CONTAINER_READY)
      const triggerSpy = jest.spyOn(container, 'trigger')

      const playingHandler = playback.el.addEventListener.mock.calls.find(
        ([name]) => name === 'playing',
      )?.[1]
      playingHandler()

      const envelope = triggerSpy.mock.calls.find(
        ([event, env]) => event === TRACE_EVENT && env.type === TelemetryEventTypes.MEDIA_EVENT,
      )?.[1]

      // Contract: required fields
      expect(envelope).toHaveProperty('type')
      expect(envelope).toHaveProperty('t')
      expect(envelope).toHaveProperty('ts')
      expect(envelope).toHaveProperty('source')
      expect(envelope).toHaveProperty('data')
      expect(envelope).toHaveProperty('v')

      // Contract: data shape for media.event
      expect(envelope.data).toHaveProperty('name')
      expect(envelope.data).toHaveProperty('currentTime')
      expect(envelope.data).toHaveProperty('readyState')
      expect(typeof envelope.data.name).toBe('string')
      expect(typeof envelope.data.currentTime).toBe('number')
      expect(typeof envelope.data.readyState).toBe('number')
    })
  })

  describe('media.state.sample contract', () => {
    it('should produce envelope matching the canonical schema', () => {
      container.trigger(Events.CONTAINER_READY)
      const triggerSpy = jest.spyOn(container, 'trigger')

      jest.advanceTimersByTime(1000)

      const envelope = triggerSpy.mock.calls.find(
        ([event, env]) => event === TRACE_EVENT && env.type === TelemetryEventTypes.MEDIA_STATE_SAMPLE,
      )?.[1]

      expect(envelope).toBeDefined()

      // Contract: data shape for media.state.sample
      expect(envelope.data).toHaveProperty('currentTime')
      expect(envelope.data).toHaveProperty('readyState')
      expect(envelope.data).toHaveProperty('networkState')
      expect(envelope.data).toHaveProperty('paused')
      expect(envelope.data).toHaveProperty('playbackRate')
      expect(typeof envelope.data.currentTime).toBe('number')
      expect(typeof envelope.data.readyState).toBe('number')
      expect(typeof envelope.data.networkState).toBe('number')
      expect(typeof envelope.data.paused).toBe('boolean')
      expect(typeof envelope.data.playbackRate).toBe('number')
    })
  })
})
