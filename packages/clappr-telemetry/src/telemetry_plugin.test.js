import { Log, Events } from '@clappr/core'
import TelemetryPlugin from './telemetry_plugin'
import { findNetworkAdapter, ShakaNetworkAdapter } from './adapters'

jest.mock('./adapters', () => {
  const actual = jest.requireActual('./adapters')
  return {
    findNetworkAdapter: jest.fn(),
    ShakaNetworkAdapter: actual.ShakaNetworkAdapter,
  }
})

describe('TelemetryPlugin', () => {
  let plugin, mockContainer, mockPlayback

  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    findNetworkAdapter.mockReturnValue(ShakaNetworkAdapter)

    mockPlayback = { name: 'dash_shaka_playback' }
    mockContainer = {
      on: jest.fn(),
      off: jest.fn(),
      playback: null,
      options: { telemetry: { network: { enabled: true } } }
    }
    plugin = new TelemetryPlugin(mockContainer)
  })

  it('should create TelemetryPlugin class', () => {
    expect(TelemetryPlugin).toBeDefined()
    expect(typeof TelemetryPlugin).toBe('function')
  })

  it('should instantiate with a container', () => {
    expect(plugin).toBeDefined()
    expect(plugin.container).toBe(mockContainer)
  })

  it('should have name property', () => {
    expect(plugin.name).toBe('telemetry')
  })

  it('should register listener on CONTAINER_READY event during bindEvents', () => {
    jest.spyOn(plugin, 'listenTo')
    plugin.bindEvents()

    expect(plugin.listenTo).toHaveBeenCalledWith(
      mockContainer,
      Events.CONTAINER_READY,
      expect.any(Function)
    )
  })

  it('should call onPlaybackRead with container.playback when CONTAINER_READY fires', () => {
    mockContainer.playback = mockPlayback
    jest.spyOn(plugin, 'onPlaybackRead').mockImplementation(() => {})
    jest.spyOn(plugin, 'listenTo').mockImplementation((emitter, event, cb) => cb('container-name'))

    plugin.bindEvents()

    expect(plugin.onPlaybackRead).toHaveBeenCalledWith(mockPlayback)
  })

  it('should not call onPlaybackRead when container.playback is null on CONTAINER_READY', () => {
    mockContainer.playback = null
    jest.spyOn(plugin, 'onPlaybackRead').mockImplementation(() => {})
    jest.spyOn(plugin, 'listenTo').mockImplementation((emitter, event, cb) => cb('container-name'))

    plugin.bindEvents()

    expect(plugin.onPlaybackRead).not.toHaveBeenCalled()
  })

  it('should call onPlaybackRead when CONTAINER_READY event fires', () => {
    jest.spyOn(plugin, 'listenTo')
    plugin.bindEvents()

    const [, event, callback] = plugin.listenTo.mock.calls[0]
    expect(event).toBe(Events.CONTAINER_READY)
    expect(callback).toBeDefined()
  })

  it('should instantiate and bind the adapter when playback is available', () => {
    const mockAdapter = { bind: jest.fn() }
    const MockAdapterClass = jest.fn(() => mockAdapter)
    findNetworkAdapter.mockReturnValue(MockAdapterClass)

    plugin.onPlaybackRead(mockPlayback)

    expect(MockAdapterClass).toHaveBeenCalledWith(mockPlayback, mockContainer)
    expect(mockAdapter.bind).toHaveBeenCalled()
    expect(plugin.adapter).toBe(mockAdapter)
  })

  it('should not instantiate adapter when telemetry config is missing', () => {
    const noConfigContainer = {
      on: jest.fn(),
      off: jest.fn(),
      playback: null,
      options: {}
    }
    const p = new TelemetryPlugin(noConfigContainer)
    p.onPlaybackRead(mockPlayback)
    expect(p.adapter).toBeNull()
  })

  it('should not instantiate adapter when telemetry is disabled', () => {
    const disabledContainer = {
      on: jest.fn(),
      off: jest.fn(),
      playback: null,
      options: { telemetry: { network: { enabled: false } } }
    }
    const disabledPlugin = new TelemetryPlugin(disabledContainer)
    disabledPlugin.onPlaybackRead(mockPlayback)
    expect(disabledPlugin.adapter).toBeNull()
  })

  it('should not instantiate adapter when findNetworkAdapter returns null', () => {
    findNetworkAdapter.mockReturnValueOnce(null)

    plugin.onPlaybackRead(mockPlayback)

    expect(plugin.adapter).toBeNull()
  })

  it('should log warning when no adapter is found for playback engine', () => {
    jest.spyOn(Log, 'warn').mockImplementation(() => {})
    findNetworkAdapter.mockReturnValueOnce(null)

    plugin.onPlaybackRead(mockPlayback)

    expect(Log.warn).toHaveBeenCalledWith(
      '[TelemetryPlugin] No network adapter for playback: dash_shaka_playback'
    )
  })

  it('should destroy previous adapter when onPlaybackRead is called again', () => {
    const oldAdapter = { bind: jest.fn(), destroy: jest.fn() }
    const newAdapter = { bind: jest.fn(), destroy: jest.fn() }
    const OldClass = jest.fn(() => oldAdapter)
    const NewClass = jest.fn(() => newAdapter)

    findNetworkAdapter.mockReturnValueOnce(OldClass)
    plugin.onPlaybackRead(mockPlayback)
    expect(plugin.adapter).toBe(oldAdapter)

    findNetworkAdapter.mockReturnValueOnce(NewClass)
    plugin.onPlaybackRead(mockPlayback)

    expect(oldAdapter.destroy).toHaveBeenCalled()
    expect(plugin.adapter).toBe(newAdapter)
  })

  it('should not throw on destroy when adapter is null', () => {
    plugin.adapter = null
    expect(() => plugin.destroy()).not.toThrow()
  })

  it('should clean up adapter on destroy', () => {
    const mockAdapter = { destroy: jest.fn(), bind: jest.fn() }
    plugin.adapter = mockAdapter

    plugin.destroy()

    expect(mockAdapter.destroy).toHaveBeenCalled()
    expect(plugin.adapter).toBeNull()
  })

  it('should call parent destroy method', () => {
    const parentDestroy = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(plugin)), 'destroy')
    plugin.destroy()
    expect(parentDestroy).toHaveBeenCalled()
  })
})
