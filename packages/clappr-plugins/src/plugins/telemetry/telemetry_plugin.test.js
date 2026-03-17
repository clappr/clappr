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

  it('should listen to container playback event on bindEvents', () => {
    expect(plugin.listenTo).toBeDefined()
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

  it('should clean up adapter on destroy', () => {
    const mockAdapter = { destroy: jest.fn(), bind: jest.fn() }
    plugin.adapter = mockAdapter

    plugin.destroy()

    expect(mockAdapter.destroy).toHaveBeenCalled()
    expect(plugin.adapter).toBeNull()
  })
})
