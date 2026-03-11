// Mock DashShakaPlayback entirely to avoid loading shaka-player in jsdom
jest.mock('../clappr-dash-shaka-playback', () => ({
  __esModule: true,
  default: {
    Events: { SHAKA_READY: 'shaka:ready' },
  },
}))

import { Container, Playback, Events } from '@clappr/core'
import ShakaNetworkAdapterPlugin from './shaka_network_adapter_plugin'

class FakePlayback extends Playback {
  get name() { return 'fake-playback' }
}

const createFakeNetworkEngine = () => ({
  registerRequestFilter: jest.fn(),
  registerResponseFilter: jest.fn(),
  unregisterRequestFilter: jest.fn(),
  unregisterResponseFilter: jest.fn(),
})

const createFakeShakaPlayer = (engine) => ({
  getNetworkingEngine: jest.fn(() => engine),
})

describe('ShakaNetworkAdapterPlugin', () => {
  let container, plugin, playback, fakeEngine, fakeShakaPlayer

  beforeEach(() => {
    playback = new FakePlayback({ src: 'https://example.com/manifest.mpd' })
    fakeEngine = createFakeNetworkEngine()
    fakeShakaPlayer = createFakeShakaPlayer(fakeEngine)
    playback.shakaPlayerInstance = fakeShakaPlayer
    container = new Container({ playback })
    plugin = new ShakaNetworkAdapterPlugin(container)
    container.addPlugin(plugin)
  })

  afterEach(() => {
    plugin.destroy()
  })

  describe('lifecycle', () => {
    it('should have the correct plugin name', () => {
      expect(plugin.name).toBe('shaka_network_adapter')
    })

    it('should be a container plugin', () => {
      expect(ShakaNetworkAdapterPlugin.type).toBe('container')
    })

    it('should register request and response filters on SHAKA_READY', () => {
      container.trigger(Events.CONTAINER_READY)
      container.playback.trigger('shaka:ready')

      expect(fakeEngine.registerRequestFilter).toHaveBeenCalledWith(expect.any(Function))
      expect(fakeEngine.registerResponseFilter).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should not register filters if disabled via options', () => {
      plugin.destroy()
      const disabledPlayback = new FakePlayback({ src: 'https://example.com/manifest.mpd' })
      const disabledEngine = createFakeNetworkEngine()
      disabledPlayback.shakaPlayerInstance = createFakeShakaPlayer(disabledEngine)
      const disabledContainer = new Container({
        playback: disabledPlayback,
        telemetry: { shakaNetwork: { enabled: false } },
      })
      const disabledPlugin = new ShakaNetworkAdapterPlugin(disabledContainer)
      disabledContainer.addPlugin(disabledPlugin)
      disabledContainer.trigger(Events.CONTAINER_READY)
      disabledPlayback.trigger('shaka:ready')

      expect(disabledEngine.registerRequestFilter).not.toHaveBeenCalled()
      disabledPlugin.destroy()
    })

    it('should unregister filters on destroy', () => {
      container.trigger(Events.CONTAINER_READY)
      container.playback.trigger('shaka:ready')

      plugin.destroy()

      expect(fakeEngine.unregisterRequestFilter).toHaveBeenCalled()
      expect(fakeEngine.unregisterResponseFilter).toHaveBeenCalled()
    })

    it('should re-attach when SHAKA_READY fires again with a new player instance', () => {
      container.trigger(Events.CONTAINER_READY)
      container.playback.trigger('shaka:ready')

      const newEngine = createFakeNetworkEngine()
      playback.shakaPlayerInstance = createFakeShakaPlayer(newEngine)
      container.playback.trigger('shaka:ready')

      // Old engine should have been cleaned up
      expect(fakeEngine.unregisterRequestFilter).toHaveBeenCalled()
      // New engine should be set up
      expect(newEngine.registerRequestFilter).toHaveBeenCalled()
    })

    it('should clear pending requests on destroy', () => {
      container.trigger(Events.CONTAINER_READY)
      container.playback.trigger('shaka:ready')

      plugin._pendingRequests.set('https://example.com/segment.mp4', [{ id: 'test', startT: 0 }])
      plugin.destroy()

      expect(plugin._pendingRequests.size).toBe(0)
    })
  })

  describe('telemetry events', () => {
    let triggerSpy, requestFilter, responseFilter

    beforeEach(() => {
      // Reset the mock calls for the new filter registration
      fakeEngine.registerRequestFilter.mockClear()
      fakeEngine.registerResponseFilter.mockClear()

      // Trigger the container ready and shaka ready events FIRST to register the filters
      container.trigger(Events.CONTAINER_READY)
      playback.trigger('shaka:ready')

      // Get the registered filters
      requestFilter = fakeEngine.registerRequestFilter.mock.calls[0]?.[0]
      responseFilter = fakeEngine.registerResponseFilter.mock.calls[0]?.[0]

      // ONLY NOW set up the spy to capture telemetry events in the actual tests
      // This ensures we don't capture the registration calls from above
      triggerSpy = jest.spyOn(container, 'trigger')
      triggerSpy.mockClear()  // Clear any calls from the spy setup itself
    })

    afterEach(() => {
      triggerSpy.mockRestore()
    })

    describe('net.request.start', () => {
      it('should emit on request filter invocation', () => {
        requestFilter(1, { uris: ['https://example.com/seg-001.mp4'] })

        const call = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)
        expect(call).toBeTruthy()
        const envelope = call[1]
        expect(envelope.type).toBe(Events.CONTAINER_TELEMETRY_REQUEST_START)
        expect(envelope.source).toBe('shaka_network_adapter')
      })

      it('should emit kind=segment for type 1', () => {
        requestFilter(1, { uris: ['https://example.com/seg-001.mp4'] })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]
        expect(envelope.data.kind).toBe('segment')
      })

      it('should emit kind=manifest for type 0', () => {
        requestFilter(0, { uris: ['https://example.com/manifest.mpd'] })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]
        expect(envelope.data.kind).toBe('manifest')
      })

      it('should emit kind=license for type 2', () => {
        requestFilter(2, { uris: ['https://example.com/license'] })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]
        expect(envelope.data.kind).toBe('license')
      })

      it('should emit kind=unknown for unrecognized types', () => {
        requestFilter(99, { uris: ['https://example.com/unknown'] })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]
        expect(envelope.data.kind).toBe('unknown')
      })

      it('should include urlHash in payload', () => {
        requestFilter(1, { uris: ['https://example.com/seg-001.mp4'] })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]
        expect(envelope.data.urlHash).toBeTruthy()
        expect(typeof envelope.data.urlHash).toBe('string')
      })
    })

    describe('net.request.end', () => {
      it('should emit on response filter invocation', () => {
        const uri = 'https://example.com/seg-001.mp4'
        requestFilter(1, { uris: [uri] })
        triggerSpy.mockClear()

        const data = new ArrayBuffer(2048)
        responseFilter(1, { uri, data })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]
        expect(envelope.type).toBe(Events.CONTAINER_TELEMETRY_REQUEST_END)
        expect(envelope.data.bytes).toBe(2048)
        expect(envelope.data.durationMs).toBeGreaterThanOrEqual(0)
      })

      it('should match id from net.request.start to net.request.end', () => {
        const uri = 'https://example.com/seg-001.mp4'
        requestFilter(1, { uris: [uri] })
        const startEnvelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]

        triggerSpy.mockClear()
        responseFilter(1, { uri, data: new ArrayBuffer(512) })
        const endEnvelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]

        expect(endEnvelope.data.id).toBe(startEnvelope.data.id)
      })

      it('should clear pending entry after response', () => {
        const uri = 'https://example.com/seg-001.mp4'
        requestFilter(1, { uris: [uri] })
        responseFilter(1, { uri, data: new ArrayBuffer(512) })

        expect(plugin._pendingRequests.size).toBe(0)
      })

      it('should handle missing response data gracefully', () => {
        const uri = 'https://example.com/seg-001.mp4'
        requestFilter(1, { uris: [uri] })
        triggerSpy.mockClear()

        responseFilter(1, { uri, data: null })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]
        expect(envelope.data.bytes).toBe(0)
      })

      it('should handle concurrent requests to the same URI in order', () => {
        const uri = 'https://example.com/seg-001.mp4'

        // Two concurrent requests for the same URI
        requestFilter(1, { uris: [uri] })
        const firstId = triggerSpy.mock.calls
          .filter(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)
          .at(-1)?.[1]?.data?.id

        requestFilter(1, { uris: [uri] })
        const secondId = triggerSpy.mock.calls
          .filter(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)
          .at(-1)?.[1]?.data?.id

        expect(firstId).not.toBe(secondId)
        expect(plugin._pendingRequests.get(uri).length).toBe(2)
      })

      it('should include throughputMbps in payload', () => {
        const uri = 'https://example.com/seg-001.mp4'

        requestFilter(1, { uris: [uri] })
        triggerSpy.mockClear()

        const data = new ArrayBuffer(2048)
        responseFilter(1, { uri, data })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]

        expect(envelope.data.throughputMbps).toBeDefined()
        expect(typeof envelope.data.throughputMbps).toBe('number')
        expect(envelope.data.throughputMbps).toBeGreaterThanOrEqual(0)
      })
    })

    describe('envelope contract', () => {
      it('should use canonical CONTAINER_TELEMETRY_TRACE event for all emissions', () => {
        requestFilter(1, { uris: ['https://example.com/seg-001.mp4'] })

        const traceCalls = triggerSpy.mock.calls.filter(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)
        expect(traceCalls.length).toBeGreaterThan(0)
      })

      it('should include all required envelope fields', () => {
        requestFilter(1, { uris: ['https://example.com/seg-001.mp4'] })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === Events.CONTAINER_TELEMETRY_TRACE)?.[1]
        expect(envelope).toHaveProperty('type')
        expect(envelope).toHaveProperty('t')
        expect(envelope).toHaveProperty('ts')
        expect(envelope).toHaveProperty('source')
        expect(envelope).toHaveProperty('data')
        expect(envelope).toHaveProperty('v')
        expect(envelope.v).toBe('1.0')
      })
    })
  })
})
