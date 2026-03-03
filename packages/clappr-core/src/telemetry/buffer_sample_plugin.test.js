import { Container, Playback, Events } from '../main'
import BufferSamplePlugin from './buffer_sample_plugin'
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
      value: overrides.buffered || createFakeTimeRanges([[0, 25]]),
      writable: true,
      configurable: true,
    },
  })
  Object.assign(el, overrides)
  return el
}

class FakePlayback extends Playback {
  get name() { return 'fake-playback' }
}

describe('BufferSamplePlugin', () => {
  let container, plugin, playback

  beforeEach(() => {
    jest.useFakeTimers()
    playback = new FakePlayback({ src: 'http://example.com/video.mp4' })
    playback.el = createFakeVideoElement()
    container = new Container({ playback })
    plugin = new BufferSamplePlugin(container)
    container.addPlugin(plugin)
  })

  afterEach(() => {
    plugin.destroy()
    jest.useRealTimers()
  })

  describe('lifecycle', () => {
    it('should have the correct plugin name', () => {
      expect(plugin.name).toBe('buffer-sample-telemetry')
    })

    it('should be a container plugin', () => {
      expect(BufferSamplePlugin.type).toBe('container')
    })

    it('should start sampling on CONTAINER_READY', () => {
      const triggerSpy = jest.spyOn(container, 'trigger')
      container.trigger(Events.CONTAINER_READY)

      jest.advanceTimersByTime(1000)

      const sampleCalls = triggerSpy.mock.calls.filter(
        ([event, envelope]) => event === TRACE_EVENT && envelope?.type === TelemetryEventTypes.MSE_BUFFER_SAMPLE,
      )
      expect(sampleCalls.length).toBeGreaterThanOrEqual(1)
    })

    it('should not start sampling if disabled', () => {
      plugin.destroy()

      const disabledContainer = new Container({
        playback,
        telemetry: { bufferSample: { enabled: false } },
      })
      const disabledPlugin = new BufferSamplePlugin(disabledContainer)
      disabledContainer.addPlugin(disabledPlugin)

      const triggerSpy = jest.spyOn(disabledContainer, 'trigger')
      disabledContainer.trigger(Events.CONTAINER_READY)

      jest.advanceTimersByTime(5000)

      const sampleCalls = triggerSpy.mock.calls.filter(
        ([event, envelope]) => event === TRACE_EVENT && envelope?.type === TelemetryEventTypes.MSE_BUFFER_SAMPLE,
      )
      expect(sampleCalls).toHaveLength(0)

      disabledPlugin.destroy()
    })

    it('should stop sampling on destroy', () => {
      container.trigger(Events.CONTAINER_READY)
      plugin.destroy()

      const triggerSpy = jest.spyOn(container, 'trigger')
      jest.advanceTimersByTime(5000)

      const sampleCalls = triggerSpy.mock.calls.filter(
        ([event]) => event === TRACE_EVENT,
      )
      expect(sampleCalls).toHaveLength(0)
    })
  })

  describe('mse.buffer.sample emission', () => {
    it('should emit correct bufferAhead value', () => {
      const triggerSpy = jest.spyOn(container, 'trigger')
      container.trigger(Events.CONTAINER_READY)

      jest.advanceTimersByTime(1000)

      const sampleCall = triggerSpy.mock.calls.find(
        ([event, envelope]) => event === TRACE_EVENT && envelope?.type === TelemetryEventTypes.MSE_BUFFER_SAMPLE,
      )

      expect(sampleCall).toBeDefined()
      const envelope = sampleCall[1]
      // currentTime=10, buffered end=25, so bufferAhead=15
      expect(envelope.data.bufferAhead).toBe(15)
      expect(envelope.data.currentTime).toBe(10)
    })

    it('should include rangesCompact by default', () => {
      const triggerSpy = jest.spyOn(container, 'trigger')
      container.trigger(Events.CONTAINER_READY)

      jest.advanceTimersByTime(1000)

      const envelope = triggerSpy.mock.calls.find(
        ([event, env]) => event === TRACE_EVENT && env?.type === TelemetryEventTypes.MSE_BUFFER_SAMPLE,
      )?.[1]

      expect(envelope.data.rangesCompact).toEqual([[0, 25]])
    })

    it('should exclude rangesCompact when includeRanges is false', () => {
      plugin.destroy()

      const noRangesContainer = new Container({
        playback,
        telemetry: { bufferSample: { includeRanges: false } },
      })
      const noRangesPlugin = new BufferSamplePlugin(noRangesContainer)
      noRangesContainer.addPlugin(noRangesPlugin)

      const triggerSpy = jest.spyOn(noRangesContainer, 'trigger')
      noRangesContainer.trigger(Events.CONTAINER_READY)

      jest.advanceTimersByTime(1000)

      const envelope = triggerSpy.mock.calls.find(
        ([event, env]) => event === TRACE_EVENT && env?.type === TelemetryEventTypes.MSE_BUFFER_SAMPLE,
      )?.[1]

      expect(envelope.data).not.toHaveProperty('rangesCompact')

      noRangesPlugin.destroy()
    })

    it('should handle empty buffer gracefully', () => {
      Object.defineProperty(playback.el, 'buffered', {
        value: createFakeTimeRanges([]),
        writable: true,
        configurable: true,
      })

      const triggerSpy = jest.spyOn(container, 'trigger')
      container.trigger(Events.CONTAINER_READY)

      jest.advanceTimersByTime(1000)

      const envelope = triggerSpy.mock.calls.find(
        ([event, env]) => event === TRACE_EVENT && env?.type === TelemetryEventTypes.MSE_BUFFER_SAMPLE,
      )?.[1]

      expect(envelope.data.bufferAhead).toBe(0)
      expect(envelope.data.rangesCompact).toEqual([])
    })

    it('should respect custom sampleIntervalMs', () => {
      plugin.destroy()

      const customContainer = new Container({
        playback,
        telemetry: { bufferSample: { sampleIntervalMs: 500 } },
      })
      const customPlugin = new BufferSamplePlugin(customContainer)
      customContainer.addPlugin(customPlugin)

      const triggerSpy = jest.spyOn(customContainer, 'trigger')
      customContainer.trigger(Events.CONTAINER_READY)

      jest.advanceTimersByTime(500)
      const samplesAt500 = triggerSpy.mock.calls.filter(
        ([event, env]) => event === TRACE_EVENT && env?.type === TelemetryEventTypes.MSE_BUFFER_SAMPLE,
      )
      expect(samplesAt500).toHaveLength(1)

      jest.advanceTimersByTime(500)
      const samplesAt1000 = triggerSpy.mock.calls.filter(
        ([event, env]) => event === TRACE_EVENT && env?.type === TelemetryEventTypes.MSE_BUFFER_SAMPLE,
      )
      expect(samplesAt1000).toHaveLength(2)

      customPlugin.destroy()
    })

    it('should update bufferAhead when video state changes', () => {
      const triggerSpy = jest.spyOn(container, 'trigger')
      container.trigger(Events.CONTAINER_READY)

      // First sample: currentTime=10, end=25 → bufferAhead=15
      jest.advanceTimersByTime(1000)

      // Change video state
      Object.defineProperty(playback.el, 'currentTime', {
        value: 20,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(playback.el, 'buffered', {
        value: createFakeTimeRanges([[0, 30]]),
        writable: true,
        configurable: true,
      })

      jest.advanceTimersByTime(1000)

      const samples = triggerSpy.mock.calls.filter(
        ([event, env]) => event === TRACE_EVENT && env?.type === TelemetryEventTypes.MSE_BUFFER_SAMPLE,
      )

      expect(samples.length).toBeGreaterThanOrEqual(2)
      // Second sample: currentTime=20, end=30 → bufferAhead=10
      const lastSample = samples[samples.length - 1][1]
      expect(lastSample.data.bufferAhead).toBe(10)
      expect(lastSample.data.currentTime).toBe(20)
    })
  })

  describe('mse.buffer.sample contract', () => {
    it('should produce envelope matching the canonical schema', () => {
      const triggerSpy = jest.spyOn(container, 'trigger')
      container.trigger(Events.CONTAINER_READY)

      jest.advanceTimersByTime(1000)

      const envelope = triggerSpy.mock.calls.find(
        ([event, env]) => event === TRACE_EVENT && env?.type === TelemetryEventTypes.MSE_BUFFER_SAMPLE,
      )?.[1]

      expect(envelope).toBeDefined()

      // Envelope fields
      expect(envelope).toHaveProperty('type', TelemetryEventTypes.MSE_BUFFER_SAMPLE)
      expect(envelope).toHaveProperty('t')
      expect(envelope).toHaveProperty('ts')
      expect(envelope).toHaveProperty('source', 'buffer-sample-telemetry')
      expect(envelope).toHaveProperty('data')
      expect(envelope).toHaveProperty('v', '1.0')

      // Data shape
      expect(typeof envelope.data.bufferAhead).toBe('number')
      expect(typeof envelope.data.currentTime).toBe('number')
      expect(Array.isArray(envelope.data.rangesCompact)).toBe(true)
    })
  })
})
