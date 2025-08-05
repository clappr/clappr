import UICorePlugin from './ui_core_plugin'
import ErrorMixin from '@/base/error_mixin'

describe('UI Core Plugin', () => {
  describe('constructor', () => {
    test('enables the plugin', () => {
      const plugin = new UICorePlugin({})

      expect(plugin.enabled).toBeTruthy()
    })

    test('binds all events', () => {
      let bind = false
      const Plugin = class MyPlugin extends UICorePlugin {
        bindEvents() {
          bind = true
        }
      }

      new Plugin({}) // eslint-disable-line

      expect(bind).toBeTruthy()
    })
  })

  test('has a default value for getExternalInterface method', () => {
    const plugin = new UICorePlugin({})

    expect(plugin.getExternalInterface()).toEqual({})
  })

  test('enables the plugin', () => {
    const plugin = new UICorePlugin({})
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
    const plugin = new UICorePlugin({})

    plugin.disable()

    expect(plugin.enabled).toBeFalsy()

    plugin.enable()

    expect(plugin.enabled).toBeTruthy()
  })

  test('ignores enable call if the plugin is already enabled', () => {
    const plugin = new UICorePlugin({})
    const spy = jest.spyOn(plugin, 'bindEvents')

    expect(plugin.enabled).toBeTruthy()

    plugin.enable()
    plugin.enable()

    expect(spy).not.toHaveBeenCalled()
    expect(plugin.enabled).toBeTruthy()
  })

  test('disables the plugin', () => {
    const plugin = new UICorePlugin({})
    const spy = jest.spyOn(plugin, 'stopListening')
    const hide = jest.fn()
    plugin.$el = { hide: hide }

    plugin.disable()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(hide).toHaveBeenCalledTimes(1)
    expect(plugin.enabled).toBeFalsy()
  })

  test('can be disabled after your creation', () => {
    const plugin = new UICorePlugin({})

    plugin.disable()

    expect(plugin.enabled).toBeFalsy()
  })

  test('destroys the plugin', () => {
    const plugin = new UICorePlugin({})
    const spy = jest.spyOn(plugin, 'destroy')

    plugin.destroy()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('receives createdError method from ErrorMixin', () => {
    const plugin = new UICorePlugin({})

    expect(plugin.createError).not.toBeUndefined()
    expect(plugin.createError).toEqual(ErrorMixin.createError)
  })

  test('can be created via extends method', () => {
    const plugin = UICorePlugin.extend({ name: 'test_plugin' })

    expect(plugin.prototype instanceof UICorePlugin).toBeTruthy()
  })
})
