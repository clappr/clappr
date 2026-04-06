jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  emitTelemetry: jest.fn()
}))

import HlsNetworkAdapter, { HLS_EVENTS } from './hls_network_adapter'
import { emitTelemetry } from '../utils'
import { EVENT_TYPES, TELEMETRY_SOURCES } from '../utils/constants'
import { Events } from '@clappr/core'

const HLS_ERROR_TYPES = {
  NETWORK_ERROR: 'networkError',
  MEDIA_ERROR: 'mediaError'
}

const createFakeHls = (levels = []) => ({
  on: jest.fn(),
  off: jest.fn(),
  levels
})

const createFakePlayback = (hls = null) => ({
  name: 'hls',
  _hls: hls
})

const createFakeContainer = () => ({
  trigger: jest.fn(),
  on: jest.fn(),
  off: jest.fn()
})

const makeFrag = ({ sn = 1, level = 0, type = 'main', url = 'http://ex.com/seg.ts' } = {}) => ({
  sn,
  level,
  type,
  url,
  decryptdata: null,
  stats: { loading: { start: 100, end: 300 }, total: 2048 }
})

const getHlsHandler = (fakeHls, eventName) => {
  const call = fakeHls.on.mock.calls.find(([evt]) => evt === eventName)
  return call ? call[1] : null
}

