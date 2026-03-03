import { Container, Playback, Events } from '@clappr/core'
import HlsNetworkAdapterPlugin from './hls_network_adapter_plugin'
import { TRACE_EVENT, TelemetryEventTypes } from '@clappr/core'
import HLSJS from 'hls.js'

class FakePlayback extends Playback {
  get name() { return 'fake-playback' }
}

const createFakeHls = () => ({
  on: jest.fn(),
  off: jest.fn(),
})

describe('HlsNetworkAdapterPlugin', () => {
  let container, plugin, playback, fakeHls

  beforeEach(() => {
    playback = new FakePlayback({ src: 'http://example.com/video.m3u8' })
    fakeHls = createFakeHls()
    playback._hls = fakeHls
    container = new Container({ playback })
    plugin = new HlsNetworkAdapterPlugin(container)
    container.addPlugin(plugin)
  })

  afterEach(() => {
    plugin.destroy()
  })

  describe('lifecycle', () => {
    it('should have the correct plugin name', () => {
      expect(plugin.name).toBe('hls_network_adapter')
    })

    it('should be a container plugin', () => {
      expect(HlsNetworkAdapterPlugin.type).toBe('container')
    })

    it('should attach to hls on CONTAINER_PLAY after CONTAINER_READY', () => {
      container.trigger(Events.CONTAINER_READY)
      container.trigger(Events.CONTAINER_PLAY)

      expect(fakeHls.on).toHaveBeenCalledWith(HLSJS.Events.FRAG_LOADING, expect.any(Function))
      expect(fakeHls.on).toHaveBeenCalledWith(HLSJS.Events.FRAG_LOADED, expect.any(Function))
      expect(fakeHls.on).toHaveBeenCalledWith(HLSJS.Events.ERROR, expect.any(Function))
    })

    it('should not attach to hls if disabled via options', () => {
      plugin.destroy()
      const disabledPlayback = new FakePlayback({ src: 'http://example.com/video.m3u8' })
      const disabledHls = createFakeHls()
      disabledPlayback._hls = disabledHls
      const disabledContainer = new Container({
        playback: disabledPlayback,
        telemetry: { hlsNetwork: { enabled: false } },
      })
      const disabledPlugin = new HlsNetworkAdapterPlugin(disabledContainer)
      disabledContainer.addPlugin(disabledPlugin)
      disabledContainer.trigger(Events.CONTAINER_READY)
      disabledContainer.trigger(Events.CONTAINER_PLAY)

      expect(disabledHls.on).not.toHaveBeenCalled()
      disabledPlugin.destroy()
    })

    it('should detach hls listeners on destroy', () => {
      container.trigger(Events.CONTAINER_READY)
      container.trigger(Events.CONTAINER_PLAY)

      plugin.destroy()

      expect(fakeHls.off).toHaveBeenCalledWith(HLSJS.Events.FRAG_LOADING, expect.any(Function))
      expect(fakeHls.off).toHaveBeenCalledWith(HLSJS.Events.FRAG_LOADED, expect.any(Function))
      expect(fakeHls.off).toHaveBeenCalledWith(HLSJS.Events.ERROR, expect.any(Function))
    })

    it('should re-attach when _hls instance changes', () => {
      container.trigger(Events.CONTAINER_READY)
      container.trigger(Events.CONTAINER_PLAY)

      const newHls = createFakeHls()
      playback._hls = newHls
      container.trigger(Events.CONTAINER_PLAY)

      // Old hls should be detached
      expect(fakeHls.off).toHaveBeenCalled()
      // New hls should be attached
      expect(newHls.on).toHaveBeenCalledWith(HLSJS.Events.FRAG_LOADING, expect.any(Function))
    })

    it('should not re-attach when _hls instance is the same', () => {
      container.trigger(Events.CONTAINER_READY)
      container.trigger(Events.CONTAINER_PLAY)

      const callCount = fakeHls.on.mock.calls.length
      container.trigger(Events.CONTAINER_PLAY)

      expect(fakeHls.on.mock.calls.length).toBe(callCount)
    })

    it('should clear pending frags on destroy', () => {
      container.trigger(Events.CONTAINER_READY)
      container.trigger(Events.CONTAINER_PLAY)

      // Inject a fake pending entry
      plugin._pendingFrags.set('some-id', { startT: 0 })
      plugin.destroy()

      expect(plugin._pendingFrags.size).toBe(0)
    })
  })

  describe('telemetry events', () => {
    let triggerSpy
    let fragLoadingHandler, fragLoadedHandler, hlsErrorHandler

    beforeEach(() => {
      triggerSpy = jest.spyOn(container, 'trigger')
      container.trigger(Events.CONTAINER_READY)
      container.trigger(Events.CONTAINER_PLAY)

      // Capture the bound handlers injected into hls.on
      fragLoadingHandler = fakeHls.on.mock.calls.find(
        ([evt]) => evt === HLSJS.Events.FRAG_LOADING,
      )?.[1]
      fragLoadedHandler = fakeHls.on.mock.calls.find(
        ([evt]) => evt === HLSJS.Events.FRAG_LOADED,
      )?.[1]
      hlsErrorHandler = fakeHls.on.mock.calls.find(
        ([evt]) => evt === HLSJS.Events.ERROR,
      )?.[1]
    })

    const makeFrag = (overrides = {}) => ({
      url: 'https://example.com/seg-001.ts',
      sn: 0,
      level: 1,
      type: 'main',
      start: 0,
      duration: 6,
      stats: {
        loading: { start: 1000, end: 1250 },
        total: 204800,
      },
      ...overrides,
    })

    describe('net.request.start', () => {
      it('should emit on FRAG_LOADING', () => {
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag: makeFrag() })

        const call = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)
        expect(call).toBeTruthy()
        const envelope = call[1]
        expect(envelope.type).toBe(TelemetryEventTypes.NET_REQUEST_START)
        expect(envelope.source).toBe('hls_network_adapter')
      })

      it('should include correct payload for a regular segment', () => {
        const frag = makeFrag({ sn: 3, level: 2, type: 'main' })
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)?.[1]
        expect(envelope.data.kind).toBe('segment')
        expect(envelope.data.urlHash).toBeTruthy()
        expect(envelope.data.chunk.variantId).toBe(2)
        expect(envelope.data.chunk.seq).toBe(3)
        expect(envelope.data.chunk.stream).toBe('main')
      })

      it('should emit kind=init for init segment', () => {
        const frag = makeFrag({ sn: 'initSegment', level: 0 })
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)?.[1]
        expect(envelope.data.kind).toBe('init')
        expect(envelope.data.chunk.seq).toBeNull()
      })

      it('should emit kind=subtitle for subtitle segments', () => {
        const frag = makeFrag({ type: 'subtitle', sn: 0 })
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)?.[1]
        expect(envelope.data.kind).toBe('subtitle')
      })
    })

    describe('net.request.end', () => {
      it('should emit on FRAG_LOADED with timing from frag.stats.loading', () => {
        const frag = makeFrag()
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag })
        triggerSpy.mockClear()

        fragLoadedHandler(HLSJS.Events.FRAG_LOADED, { frag })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)?.[1]
        expect(envelope.type).toBe(TelemetryEventTypes.NET_REQUEST_END)
        expect(envelope.data.durationMs).toBe(250) // 1250 - 1000
        expect(envelope.data.bytes).toBe(204800)
      })

      it('should match id from net.request.start to net.request.end', () => {
        const frag = makeFrag()
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag })
        const startEnvelope = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)?.[1]

        triggerSpy.mockClear()
        fragLoadedHandler(HLSJS.Events.FRAG_LOADED, { frag })
        const endEnvelope = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)?.[1]

        expect(endEnvelope.data.id).toBe(startEnvelope.data.id)
      })

      it('should clear pending entry after load', () => {
        const frag = makeFrag()
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag })
        fragLoadedHandler(HLSJS.Events.FRAG_LOADED, { frag })

        expect(plugin._pendingFrags.size).toBe(0)
      })

      it('should handle missing frag.stats gracefully', () => {
        const frag = makeFrag({ stats: undefined })
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag })
        fragLoadedHandler(HLSJS.Events.FRAG_LOADED, { frag })

        const envelope = triggerSpy.mock.calls
          .filter(([evt]) => evt === TRACE_EVENT)
          .find(([, e]) => e.type === TelemetryEventTypes.NET_REQUEST_END)?.[1]
        expect(envelope.data.durationMs).toBeGreaterThanOrEqual(0)
        expect(envelope.data.bytes).toBe(0)
      })
    })

    describe('net.request.error', () => {
      it('should emit on NETWORK_ERROR with frag', () => {
        const frag = makeFrag()
        hlsErrorHandler(HLSJS.Events.ERROR, {
          type: HLSJS.ErrorTypes.NETWORK_ERROR,
          details: HLSJS.ErrorDetails.FRAG_LOAD_ERROR,
          fatal: false,
          frag,
        })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)?.[1]
        expect(envelope.type).toBe(TelemetryEventTypes.NET_REQUEST_ERROR)
        expect(envelope.data.fatal).toBe(false)
        expect(envelope.data.hlsErrorDetails).toBe(HLSJS.ErrorDetails.FRAG_LOAD_ERROR)
      })

      it('should not emit for non-network errors', () => {
        hlsErrorHandler(HLSJS.Events.ERROR, {
          type: HLSJS.ErrorTypes.MEDIA_ERROR,
          details: 'audio_codec_decode_error',
          fatal: false,
          frag: makeFrag(),
        })

        const call = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)
        expect(call).toBeFalsy()
      })

      it('should not emit for network errors without frag', () => {
        hlsErrorHandler(HLSJS.Events.ERROR, {
          type: HLSJS.ErrorTypes.NETWORK_ERROR,
          details: 'manifest_load_error',
          fatal: true,
          frag: undefined,
        })

        const call = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)
        expect(call).toBeFalsy()
      })

      it('should clear pending entry on network error', () => {
        const frag = makeFrag()
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag })
        hlsErrorHandler(HLSJS.Events.ERROR, {
          type: HLSJS.ErrorTypes.NETWORK_ERROR,
          details: HLSJS.ErrorDetails.FRAG_LOAD_ERROR,
          fatal: false,
          frag,
        })

        expect(plugin._pendingFrags.size).toBe(0)
      })
    })

    describe('envelope contract', () => {
      it('should use canonical TRACE_EVENT channel for all emissions', () => {
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag: makeFrag() })

        const traceCalls = triggerSpy.mock.calls.filter(([evt]) => evt === TRACE_EVENT)
        expect(traceCalls.length).toBeGreaterThan(0)
      })

      it('should include all required envelope fields', () => {
        fragLoadingHandler(HLSJS.Events.FRAG_LOADING, { frag: makeFrag() })

        const envelope = triggerSpy.mock.calls.find(([evt]) => evt === TRACE_EVENT)?.[1]
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
