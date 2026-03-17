// Mock utilities
jest.mock('../utils', () => ({
  emitTelemetry: jest.fn(),
  calculateThroughput: jest.fn((bytes, ms) => (ms > 0 ? (bytes * 8) / (ms * 1000) : 0))
}))

import ShakaNetworkAdapter from './shaka_network_adapter'
import { emitTelemetry } from '../utils'
import { TelemetryEvents } from '../utils/telemetry_events'
import { TELEMETRY_SOURCE_NETWORK } from '../utils/constants'

const createFakeNetworkEngine = () => ({
  registerRequestFilter: jest.fn(),
  registerResponseFilter: jest.fn(),
  unregisterRequestFilter: jest.fn(),
  unregisterResponseFilter: jest.fn()
})

const createFakeShakaPlayer = (engine) => ({
  getNetworkingEngine: jest.fn(() => engine)
})

const createFakePlayback = (shakaPlayer = null) => ({
  constructor: { name: 'DashShakaPlayback' },
  shakaPlayerInstance: shakaPlayer,
  on: jest.fn(),
  off: jest.fn()
})

const createFakeContainer = () => ({
  trigger: jest.fn()
})

describe('ShakaNetworkAdapter', () => {
  let container, adapter, playback, fakeEngine, fakeShakaPlayer

  beforeEach(() => {
    jest.clearAllMocks()
    fakeEngine = createFakeNetworkEngine()
    fakeShakaPlayer = createFakeShakaPlayer(fakeEngine)
    playback = createFakePlayback(fakeShakaPlayer)
    container = createFakeContainer()
    adapter = new ShakaNetworkAdapter(playback, container)
  })

  afterEach(() => {
    adapter.destroy()
  })

  // ─── isSupported ────────────────────────────────────────────────────────────

  describe('isSupported', () => {
    it('returns true for DashShakaPlayback', () => {
      expect(ShakaNetworkAdapter.isSupported({ constructor: { name: 'DashShakaPlayback' } })).toBe(true)
    })

    it('returns true for a generic Shaka playback engine', () => {
      expect(ShakaNetworkAdapter.isSupported({ constructor: { name: 'ShakaPlayer' } })).toBe(true)
    })

    it('returns false for unrelated playback engines', () => {
      expect(ShakaNetworkAdapter.isSupported({ constructor: { name: 'HlsPlayback' } })).toBe(false)
    })

    it('returns false when playback is null', () => {
      expect(ShakaNetworkAdapter.isSupported(null)).toBe(false)
    })
  })

  // ─── name ───────────────────────────────────────────────────────────────────

  describe('name', () => {
    it('returns the correct static name', () => {
      expect(ShakaNetworkAdapter.name).toBe('shaka_network_adapter')
    })
  })

  // ─── lifecycle ──────────────────────────────────────────────────────────────

  describe('lifecycle', () => {
    it('attaches filters synchronously when shakaPlayerInstance is already available', () => {
      adapter.bind()

      expect(fakeEngine.registerRequestFilter).toHaveBeenCalledWith(expect.any(Function))
      expect(fakeEngine.registerResponseFilter).toHaveBeenCalledWith(expect.any(Function))
    })

    it('listens for shaka:ready when shakaPlayerInstance is not yet available', () => {
      playback.shakaPlayerInstance = null
      const lateAdapter = new ShakaNetworkAdapter(playback, container)

      lateAdapter.bind()

      expect(playback.on).toHaveBeenCalledWith('shaka:ready', expect.any(Function))
      lateAdapter.destroy()
    })

    it('attaches filters after shaka:ready fires', () => {
      playback.shakaPlayerInstance = null
      const lateAdapter = new ShakaNetworkAdapter(playback, container)
      lateAdapter.bind()

      // Simulate the event firing with the instance now available
      playback.shakaPlayerInstance = fakeShakaPlayer
      const [, readyCb] = playback.on.mock.calls.find(([evt]) => evt === 'shaka:ready')
      readyCb()

      expect(fakeEngine.registerRequestFilter).toHaveBeenCalledWith(expect.any(Function))
      expect(fakeEngine.registerResponseFilter).toHaveBeenCalledWith(expect.any(Function))
      lateAdapter.destroy()
    })

    it('unregisters the shaka:ready listener after a successful late bind', () => {
      playback.shakaPlayerInstance = null
      const lateAdapter = new ShakaNetworkAdapter(playback, container)
      lateAdapter.bind()

      playback.shakaPlayerInstance = fakeShakaPlayer
      const [, readyCb] = playback.on.mock.calls.find(([evt]) => evt === 'shaka:ready')
      readyCb()

      expect(playback.off).toHaveBeenCalledWith('shaka:ready', readyCb)
      lateAdapter.destroy()
    })

    it('unregisters filters on destroy', () => {
      adapter.bind()
      adapter.destroy()

      expect(fakeEngine.unregisterRequestFilter).toHaveBeenCalled()
      expect(fakeEngine.unregisterResponseFilter).toHaveBeenCalled()
    })

    it('clears pending requests on destroy', () => {
      adapter.bind()
      adapter.pendingRequests.set('https://example.com/segment.mp4', [{ id: 'test', startT: 0 }])

      adapter.destroy()

      expect(adapter.pendingRequests.size).toBe(0)
    })

    it('does nothing on destroy when shakaPlayer was never set', () => {
      // Should not throw
      expect(() => adapter.destroy()).not.toThrow()
    })
  })

  // ─── requestFilter ──────────────────────────────────────────────────────────

  describe('requestFilter', () => {
    beforeEach(() => adapter.bind())

    it('emits CONTAINER_TELEMETRY_REQUEST_START via emitTelemetry', () => {
      adapter.requestFilter(1, { uris: ['https://example.com/seg-001.mp4'] })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        TelemetryEvents.REQUEST_START,
        expect.objectContaining({ kind: 'segment' }),
        TELEMETRY_SOURCE_NETWORK
      )
    })

    it('emits kind=segment for Shaka type 1', () => {
      adapter.requestFilter(1, { uris: ['https://example.com/seg.mp4'] })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.kind).toBe('segment')
    })

    it('emits kind=manifest for Shaka type 0', () => {
      adapter.requestFilter(0, { uris: ['https://example.com/manifest.mpd'] })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.kind).toBe('manifest')
    })

    it('emits kind=license for Shaka type 2', () => {
      adapter.requestFilter(2, { uris: ['https://example.com/license'] })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.kind).toBe('license')
    })

    it('emits kind=unknown for unrecognized Shaka types', () => {
      adapter.requestFilter(99, { uris: ['https://example.com/unknown'] })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.kind).toBe('unknown')
    })

    it('tracks the pending request in pendingRequests', () => {
      const uri = 'https://example.com/seg-001.mp4'
      adapter.requestFilter(1, { uris: [uri] })

      expect(adapter.pendingRequests.get(uri)).toHaveLength(1)
    })

    it('tracks concurrent requests to the same URI in order', () => {
      const uri = 'https://example.com/seg-001.mp4'

      adapter.requestFilter(1, { uris: [uri] })
      adapter.requestFilter(1, { uris: [uri] })

      const queue = adapter.pendingRequests.get(uri)
      expect(queue).toHaveLength(2)
    })
  })

  // ─── responseFilter ─────────────────────────────────────────────────────────

  describe('responseFilter', () => {
    let requestFilter, responseFilter

    beforeEach(() => {
      adapter.bind()
      requestFilter = adapter.requestFilter.bind(adapter)
      responseFilter = adapter.responseFilter.bind(adapter)
    })

    it('emits CONTAINER_TELEMETRY_REQUEST_END via emitTelemetry', () => {
      const uri = 'https://example.com/seg-001.mp4'
      requestFilter(1, { uris: [uri] })
      jest.clearAllMocks()

      responseFilter(1, { uri, data: new ArrayBuffer(2048) })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        TelemetryEvents.REQUEST_END,
        expect.objectContaining({ bytes: 2048 }),
        TELEMETRY_SOURCE_NETWORK
      )
    })

    it('emits bytes equal to response data byteLength', () => {
      const uri = 'https://example.com/seg-001.mp4'
      requestFilter(1, { uris: [uri] })
      jest.clearAllMocks()

      responseFilter(1, { uri, data: new ArrayBuffer(2048) })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.bytes).toBe(2048)
    })

    it('emits durationMs >= 0', () => {
      const uri = 'https://example.com/seg-001.mp4'
      requestFilter(1, { uris: [uri] })
      jest.clearAllMocks()

      responseFilter(1, { uri, data: new ArrayBuffer(512) })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.durationMs).toBeGreaterThanOrEqual(0)
    })

    it('clears the pending entry after a matched response', () => {
      const uri = 'https://example.com/seg-001.mp4'
      requestFilter(1, { uris: [uri] })
      responseFilter(1, { uri, data: new ArrayBuffer(512) })

      expect(adapter.pendingRequests.size).toBe(0)
    })

    it('emits bytes=0 when response data is null', () => {
      const uri = 'https://example.com/seg-001.mp4'
      requestFilter(1, { uris: [uri] })
      jest.clearAllMocks()

      responseFilter(1, { uri, data: null })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.bytes).toBe(0)
    })

    it('includes throughputMbps in the payload', () => {
      const uri = 'https://example.com/seg-001.mp4'
      requestFilter(1, { uris: [uri] })
      jest.clearAllMocks()

      responseFilter(1, { uri, data: new ArrayBuffer(2048) })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(typeof data.throughputMbps).toBe('number')
      expect(data.throughputMbps).toBeGreaterThanOrEqual(0)
    })
  })
})
