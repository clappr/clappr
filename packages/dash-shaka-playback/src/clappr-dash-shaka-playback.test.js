import { Events, HTML5Video } from '@clappr/core'
import shaka from 'shaka-player'
import DashShakaPlayback from './clappr-dash-shaka-playback'

const SRC = 'http://example.com/video.mpd'

const mockPlayer = (overrides = {}) => ({
  destroy: () => Promise.resolve(),
  ...overrides
})

describe('DashShakaPlayback', () => {
  let playback

  beforeEach(() => {
    vi.spyOn(shaka.polyfill, 'installAll').mockImplementation(() => {})
    vi.spyOn(shaka.Player, 'isBrowserSupported').mockReturnValue(true)
    vi.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    playback = new DashShakaPlayback({ src: SRC })
  })

  afterEach(() => {
    playback.destroy()
    vi.restoreAllMocks()
  })

  test('extends HTML5Video', () => {
    expect(playback).toBeInstanceOf(HTML5Video)
  })

  test('exposes name, Events and shakaPlayer', () => {
    expect(playback.name).toBe('dash_shaka_playback')
    expect(DashShakaPlayback.Events.SHAKA_READY).toBe('shaka:ready')
    expect(DashShakaPlayback.shakaPlayer).toBe(shaka)
    expect(playback.shakaVersion).toBe(shaka.Player.version)
  })

  describe('canPlay', () => {
    test('accepts .mpd sources and dash mime type', () => {
      expect(DashShakaPlayback.canPlay(SRC)).toBe(true)
      expect(DashShakaPlayback.canPlay('http://example.com/video.mpd?token=1')).toBe(true)
      expect(DashShakaPlayback.canPlay('http://example.com/video', 'application/dash+xml')).toBe(
        true
      )
    })

    test('rejects unsupported sources', () => {
      expect(DashShakaPlayback.canPlay('http://example.com/video.m3u8')).toBe(false)
      expect(DashShakaPlayback.canPlay('http://example.com/video.mp4')).toBe(false)
    })

    test('returns false when the browser is unsupported', () => {
      shaka.Player.isBrowserSupported.mockReturnValue(false)
      expect(DashShakaPlayback.canPlay(SRC)).toBe(false)
    })
  })

  describe('constructor', () => {
    test('defaults shakaMinimumDvrSize to 60', () => {
      expect(playback._minDvrSize).toBe(60)
    })

    test('reads shakaMinimumDvrSize from options', () => {
      const custom = new DashShakaPlayback({ src: SRC, shakaMinimumDvrSize: 30 })
      expect(custom._minDvrSize).toBe(30)
      custom.destroy()
    })
  })

  describe('without a shaka player instance', () => {
    test('returns safe defaults', () => {
      expect(playback.shakaPlayerInstance).toBeUndefined()
      expect(playback.levels).toEqual([])
      expect(playback.currentLevel).toBe(-1)
      expect(playback.seekRange).toEqual({ start: 0, end: 0 })
      expect(playback.latency).toBe(0)
      expect(playback.getCurrentTime()).toBe(0)
      expect(playback.getDuration()).toBe(0)
      expect(playback.bandwidthEstimate).toBeNull()
      expect(playback.currentProgramDateTime).toBeNull()
      expect(playback.isReady).toBe(false)
      // Precedence is (isReady && isLive()) ? 'live' : 'vod'
      expect(playback.getPlaybackType()).toBe('vod')
    })
  })

  describe('levels', () => {
    test('enables ABR when currentLevel is set to auto (-1)', () => {
      const configure = vi.fn()
      playback._player = mockPlayer({ configure })
      playback.trigger = vi.fn()

      playback.currentLevel = -1

      expect(playback.currentLevel).toBe(-1)
      expect(configure).toHaveBeenCalledWith({ abr: { enabled: true } })
      expect(playback.trigger).toHaveBeenCalledWith(Events.PLAYBACK_LEVEL_SWITCH_START)
      expect(playback.trigger).toHaveBeenCalledWith(Events.PLAYBACK_LEVEL_SWITCH_END)
    })

    test('disables ABR and selects the matching video track for a fixed level', () => {
      const track = { id: 2, type: 'variant', mimeType: 'video/mp4' }
      const configure = vi.fn()
      const selectVariantTrack = vi.fn()
      playback._player = mockPlayer({
        configure,
        selectVariantTrack,
        getVariantTracks: () => [track]
      })
      playback._isShakaReadyState = true
      playback.trigger = vi.fn()
      playback._onAdaptation = vi.fn()

      playback.currentLevel = 2

      expect(playback.currentLevel).toBe(2)
      expect(configure).toHaveBeenCalledWith({ abr: { enabled: false } })
      expect(selectVariantTrack).toHaveBeenCalledWith(track)
      expect(playback._onAdaptation).toHaveBeenCalled()
    })
  })

  describe('selectTrack', () => {
    beforeEach(() => {
      playback._player = mockPlayer({
        selectTextTrack: vi.fn(),
        selectVariantTrack: vi.fn()
      })
      playback._onAdaptation = vi.fn()
    })

    test('selects text tracks', () => {
      const track = { type: 'text', id: 1 }
      playback.selectTrack(track)
      expect(playback._player.selectTextTrack).toHaveBeenCalledWith(track)
    })

    test('selects variant tracks and triggers adaptation for video', () => {
      const track = { type: 'variant', mimeType: 'video/mp4', id: 1 }
      playback.selectTrack(track)
      expect(playback._player.selectVariantTrack).toHaveBeenCalledWith(track)
      expect(playback._onAdaptation).toHaveBeenCalled()
    })

    test('throws for unknown track types', () => {
      expect(() => playback.selectTrack({ type: 'unknown' })).toThrow(/Unhandled track type/)
    })
  })

  describe('playback type and ready state', () => {
    test('reports live or vod from shaka when ready', () => {
      playback._isShakaReadyState = true
      playback._player = mockPlayer({ isLive: () => true })
      expect(playback.getPlaybackType()).toBe('live')

      playback._player.isLive = () => false
      expect(playback.getPlaybackType()).toBe('vod')
    })

    test('_onShakaReady marks the playback as ready and triggers events', () => {
      const ready = vi.fn()
      const shakaReady = vi.fn()
      playback.on(Events.PLAYBACK_READY, ready)
      playback.on(DashShakaPlayback.Events.SHAKA_READY, shakaReady)

      playback._onShakaReady()

      expect(playback.isReady).toBe(true)
      expect(ready).toHaveBeenCalledWith(playback.name)
      expect(shakaReady).toHaveBeenCalled()
    })
  })

  describe('seek', () => {
    test('offsets the seek by the shaka seek range start', () => {
      playback._player = mockPlayer({
        seekRange: () => ({ start: 10, end: 100 })
      })
      playback.seek(5)
      expect(playback.el.currentTime).toBe(15)
    })
  })
})
