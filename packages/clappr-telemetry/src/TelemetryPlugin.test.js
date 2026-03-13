import TelemetryPlugin from './TelemetryPlugin'

describe('TelemetryPlugin', () => {
  it('should create TelemetryPlugin class', () => {
    expect(TelemetryPlugin).toBeDefined()
    expect(typeof TelemetryPlugin).toBe('function')
  })

  it('should instantiate with a container', () => {
    const mockContainer = {
      on: jest.fn()
    }
    const plugin = new TelemetryPlugin(mockContainer)

    expect(plugin).toBeDefined()
    expect(plugin.container).toBe(mockContainer)
  })

  it('should have name property', () => {
    const mockContainer = {
      on: jest.fn()
    }
    const plugin = new TelemetryPlugin(mockContainer)

    expect(plugin.name).toBe('telemetry')
  })
})