describe('HlsNetworkAdapter', () => {
  let container, adapter, playback, fakeHls

  beforeEach(() => {
    jest.clearAllMocks()
    fakeHls = createFakeHls()
    playback = createFakePlayback(fakeHls)
    container = createFakeContainer()
    adapter = new HlsNetworkAdapter(playback, container)
  })

  afterEach(() => {
    adapter.destroy()
  })

  // ─── isSupported ────────────────────────────────────────────────────────────

  describe('isSupported', () => {
    it('returns true for hls playback', () => {
      expect(HlsNetworkAdapter.isSupported({ name: 'hls' })).toBe(true)
    })

    it('returns false for unrelated playback engines', () => {
      expect(HlsNetworkAdapter.isSupported({ name: 'dash_shaka_playback' })).toBe(false)
    })

    it('returns false when playback is null', () => {
      expect(HlsNetworkAdapter.isSupported(null)).toBe(false)
    })
  })

  // ─── name ───────────────────────────────────────────────────────────────────

  describe('name', () => {
    it('returns the correct static name', () => {
      expect(HlsNetworkAdapter.name).toBe('hls_network_adapter')
    })
  })

  // ─── lifecycle ──────────────────────────────────────────────────────────────

  describe('lifecycle', () => {
    it('attaches all HLS.js event listeners on bind()', () => {
      adapter.bind()

      expect(fakeHls.on).toHaveBeenCalledWith(HLS_EVENTS.FRAG_LOADING, expect.any(Function))
      expect(fakeHls.on).toHaveBeenCalledWith(HLS_EVENTS.FRAG_LOADED, expect.any(Function))
      expect(fakeHls.on).toHaveBeenCalledWith(HLS_EVENTS.MANIFEST_LOADING, expect.any(Function))
      expect(fakeHls.on).toHaveBeenCalledWith(HLS_EVENTS.MANIFEST_LOADED, expect.any(Function))
      expect(fakeHls.on).toHaveBeenCalledWith(HLS_EVENTS.KEY_LOADING, expect.any(Function))
      expect(fakeHls.on).toHaveBeenCalledWith(HLS_EVENTS.KEY_LOADED, expect.any(Function))
      expect(fakeHls.on).toHaveBeenCalledWith(HLS_EVENTS.LEVEL_SWITCHED, expect.any(Function))
      expect(fakeHls.on).toHaveBeenCalledWith(HLS_EVENTS.ERROR, expect.any(Function))
    })

    it('does not register listeners twice when bind() is called multiple times', () => {
      adapter.bind()
      adapter.bind()

      const fragLoadingCalls = fakeHls.on.mock.calls.filter(
        ([evt]) => evt === HLS_EVENTS.FRAG_LOADING
      )
      expect(fragLoadingCalls).toHaveLength(1)
    })

    it('does not throw when _hls is not available', () => {
      playback._hls = null
      const noHlsAdapter = new HlsNetworkAdapter(playback, container)

      expect(() => noHlsAdapter.bind()).not.toThrow()
      noHlsAdapter.destroy()
    })

    it('registers CONTAINER_PLAY listener when _hls is not available on bind()', () => {
      playback._hls = null
      const lateAdapter = new HlsNetworkAdapter(playback, container)
      lateAdapter.bind()

      expect(container.on).toHaveBeenCalledWith(Events.CONTAINER_PLAY, expect.any(Function))
      lateAdapter.destroy()
    })

    it('attaches filters on _onPlay when hls becomes available', () => {
      playback._hls = null
      const lateAdapter = new HlsNetworkAdapter(playback, container)
      lateAdapter.bind()

      const fakeHls2 = createFakeHls()
      playback._hls = fakeHls2
      const onPlayCb = container.on.mock.calls.find(([evt]) => evt === Events.CONTAINER_PLAY)?.[1]
      onPlayCb()

      expect(container.off).toHaveBeenCalledWith(Events.CONTAINER_PLAY, expect.any(Function))
      expect(fakeHls2.on).toHaveBeenCalledWith(HLS_EVENTS.FRAG_LOADING, expect.any(Function))
      lateAdapter.destroy()
    })

    it('detaches all event listeners on destroy', () => {
      adapter.bind()
      adapter.destroy()

      expect(fakeHls.off).toHaveBeenCalledWith(HLS_EVENTS.FRAG_LOADING, expect.any(Function))
      expect(fakeHls.off).toHaveBeenCalledWith(HLS_EVENTS.FRAG_LOADED, expect.any(Function))
      expect(fakeHls.off).toHaveBeenCalledWith(HLS_EVENTS.MANIFEST_LOADING, expect.any(Function))
      expect(fakeHls.off).toHaveBeenCalledWith(HLS_EVENTS.MANIFEST_LOADED, expect.any(Function))
      expect(fakeHls.off).toHaveBeenCalledWith(HLS_EVENTS.KEY_LOADING, expect.any(Function))
      expect(fakeHls.off).toHaveBeenCalledWith(HLS_EVENTS.KEY_LOADED, expect.any(Function))
      expect(fakeHls.off).toHaveBeenCalledWith(HLS_EVENTS.LEVEL_SWITCHED, expect.any(Function))
      expect(fakeHls.off).toHaveBeenCalledWith(HLS_EVENTS.ERROR, expect.any(Function))
    })

    it('clears pending requests on destroy', () => {
      adapter.bind()
      const fragLoadingCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      fragLoadingCb(null, { frag: makeFrag() })

      adapter.destroy()

      expect(adapter.pendingRequests.size).toBe(0)
    })

    it('resets internal state on destroy', () => {
      adapter.bind()
      adapter.destroy()

      expect(adapter.hlsInstance).toBeNull()
      expect(adapter._isBound).toBe(false)
      expect(adapter._previousLevel).toBeNull()
    })

    it('does not throw on destroy when bind() was never called', () => {
      expect(() => adapter.destroy()).not.toThrow()
    })
  })

  // ─── FRAG_LOADING / REQUEST_START ───────────────────────────────────────────

  describe('FRAG_LOADING / REQUEST_START', () => {
    beforeEach(() => adapter.bind())

    it('emits REQUEST_START when a segment fragment starts loading', () => {
      const cb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      cb(null, { frag: makeFrag() })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_START,
        expect.objectContaining({ kind: 'segment' }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('emits kind=init for init segments', () => {
      const cb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      cb(null, { frag: makeFrag({ sn: 'initSegment' }) })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.kind).toBe('init')
    })

    it('emits kind=subtitle for subtitle fragments', () => {
      const cb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      cb(null, { frag: makeFrag({ type: 'subtitle' }) })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.kind).toBe('subtitle')
    })

    it('tracks the pending request in pendingRequests', () => {
      const cb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      cb(null, { frag: makeFrag() })

      expect(adapter.pendingRequests.size).toBe(1)
    })

    it('accumulates pending requests up to limit', () => {
      const cb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      for (let i = 0; i < 10; i++) {
        cb(null, { frag: makeFrag({ sn: i, url: `http://ex.com/seg${i}.ts` }) })
      }

      expect(adapter.pendingRequests.size).toBe(10)
    })

    it('evicts oldest requests when limit exceeded', () => {
      const cb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      for (let i = 0; i < 120; i++) {
        cb(null, { frag: makeFrag({ sn: i, url: `http://ex.com/seg${i}.ts` }) })
      }

      expect(adapter.pendingRequests.size).toBe(100)
    })

    it('emits REQUEST_ERROR for each evicted frag request with kind=unknown and urlHash=null', () => {
      const cb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      for (let i = 0; i < 120; i++) {
        cb(null, { frag: makeFrag({ sn: i, url: `http://ex.com/seg${i}.ts` }) })
      }

      const evictionCalls = emitTelemetry.mock.calls.filter(
        ([, type]) => type === EVENT_TYPES.REQUEST_ERROR
      )
      expect(evictionCalls).toHaveLength(20)
      expect(evictionCalls[0][2]).toEqual({ kind: 'unknown', urlHash: null, details: 'evicted', fatal: false })
    })

    it('emits REQUEST_ERROR with kind and urlHash for evicted manifest/key requests', () => {
      const fragCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      const manifestCb = getHlsHandler(fakeHls, HLS_EVENTS.MANIFEST_LOADING)

      manifestCb(null, { url: 'http://ex.com/playlist.m3u8' })
      for (let i = 0; i < 99; i++) {
        fragCb(null, { frag: makeFrag({ sn: i, url: `http://ex.com/seg${i}.ts` }) })
      }
      jest.clearAllMocks()

      fragCb(null, { frag: makeFrag({ sn: 200, url: 'http://ex.com/seg200.ts' }) })

      const evictionCalls = emitTelemetry.mock.calls.filter(
        ([, type]) => type === EVENT_TYPES.REQUEST_ERROR
      )
      expect(evictionCalls).toHaveLength(20)
      const manifestEviction = evictionCalls.find(([, , payload]) => payload.kind === 'manifest')
      expect(manifestEviction).toBeDefined()
      expect(manifestEviction[2].urlHash).not.toBeNull()
      expect(manifestEviction[2].details).toBe('evicted')
    })
  })

  // ─── FRAG_LOADED / REQUEST_END ───────────────────────────────────────────────

  describe('FRAG_LOADED / REQUEST_END', () => {
    beforeEach(() => adapter.bind())

    it('emits REQUEST_END when a fragment finishes loading', () => {
      const loadingCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      const loadedCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADED)
      const frag = makeFrag()

      loadingCb(null, { frag })
      jest.clearAllMocks()
      loadedCb(null, { frag })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_END,
        expect.objectContaining({ kind: 'segment' }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('uses hls.js stats.loading duration when available', () => {
      const loadingCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      const loadedCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADED)
      const frag = makeFrag()
      frag.stats = { loading: { start: 100, end: 350 }, total: 1024 }

      loadingCb(null, { frag })
      jest.clearAllMocks()
      loadedCb(null, { frag })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.durationMs).toBe(250)
    })

    it('emits bytes from frag.stats.total', () => {
      const loadingCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      const loadedCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADED)
      const frag = makeFrag()
      frag.stats = { loading: { start: 0, end: 100 }, total: 4096 }

      loadingCb(null, { frag })
      jest.clearAllMocks()
      loadedCb(null, { frag })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.bytes).toBe(4096)
    })

    it('includes throughputMbps in the payload', () => {
      const loadingCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      const loadedCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADED)
      const frag = makeFrag()

      loadingCb(null, { frag })
      jest.clearAllMocks()
      loadedCb(null, { frag })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(typeof data.throughputMbps).toBe('number')
    })

    it('removes the pending entry after FRAG_LOADED', () => {
      const loadingCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      const loadedCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADED)
      const frag = makeFrag()

      loadingCb(null, { frag })
      loadedCb(null, { frag })

      expect(adapter.pendingRequests.size).toBe(0)
    })
  })

  // ─── MANIFEST_LOADING / MANIFEST_LOADED ─────────────────────────────────────

  describe('MANIFEST_LOADING / MANIFEST_LOADED', () => {
    beforeEach(() => adapter.bind())

    it('emits REQUEST_START with kind=manifest on MANIFEST_LOADING', () => {
      const cb = getHlsHandler(fakeHls, HLS_EVENTS.MANIFEST_LOADING)
      cb(null, { url: 'http://ex.com/playlist.m3u8' })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_START,
        expect.objectContaining({ kind: 'manifest' }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('emits REQUEST_END with kind=manifest on MANIFEST_LOADED', () => {
      const loadingCb = getHlsHandler(fakeHls, HLS_EVENTS.MANIFEST_LOADING)
      const loadedCb = getHlsHandler(fakeHls, HLS_EVENTS.MANIFEST_LOADED)
      const url = 'http://ex.com/playlist.m3u8'

      loadingCb(null, { url })
      jest.clearAllMocks()
      loadedCb(null, { url, stats: { loading: { start: 0, end: 120 }, total: 512 } })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_END,
        expect.objectContaining({ kind: 'manifest', durationMs: 120, bytes: 512 }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('removes the pending entry after MANIFEST_LOADED', () => {
      const loadingCb = getHlsHandler(fakeHls, HLS_EVENTS.MANIFEST_LOADING)
      const loadedCb = getHlsHandler(fakeHls, HLS_EVENTS.MANIFEST_LOADED)
      const url = 'http://ex.com/playlist.m3u8'

      loadingCb(null, { url })
      loadedCb(null, { url, stats: { loading: { start: 0, end: 100 }, total: 256 } })

      expect(adapter.pendingRequests.size).toBe(0)
    })
  })

  // ─── KEY_LOADING / KEY_LOADED ────────────────────────────────────────────────

  describe('KEY_LOADING / KEY_LOADED', () => {
    beforeEach(() => adapter.bind())

    it('emits REQUEST_START with kind=key on KEY_LOADING', () => {
      const cb = getHlsHandler(fakeHls, HLS_EVENTS.KEY_LOADING)
      const frag = { decryptdata: { uri: 'http://ex.com/key' } }

      cb(null, { frag })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_START,
        expect.objectContaining({ kind: 'key' }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('emits REQUEST_END with kind=key on KEY_LOADED', () => {
      const loadingCb = getHlsHandler(fakeHls, HLS_EVENTS.KEY_LOADING)
      const loadedCb = getHlsHandler(fakeHls, HLS_EVENTS.KEY_LOADED)
      const frag = { decryptdata: { uri: 'http://ex.com/key' } }

      loadingCb(null, { frag })
      jest.clearAllMocks()
      loadedCb(null, { frag })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_END,
        expect.objectContaining({ kind: 'key' }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('uses frag.stats.loading duration when available on KEY_LOADED', () => {
      const loadingCb = getHlsHandler(fakeHls, HLS_EVENTS.KEY_LOADING)
      const loadedCb = getHlsHandler(fakeHls, HLS_EVENTS.KEY_LOADED)
      const frag = { decryptdata: { uri: 'http://ex.com/key' }, stats: { loading: { start: 100, end: 400 } } }

      loadingCb(null, { frag })
      jest.clearAllMocks()
      loadedCb(null, { frag })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_END,
        expect.objectContaining({ durationMs: 300 }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('does not emit or throw when decryptdata uri is missing', () => {
      const cb = getHlsHandler(fakeHls, HLS_EVENTS.KEY_LOADING)
      const frag = { decryptdata: null }

      expect(() => cb(null, { frag })).not.toThrow()
      expect(emitTelemetry).not.toHaveBeenCalled()
    })

    it('does not emit REQUEST_END on KEY_LOADED when decryptdata is null', () => {
      const loadedCb = getHlsHandler(fakeHls, HLS_EVENTS.KEY_LOADED)
      const frag = { decryptdata: null }

      loadedCb(null, { frag })

      expect(emitTelemetry).not.toHaveBeenCalled()
    })
  })

  // ─── ERROR event ─────────────────────────────────────────────────────────────

  describe('ERROR event', () => {
    beforeEach(() => adapter.bind())

    it('emits REQUEST_ERROR and removes the pending entry on NETWORK_ERROR with frag', () => {
      const frag = makeFrag()
      const fragLoadingCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      const errorCb = getHlsHandler(fakeHls, HLS_EVENTS.ERROR)
      fragLoadingCb(null, { frag })
      jest.clearAllMocks()

      errorCb(null, { type: HLS_ERROR_TYPES.NETWORK_ERROR, frag, details: 'fragLoadError', fatal: false })

      expect(adapter.pendingRequests.size).toBe(0)
      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_ERROR,
        expect.objectContaining({ kind: 'segment', details: 'fragLoadError', fatal: false }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('does nothing for NETWORK_ERROR without frag or url', () => {
      const fragLoadingCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      const errorCb = getHlsHandler(fakeHls, HLS_EVENTS.ERROR)
      fragLoadingCb(null, { frag: makeFrag() })
      jest.clearAllMocks()

      errorCb(null, { type: HLS_ERROR_TYPES.NETWORK_ERROR })

      expect(adapter.pendingRequests.size).toBe(1)
      expect(emitTelemetry).not.toHaveBeenCalled()
    })

    it('removes manifest pending entry on NETWORK_ERROR with url and no frag', () => {
      const manifestLoadingCb = getHlsHandler(fakeHls, HLS_EVENTS.MANIFEST_LOADING)
      const errorCb = getHlsHandler(fakeHls, HLS_EVENTS.ERROR)
      const url = 'http://ex.com/master.m3u8'
      manifestLoadingCb(null, { url })
      jest.clearAllMocks()

      errorCb(null, { type: HLS_ERROR_TYPES.NETWORK_ERROR, url })

      expect(adapter.pendingRequests.size).toBe(0)
      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_ERROR,
        expect.objectContaining({ kind: 'manifest', urlHash: expect.any(String) }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('correctly identifies manifest kind for URL with query string', () => {
      const manifestLoadingCb = getHlsHandler(fakeHls, HLS_EVENTS.MANIFEST_LOADING)
      const errorCb = getHlsHandler(fakeHls, HLS_EVENTS.ERROR)
      const url = 'http://ex.com/master.m3u8?token=abc123'
      manifestLoadingCb(null, { url })
      jest.clearAllMocks()

      errorCb(null, { type: HLS_ERROR_TYPES.NETWORK_ERROR, url })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.REQUEST_ERROR,
        expect.objectContaining({ kind: 'manifest' }),
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('does nothing for non-network errors', () => {
      const fragLoadingCb = getHlsHandler(fakeHls, HLS_EVENTS.FRAG_LOADING)
      const errorCb = getHlsHandler(fakeHls, HLS_EVENTS.ERROR)
      fragLoadingCb(null, { frag: makeFrag() })
      jest.clearAllMocks()

      errorCb(null, { type: HLS_ERROR_TYPES.MEDIA_ERROR })

      expect(adapter.pendingRequests.size).toBe(1)
      expect(emitTelemetry).not.toHaveBeenCalled()
    })
  })

  // ─── LEVEL_SWITCHED / BITRATE_CHANGE ────────────────────────────────────────

  describe('LEVEL_SWITCHED / BITRATE_CHANGE', () => {
    it('emits BITRATE_CHANGE with previous and current level data', () => {
      const levels = [
        { bitrate: 800000, width: 640, height: 360 },
        { bitrate: 2400000, width: 1920, height: 1080 }
      ]
      fakeHls = createFakeHls(levels)
      playback = createFakePlayback(fakeHls)
      adapter.destroy()
      adapter = new HlsNetworkAdapter(playback, container)
      adapter.bind()

      const cb = getHlsHandler(fakeHls, HLS_EVENTS.LEVEL_SWITCHED)

      cb(null, { level: 0 })
      jest.clearAllMocks()
      cb(null, { level: 1 })

      expect(emitTelemetry).toHaveBeenCalledWith(
        container,
        EVENT_TYPES.BITRATE_CHANGE,
        {
          previous: { bitrate: 800000, width: 640, height: 360 },
          current: { bitrate: 2400000, width: 1920, height: 1080 }
        },
        TELEMETRY_SOURCES.NETWORK
      )
    })

    it('emits null for previous when it is the first level switch', () => {
      const levels = [{ bitrate: 800000, width: 640, height: 360 }]
      fakeHls = createFakeHls(levels)
      playback = createFakePlayback(fakeHls)
      adapter.destroy()
      adapter = new HlsNetworkAdapter(playback, container)
      adapter.bind()

      const cb = getHlsHandler(fakeHls, HLS_EVENTS.LEVEL_SWITCHED)
      cb(null, { level: 0 })

      const [, , data] = emitTelemetry.mock.calls[0]
      expect(data.previous.bitrate).toBeNull()
      expect(data.previous.width).toBeNull()
      expect(data.previous.height).toBeNull()
    })

    it('updates _previousLevel after each switch', () => {
      const levels = [
        { bitrate: 500000, width: 480, height: 270 },
        { bitrate: 1500000, width: 1280, height: 720 }
      ]
      fakeHls = createFakeHls(levels)
      playback = createFakePlayback(fakeHls)
      adapter.destroy()
      adapter = new HlsNetworkAdapter(playback, container)
      adapter.bind()

      const cb = getHlsHandler(fakeHls, HLS_EVENTS.LEVEL_SWITCHED)
      cb(null, { level: 0 })
      cb(null, { level: 1 })

      expect(adapter._previousLevel).toBe(1)
    })

    it('registers LEVEL_SWITCHED listener on bind()', () => {
      adapter.bind()

      expect(fakeHls.on).toHaveBeenCalledWith(HLS_EVENTS.LEVEL_SWITCHED, expect.any(Function))
    })

    it('removes LEVEL_SWITCHED listener on destroy', () => {
      adapter.bind()
      adapter.destroy()

      expect(fakeHls.off).toHaveBeenCalledWith(HLS_EVENTS.LEVEL_SWITCHED, expect.any(Function))
    })
  })
})
