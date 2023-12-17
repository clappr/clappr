import CorePlugin from './core_plugin'
import ErrorMixin from '@/base/error_mixin'
import Player from '@/components/player'

describe('Core Plugin', () => {
  describe('#constructor', () => {
    test('enables the plugin', () => {
      const plugin = new CorePlugin({})

      expect(plugin.enabled).toBeTruthy()
    })

    test('binds all events', () => {
      let bind = false
      const Plugin = class MyPlugin extends CorePlugin {
        bindEvents() {
          bind = true
        }
      }

      new Plugin({})

      expect(bind).toBeTruthy()
    })
  })

  test('can be disabled after your creation', () => {
    const plugin = new CorePlugin({})

    plugin.disable()

    expect(plugin.enabled).toBeFalsy()
  })

  test('can be enabled after your creation', () => {
    const plugin = new CorePlugin({})

    plugin.disable()

    expect(plugin.enabled).toBeFalsy()

    plugin.enable()

    expect(plugin.enabled).toBeTruthy()
  })

  test('receives createdError method from ErrorMixin', () => {
    const plugin = new CorePlugin({})

    expect(plugin.createError).not.toBeUndefined()
    expect(plugin.createError).toEqual(ErrorMixin.createError)
  })

  test('stops listening when disable an enabled plugin', () => {
    const plugin = new CorePlugin({})
    const spy = jest.spyOn(plugin, 'stopListening')

    plugin.disable()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('doesn\'t stops listening when disable a disabled plugin', () => {
    const plugin = new CorePlugin({})
    const spy = jest.spyOn(plugin, 'stopListening')

    plugin.enabled = false
    plugin.disable()

    expect(spy).not.toHaveBeenCalled()
  })

  test('stops listening when destroyed', () => {
    const plugin = new CorePlugin({})
    const spy = jest.spyOn(plugin, 'stopListening')

    plugin.destroy()

    expect(spy).toHaveBeenCalled()
  })

  test('binds events once', () => {
    const plugin = new CorePlugin({})
    const spy = jest.spyOn(plugin, 'bindEvents')

    plugin.enable()
    plugin.enable()
    plugin.enable()

    expect(spy).not.toHaveBeenCalled()
  })

  test('can be created via extends method', () => {
    const plugin = CorePlugin.extend({ name: 'test_plugin' })

    expect(plugin.prototype instanceof CorePlugin).toBeTruthy()
  })

  test('exposes interfaces for player scope', () => {
    const pluginInterface = () => 'This is awesome!'

    const Plugin = class MyPlugin extends CorePlugin {
      getExternalInterface() {
        return { pluginInterface }
      }
    }

    const plugin = new Plugin({})
    const player = new Player({})

    player._coreFactory.setupExternalInterface(plugin)

    expect(player.pluginInterface()).toEqual('This is awesome!')
  })

  test('has a default value for getExternalInterface method', () => {
    const plugin = new CorePlugin({})

    expect(plugin.getExternalInterface()).toEqual({})
  })
})
