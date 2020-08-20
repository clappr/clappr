import UIContainerPlugin from './ui_container_plugin'

describe('UI Container Plugin', () => {
  describe('#constructor', () => {
    test('enables the plugin', () => {
      const plugin = new UIContainerPlugin({})

      expect(plugin.enabled).toBeTruthy()
    })

    test('binds all events', () => {
      let bind = false
      const Plugin = class MyPlugin extends UIContainerPlugin {
        bindEvents() {
          bind = true
        }
      }

      new Plugin({})

      expect(bind).toBeTruthy()
    })
  })

  test('enables the plugin', () => {
    const plugin = new UIContainerPlugin({})
    const spy = jest.spyOn(plugin, 'bindEvents')
    const show = jest.fn()
    plugin.$el = { show: show }
    plugin.enabled = false

    plugin.enable()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(show).toHaveBeenCalledTimes(1)
    expect(plugin.enabled).toBeTruthy()
  })

  test('can be enabled after your creation', () => {
    const plugin = new UIContainerPlugin({})

    plugin.disable()

    expect(plugin.enabled).toBeFalsy()

    plugin.enable()

    expect(plugin.enabled).toBeTruthy()
  })

  test('ignores enable call if the plugin is already enabled', () => {
    const plugin = new UIContainerPlugin({})
    const spy = jest.spyOn(plugin, 'bindEvents')

    expect(plugin.enabled).toBeTruthy()

    plugin.enable()
    plugin.enable()

    expect(spy).not.toHaveBeenCalled()
    expect(plugin.enabled).toBeTruthy()
  })

  test('disables the plugin', () => {
    const plugin = new UIContainerPlugin({})
    const spy = jest.spyOn(plugin, 'stopListening')
    const hide = jest.fn()
    plugin.$el = { hide: hide }

    plugin.disable()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(hide).toHaveBeenCalledTimes(1)
    expect(plugin.enabled).toBeFalsy()
  })

  test('destroys the plugin', () => {
    const plugin = new UIContainerPlugin({})
    const spy = jest.spyOn(plugin, 'destroy')

    plugin.destroy()

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
