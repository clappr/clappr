import { Log, Events } from '@clappr/core'
import TelemetryPlugin from './telemetry_plugin'
import { ShakaNetworkAdapter } from './adapters'

jest.mock('./adapters', () => ({
  findNetworkAdapter: jest.fn()
}))

describe('TelemetryPlugin', () => {
  let plugin, mockContainer, mockPlayback

  beforeEach(() => {
    jest.clearAllMocks()
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

  it('should call onPlaybackRead when CONTAINER_READY event fires', () => {
    jest.spyOn(plugin, 'listenTo')
    jest.spyOn(plugin, 'onPlaybackRead')
    plugin.bindEvents()

    const [, event, callback] = plugin.listenTo.mock.calls[0]
    expect(event).toBe(Events.CONTAINER_READY)

    mockContainer.playback = mockPlayback
    callback()

    expect(plugin.onPlaybackRead).toHaveBeenCalledWith(mockPlayback)
  })

  it('should instantiate adapter when playback is ready and telemetry enabled', () => {
    const { findNetworkAdapter } = require('./adapters')
    findNetworkAdapter.mockReturnValue(ShakaNetworkAdapter)

    plugin.onPlaybackRead(mockPlayback)

    expect(plugin.adapter).toBeDefined()
  })

  it('should not instantiate adapter when telemetry is disabled', () => {
    mockContainer.options.telemetry.network.enabled = false
    plugin.onPlaybackRead(mockPlayback)
    expect(plugin.adapter).toBeNull()
  })

  it('should log warning when no adapter is found for playback engine', () => {
    jest.spyOn(Log, 'warn')
    const { findNetworkAdapter } = require('./adapters')
    findNetworkAdapter.mockReturnValue(null)

    plugin.onPlaybackRead(mockPlayback)

    expect(Log.warn).toHaveBeenCalledWith(
      '[TelemetryPlugin] No network adapter for playback: dash_shaka_playback'
    )
  })

  it('should clean up adapter on destroy', () => {
    const mockAdapter = { destroy: jest.fn(), bind: jest.fn() }
    plugin.adapter = mockAdapter

    plugin.destroy()

    expect(mockAdapter.destroy).toHaveBeenCalled()
    expect(plugin.adapter).toBeNull()
  })

  it('should call parent destroy method', () => {
    jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(plugin)), 'destroy')
    const mockAdapter = { destroy: jest.fn(), bind: jest.fn() }
    plugin.adapter = mockAdapter

    plugin.destroy()

    expect(plugin.adapter).toBeNull()
  })
})
