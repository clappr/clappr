jest.mock('../utils', () => ({
  emitTelemetry: jest.fn(),
  calculateThroughput: jest.fn((bytes, ms) => (ms > 0 ? (bytes * 8) / (ms * 1000) : 0)),
  sanitizeLicenseUri: jest.requireActual('../utils').sanitizeLicenseUri,
  parseVideoCodec: jest.requireActual('../utils').parseVideoCodec,
  parseAudioCodec: jest.requireActual('../utils').parseAudioCodec
}))

import ShakaNetworkAdapter from './shaka_network_adapter'
import { emitTelemetry } from '../utils'
import { EVENT_TYPES, TELEMETRY_SOURCES } from '../utils/constants'

const createFakeNetworkEngine = () => ({
  registerRequestFilter: jest.fn(),
  registerResponseFilter: jest.fn(),
  unregisterRequestFilter: jest.fn(),
  unregisterResponseFilter: jest.fn()
})

const createFakeShakaPlayer = (engine) => ({
  getNetworkingEngine: jest.fn(() => engine),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  keySystem: jest.fn(() => 'com.widevine.alpha'),
  drmInfo: jest.fn(() => ({ licenseServerUri: 'https://drm.example.com/wvs' })),
  getExpiration: jest.fn(() => Infinity),
  getStats: jest.fn(() => ({ estimatedBandwidth: 5000000 })),
  getVariantTracks: jest.fn(() => [])
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
      expect(ShakaNetworkAdapter.isSupported({ name: 'dash_shaka_playback' })).toBe(true)
    })

    it('returns false for unrelated playback engines', () => {
      expect(ShakaNetworkAdapter.isSupported({ name: 'hls_playback' })).toBe(false)
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
      adapter.requestFilter(1, { uris: ['https://example.com/seg.ts'] })

      adapter.destroy()

      expect(adapter.pendingRequests.size).toBe(0)
    })

    it('clears pendingRequests when the error event fires on shakaPlayer', () => {
      adapter.bind()
      adapter.requestFilter(1, { uris: ['https://example.com/seg.ts'] })

      const [, errorCb] = fakeShakaPlayer.addEventListener.mock.calls.find(([evt]) => evt === 'error')
      errorCb()

      expect(adapter.pendingRequests.size).toBe(0)
    })

    it('does not throw when getNetworkingEngine returns null', () => {
      fakeShakaPlayer.getNetworkingEngine.mockReturnValue(null)

      expect(() => adapter.bind()).not.toThrow()
    })

    it('retries binding by listening for shaka:ready when networkEngine was unavailable on first bind()', () => {
      fakeShakaPlayer.getNetworkingEngine.mockReturnValue(null)
      adapter.bind()

      playback.shakaPlayerInstance = null
      adapter.bind()

      const readyCalls = playback.on.mock.calls.filter(([evt]) => evt === 'shaka:ready')
      expect(readyCalls).toHaveLength(1)
    })

    it('attaches filters when shaka:ready fires after networking engine becomes available', () => {
      fakeShakaPlayer.getNetworkingEngine.mockReturnValue(null)
      adapter.bind()

      fakeShakaPlayer.getNetworkingEngine.mockReturnValue(fakeEngine)
      const [, readyCb] = playback.on.mock.calls.find(([evt]) => evt === 'shaka:ready')
      readyCb()

      expect(fakeEngine.registerRequestFilter).toHaveBeenCalledTimes(1)
      expect(fakeEngine.registerResponseFilter).toHaveBeenCalledTimes(1)
    })

    it('does not attach filters when shakaPlayerInstance is missing on shaka:ready', () => {
      playback.shakaPlayerInstance = null
      const lateAdapter = new ShakaNetworkAdapter(playback, container)
      lateAdapter.bind()

      const [, readyCb] = playback.on.mock.calls.find(([evt]) => evt === 'shaka:ready')
      readyCb()

      expect(fakeEngine.registerRequestFilter).not.toHaveBeenCalled()
      lateAdapter.destroy()
    })

    it('does nothing on destroy when shakaPlayer was never set', () => {
      expect(() => adapter.destroy()).not.toThrow()
    })

    it('does not register filters twice when bind() is called multiple times', () => {
      adapter.bind()
      adapter.bind()

      expect(fakeEngine.registerRequestFilter).toHaveBeenCalledTimes(1)
      expect(fakeEngine.registerResponseFilter).toHaveBeenCalledTimes(1)
    })

    it('does not register filters again when shakaPlayer is present, attachFilters fails, and playback.on is unavailable', () => {
      fakeShakaPlayer.getNetworkingEngine.mockReturnValue(null)
      playback.on = undefined
      const noListenerAdapter = new ShakaNetworkAdapter(playback, container)

      noListenerAdapter.bind()
      noListenerAdapter.bind()

      expect(fakeEngine.registerRequestFilter).not.toHaveBeenCalled()
      expect(fakeEngine.registerResponseFilter).not.toHaveBeenCalled()
      noListenerAdapter.destroy()
    })

    it('does not re-register the shaka:ready listener when bind() is called multiple times while shakaPlayerInstance is unavailable', () => {
      playback.shakaPlayerInstance = null
      const lateAdapter = new ShakaNetworkAdapter(playback, container)

      lateAdapter.bind()
      lateAdapter.bind()

      const readyCalls = playback.on.mock.calls.filter(([evt]) => evt === 'shaka:ready')
      expect(readyCalls).toHaveLength(1)
      lateAdapter.destroy()
    })

    it('allows re-binding after destroy', () => {
      adapter.bind()
      adapter.destroy()

      playback.shakaPlayerInstance = fakeShakaPlayer
      adapter = new ShakaNetworkAdapter(playback, container)
      adapter.bind()

      expect(fakeEngine.registerRequestFilter).toHaveBeenCalledTimes(2)
    })
  })

  // ─── variant changed / BITRATE_CHANGE ────────────────────────────────────────

  describe('variantchanged / BITRATE_CHANGE', () => {
    it('registers variantchanged listener on attachFilters', () => {
      adapter.bind()

      expect(fakeShakaPlayer.addEventListener)
        .toHaveBeenCalledWith('variantchanged', expect.any(Function))
    })

    it('emits BITRATE_CHANGE with previous and current when variantchanged fires', () => {
      adapter.bind()
      jest.clearAllMocks()

      adapter._onVariantChanged({
        oldTrack: { bandwidth: 1200000, width: 1280, height: 720 },
        newTrack: { bandwidth: 2400000, width: 1920, height: 1080 }
      })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.BITRATE_CHANGE,
        {
          previous: { bitrate: 1200000, width: 1280, height: 720 },
          current: { bitrate: 2400000, width: 1920, height: 1080 }
        },
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('emits null bitrate and null dimensions when tracks are missing', () => {
      adapter.bind()
      jest.clearAllMocks()

      adapter._onVariantChanged({})

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.current.bitrate).toBeNull()
      expect(data.current.width).toBeNull()
      expect(data.current.height).toBeNull()
      expect(data.previous.bitrate).toBeNull()
      expect(data.previous.width).toBeNull()
      expect(data.previous.height).toBeNull()
    })

    it('emits null fields for missing track when only one track is present', () => {
      adapter.bind()
      jest.clearAllMocks()

      adapter._onVariantChanged({ newTrack: { bandwidth: 3000000, width: 1920, height: 1080 } })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.current.bitrate).toBe(3000000)
      expect(data.current.width).toBe(1920)
      expect(data.current.height).toBe(1080)
      expect(data.previous.bitrate).toBeNull()
      expect(data.previous.width).toBeNull()
      expect(data.previous.height).toBeNull()
    })

    it('removes variantchanged listener on destroy', () => {
      adapter.bind()
      adapter.destroy()

      expect(fakeShakaPlayer.removeEventListener)
        .toHaveBeenCalledWith('variantchanged', expect.any(Function))
    })

    it('removes variantchanged listener even when networkEngine is null on destroy', () => {
      adapter.bind()
      fakeShakaPlayer.getNetworkingEngine.mockReturnValue(null)
      adapter.destroy()

      expect(fakeShakaPlayer.removeEventListener)
        .toHaveBeenCalledWith('variantchanged', expect.any(Function))
    })

    it('emits BITRATE_INIT with active track data on attachFilters', () => {
      fakeShakaPlayer.getVariantTracks = jest.fn(() => [
        { active: false, bandwidth: 800000, width: 640, height: 360 },
        { active: true, bandwidth: 2400000, width: 1920, height: 1080 }
      ])
      adapter.bind()

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.BITRATE_INIT,
        { current: { bitrate: 2400000, width: 1920, height: 1080 } },
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('does not emit BITRATE_INIT when no active track', () => {
      fakeShakaPlayer.getVariantTracks = jest.fn(() => [
        { active: false, bandwidth: 800000, width: 640, height: 360 }
      ])
      adapter.bind()

      const initCall = emitTelemetry.mock.calls.find(([, type]) => type === EVENT_TYPES.BITRATE_INIT)
      expect(initCall).toBeUndefined()
    })

    it('registers trackschanged listener on attachFilters', () => {
      adapter.bind()

      expect(fakeShakaPlayer.addEventListener)
        .toHaveBeenCalledWith('trackschanged', expect.any(Function))
    })

    it('emits BITRATE_INIT when trackschanged fires (manifest loaded after bind)', () => {
      fakeShakaPlayer.getVariantTracks.mockReturnValue([])
      adapter.bind()

      const [, cb] = fakeShakaPlayer.addEventListener.mock.calls.find(([evt]) => evt === 'trackschanged')
      jest.clearAllMocks()

      fakeShakaPlayer.getVariantTracks.mockReturnValue([
        { id: 1, active: true, bandwidth: 1500000, width: 1280, height: 720 }
      ])
      cb()

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.BITRATE_INIT,
        { current: { bitrate: 1500000, width: 1280, height: 720 } },
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('removes trackschanged listener on destroy', () => {
      adapter.bind()
      adapter.destroy()

      expect(fakeShakaPlayer.removeEventListener)
        .toHaveBeenCalledWith('trackschanged', expect.any(Function))
    })

    it('registers variantchanged listener when attachFilters runs via shaka:ready', () => {
      playback.shakaPlayerInstance = null
      const lateAdapter = new ShakaNetworkAdapter(playback, container)
      lateAdapter.bind()

      playback.shakaPlayerInstance = fakeShakaPlayer
      const [, readyCb] = playback.on.mock.calls.find(([evt]) => evt === 'shaka:ready')
      readyCb()

      expect(fakeShakaPlayer.addEventListener)
        .toHaveBeenCalledWith('variantchanged', expect.any(Function))
      lateAdapter.destroy()
    })
  })

  // ─── DRM events ─────────────────────────────────────────────────────────────

  describe('DRM events', () => {
    it('registers drmsessionupdate listener on attachFilters', () => {
      adapter.bind()

      expect(fakeShakaPlayer.addEventListener)
        .toHaveBeenCalledWith('drmsessionupdate', expect.any(Function))
    })

    it('registers expirationupdated listener on attachFilters', () => {
      adapter.bind()

      expect(fakeShakaPlayer.addEventListener)
        .toHaveBeenCalledWith('expirationupdated', expect.any(Function))
    })

    it('emits DRM_SESSION_UPDATE with keySystem, licenseServerOrigin and licenseServerParams', () => {
      fakeShakaPlayer.drmInfo.mockReturnValueOnce({ licenseServerUri: 'https://drm.example.com/wvs?deviceId=abc&token=xyz' })
      adapter.bind()
      jest.clearAllMocks()

      adapter._onDrmSessionUpdate()

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.DRM_SESSION_UPDATE,
        {
          keySystem: 'com.widevine.alpha',
          licenseServerOrigin: 'https://drm.example.com',
          licenseServerParams: ['deviceId', 'token']
        },
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('emits licenseServerOrigin=null and empty params when drmInfo returns null', () => {
      fakeShakaPlayer.drmInfo.mockReturnValueOnce(null)
      adapter.bind()
      jest.clearAllMocks()

      adapter._onDrmSessionUpdate()

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.licenseServerOrigin).toBeNull()
      expect(data.licenseServerParams).toEqual([])
    })

    it('emits DRM_EXPIRATION_UPDATED with expirationTime from getExpiration()', () => {
      const expiration = Date.now() + 60000
      fakeShakaPlayer.getExpiration.mockReturnValueOnce(expiration)
      adapter.bind()
      jest.clearAllMocks()

      adapter._onExpirationUpdated()

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.expirationTime).toBe(expiration)
    })

    it('emits expirationTime=Infinity when license has no expiration', () => {
      adapter.bind()
      jest.clearAllMocks()

      adapter._onExpirationUpdated()

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.expirationTime).toBe(Infinity)
    })

    it('does not emit DRM_SESSION_UPDATE when data is identical to previous emission', () => {
      adapter.bind()
      jest.clearAllMocks()

      adapter._onDrmSessionUpdate()
      adapter._onDrmSessionUpdate()

      expect(emitTelemetry).toHaveBeenCalledTimes(1)
    })

    it('emits DRM_SESSION_UPDATE again when keySystem changes', () => {
      adapter.bind()
      jest.clearAllMocks()

      adapter._onDrmSessionUpdate()
      fakeShakaPlayer.keySystem.mockReturnValueOnce('com.apple.fps')
      adapter._onDrmSessionUpdate()

      expect(emitTelemetry).toHaveBeenCalledTimes(2)
    })

    it('removes drmsessionupdate listener on destroy', () => {
      adapter.bind()
      adapter.destroy()

      expect(fakeShakaPlayer.removeEventListener)
        .toHaveBeenCalledWith('drmsessionupdate', expect.any(Function))
    })

    it('removes expirationupdated listener on destroy', () => {
      adapter.bind()
      adapter.destroy()

      expect(fakeShakaPlayer.removeEventListener)
        .toHaveBeenCalledWith('expirationupdated', expect.any(Function))
    })
  })

  // ─── requestFilter ──────────────────────────────────────────────────────────

  describe('requestFilter', () => {
    beforeEach(() => {
      adapter.bind()
      jest.clearAllMocks()
    })

    it('emits CONTAINER_TELEMETRY_REQUEST_START via emitTelemetry', () => {
      adapter.requestFilter(1, {})

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_START,
        expect.objectContaining({ kind: 'segment' }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('emits kind=segment for Shaka type 1', () => {
      adapter.requestFilter(1, {})

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.kind).toBe('segment')
    })

    it('emits kind=manifest for Shaka type 0', () => {
      adapter.requestFilter(0, {})

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.kind).toBe('manifest')
    })

    it('emits kind=license for Shaka type 2', () => {
      adapter.requestFilter(2, {})

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.kind).toBe('license')
    })

    it('emits kind=unknown for unrecognized Shaka types', () => {
      adapter.requestFilter(99, {})

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.kind).toBe('unknown')
    })

    it('tracks the pending request in pendingRequests', () => {
      adapter.requestFilter(1, { uris: ['https://example.com/seg.ts'] })

      expect(adapter.pendingRequests.size).toBe(1)
    })

    it('overwrites startT for a second request to the same URI', () => {
      jest.useFakeTimers()
      const uri = 'https://example.com/seg.ts'

      adapter.requestFilter(1, { uris: [uri] })
      const first = adapter.pendingRequests.get(uri)

      jest.advanceTimersByTime(50)
      adapter.requestFilter(1, { uris: [uri] })
      const second = adapter.pendingRequests.get(uri)

      expect(adapter.pendingRequests.size).toBe(1)
      expect(second).toBeGreaterThan(first)

      jest.useRealTimers()
    })

    it('does not track requests without uris', () => {
      adapter.requestFilter(1, {})

      expect(adapter.pendingRequests.size).toBe(0)
    })
  })

  // ─── responseFilter ─────────────────────────────────────────────────────────

  describe('responseFilter', () => {
    let requestFilter, responseFilter

    beforeEach(() => {
      adapter.bind()
      jest.clearAllMocks()
      requestFilter = adapter.requestFilter.bind(adapter)
      responseFilter = adapter.responseFilter.bind(adapter)
    })

    const makeRequest = (uri = 'https://example.com/seg.ts') => ({ uris: [uri] })
    const makeResponse = (uri = 'https://example.com/seg.ts', data = new ArrayBuffer(2048)) => ({
      originalUri: uri,
      data
    })

    it('emits CONTAINER_TELEMETRY_REQUEST_END via emitTelemetry', () => {
      requestFilter(1, makeRequest())
      jest.clearAllMocks()

      responseFilter(1, makeResponse())

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_END,
        expect.objectContaining({ bytes: 2048 }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('emits bytes equal to response data byteLength', () => {
      requestFilter(1, makeRequest())
      jest.clearAllMocks()

      responseFilter(1, makeResponse())

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.bytes).toBe(2048)
    })

    it('emits durationMs >= 0', () => {
      requestFilter(1, makeRequest())
      jest.clearAllMocks()

      responseFilter(1, makeResponse('https://example.com/seg.ts', new ArrayBuffer(512)))

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.durationMs).toBeGreaterThanOrEqual(0)
    })

    it('clears the pending entry after a matched response', () => {
      requestFilter(1, makeRequest())
      responseFilter(1, makeResponse('https://example.com/seg.ts', new ArrayBuffer(512)))

      expect(adapter.pendingRequests.size).toBe(0)
    })

    it('emits bytes=0 when response data is null', () => {
      requestFilter(1, makeRequest())
      jest.clearAllMocks()

      responseFilter(1, makeResponse('https://example.com/seg.ts', null))

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.bytes).toBe(0)
    })

    it('includes throughputMbps in the payload', () => {
      requestFilter(1, makeRequest())
      jest.clearAllMocks()

      responseFilter(1, makeResponse())

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(typeof data.throughputMbps).toBe('number')
      expect(data.throughputMbps).toBeGreaterThanOrEqual(0)
    })

    it('matches response using response.uri when originalUri is absent', () => {
      const uri = 'https://example.com/seg.ts'
      requestFilter(1, makeRequest(uri))
      responseFilter(1, { uri, data: new ArrayBuffer(512) })

      expect(adapter.pendingRequests.size).toBe(0)
    })

    it('segment response includes chunk with seq and variantId', () => {
      requestFilter(1, makeRequest())
      jest.clearAllMocks()

      responseFilter(1, makeResponse())

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.chunk).toEqual({ seq: expect.any(Number), variantId: 0, start: 0, dur: 0 })
    })

    it('non-segment response has chunk=undefined', () => {
      requestFilter(0, makeRequest())
      jest.clearAllMocks()

      responseFilter(0, makeResponse())

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.chunk).toBeUndefined()
    })

    it('seq increments across consecutive segment responses', () => {
      responseFilter(1, makeResponse('https://example.com/a.ts'))
      responseFilter(1, makeResponse('https://example.com/b.ts'))

      const calls = emitTelemetry.mock.calls
      expect(calls[0][2].chunk.seq).toBe(0)
      expect(calls[1][2].chunk.seq).toBe(1)
    })

    it('seq resets to 0 after destroy and re-bind', () => {
      responseFilter(1, makeResponse())
      adapter.destroy()

      playback.shakaPlayerInstance = fakeShakaPlayer
      adapter = new ShakaNetworkAdapter(playback, container)
      adapter.bind()
      jest.clearAllMocks()
      adapter.responseFilter(1, makeResponse())

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.chunk.seq).toBe(0)
    })
  })

  // ─── variant index caching ───────────────────────────────────────────────────

  describe('variant index caching', () => {
    it('initializes _currentVariantIdx=0 before any variant event', () => {
      expect(adapter._currentVariantIdx).toBe(0)
    })

    it('sets _currentVariantIdx from the active track on attachFilters', () => {
      fakeShakaPlayer.getVariantTracks.mockReturnValue([
        { id: 10, active: false, bandwidth: 800000 },
        { id: 11, active: true, bandwidth: 1500000 },
        { id: 12, active: false, bandwidth: 3000000 }
      ])
      adapter.bind()

      expect(adapter._currentVariantIdx).toBe(1)
    })

    it('updates _currentVariantIdx when variantchanged fires', () => {
      fakeShakaPlayer.getVariantTracks.mockReturnValue([
        { id: 10, active: false, bandwidth: 800000 },
        { id: 11, active: false, bandwidth: 1500000 },
        { id: 12, active: true, bandwidth: 3000000 }
      ])
      adapter.bind()

      adapter._onVariantChanged({ newTrack: { id: 12, bandwidth: 3000000 } })

      expect(adapter._currentVariantIdx).toBe(2)
    })

    it('keeps _currentVariantIdx=0 when variantchanged newTrack has no id', () => {
      adapter.bind()
      adapter._onVariantChanged({ newTrack: {} })

      expect(adapter._currentVariantIdx).toBe(0)
    })

    it('resets _currentVariantIdx to 0 on destroy', () => {
      fakeShakaPlayer.getVariantTracks.mockReturnValue([
        { id: 10, active: false, bandwidth: 800000 },
        { id: 11, active: true, bandwidth: 3000000 }
      ])
      adapter.bind()
      adapter.destroy()

      expect(adapter._currentVariantIdx).toBe(0)
    })
  })

  // ─── STREAM_INFO ─────────────────────────────────────────────────────────────

  describe('STREAM_INFO', () => {
    it('emits STREAM_INFO on trackschanged with parsed fields', () => {
      fakeShakaPlayer.getVariantTracks.mockReturnValue([])
      adapter.bind()

      const [, cb] = fakeShakaPlayer.addEventListener.mock.calls.find(([evt]) => evt === 'trackschanged')
      jest.clearAllMocks()

      fakeShakaPlayer.getVariantTracks.mockReturnValue([
        { id: 1, active: true, bandwidth: 2000000, videoCodec: 'hvc1.1.6.L93', audioCodec: 'ec-3' }
      ])
      cb()

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.STREAM_INFO,
        {
          container: 'DASH',
          videoCodec: 'H.265',
          audioCodec: 'DD+',
          levelsCount: 1
        },
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('emits STREAM_INFO on variantchanged with updated active track', () => {
      fakeShakaPlayer.getVariantTracks.mockReturnValue([
        { id: 1, active: false, bandwidth: 800000, videoCodec: 'avc1.42001f', audioCodec: 'mp4a.40.2' },
        { id: 2, active: true, bandwidth: 2000000, videoCodec: 'av01.0.04M.08', audioCodec: 'opus' }
      ])
      adapter.bind()
      jest.clearAllMocks()

      fakeShakaPlayer.getVariantTracks.mockReturnValue([
        { id: 1, active: false, bandwidth: 800000, videoCodec: 'avc1.42001f', audioCodec: 'mp4a.40.2' },
        { id: 2, active: true, bandwidth: 2000000, videoCodec: 'av01.0.04M.08', audioCodec: 'opus' }
      ])
      adapter._onVariantChanged({ oldTrack: { id: 1, bandwidth: 800000 }, newTrack: { id: 2, bandwidth: 2000000 } })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.STREAM_INFO,
        {
          container: 'DASH',
          videoCodec: 'AV1',
          audioCodec: 'Opus',
          levelsCount: 2
        },
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('does not emit STREAM_INFO when no active track is found', () => {
      fakeShakaPlayer.getVariantTracks.mockReturnValue([
        { id: 1, active: false, bandwidth: 800000 }
      ])
      adapter.bind()
      jest.clearAllMocks()

      adapter._emitStreamInfo()

      const call = emitTelemetry.mock.calls.find(([, type]) => type === EVENT_TYPES.STREAM_INFO)
      expect(call).toBeUndefined()
    })
  })
})
