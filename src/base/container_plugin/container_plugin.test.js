import ContainerPlugin from './container_plugin'

describe('Container Plugin', () => {
  describe('#constructor', () => {
    test('enables the plugin', () => {
      const plugin = new ContainerPlugin({})

      expect(plugin.enabled).toBeTruthy()
    })

    test('binds all events', () => {
      let bind = false
      const Plugin = class MyPlugin extends ContainerPlugin {
        bindEvents() {
          bind = true
        }
      }

      new Plugin({})

      expect(bind).toBeTruthy()
    })
  })

  test('can be disabled after your creation', () => {
    const plugin = new ContainerPlugin({})

    plugin.disable()

    expect(plugin.enabled).toBeFalsy()
  })

  test('can be enabled after your creation', () => {
    const plugin = new ContainerPlugin({})

    plugin.disable()

    expect(plugin.enabled).toBeFalsy()

    plugin.enable()

    expect(plugin.enabled).toBeTruthy()
  })

  test('stops listening when disable an enabled plugin', () => {
    const plugin = new ContainerPlugin({})
    const spy = jest.spyOn(plugin, 'stopListening')

    plugin.disable()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('doesn\'t stops listening when disable a disabled plugin', () => {
    const plugin = new ContainerPlugin({})
    const spy = jest.spyOn(plugin, 'stopListening')

    plugin.enabled = false
    plugin.disable()

    expect(spy).not.toHaveBeenCalled()
  })

  test('stops listening when destroyed', () => {
    const plugin = new ContainerPlugin({})
    const spy = jest.spyOn(plugin, 'stopListening')

    plugin.destroy()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('binds events once', () => {
    const plugin = new ContainerPlugin({})
    const spy = jest.spyOn(plugin, 'bindEvents')

    plugin.enable()
    plugin.enable()
    plugin.enable()

    expect(spy).not.toHaveBeenCalled()
  })
})
