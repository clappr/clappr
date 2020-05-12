import UICorePlugin from './ui_core_plugin'

describe('UI Core Plugin', function() {
  class MyPlugin extends UICorePlugin {
    render() { }
  }
  test('constructs', () => {
    let callCount = 0
    class MyPlugin extends UICorePlugin {
      bindEvents() { callCount += 1 }
      render() { callCount += 1 }
    }
    const plugin = new MyPlugin(42)

    expect(plugin.core).toEqual(42)
    expect(plugin.enabled).toBeTruthy()
    expect(callCount).toEqual(2)
  })

  test('enables', () => {
    const plugin = new MyPlugin({})
    const spy = jest.spyOn(plugin, 'bindEvents')
    const show = jest.fn()
    plugin.$el = { show: show }
    plugin.enabled = false

    plugin.enable()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(show).toHaveBeenCalledTimes(1)
    expect(plugin.enabled).toBeTruthy()
  })

  test('disables', () => {
    const plugin = new MyPlugin({})
    const spy = jest.spyOn(plugin, 'stopListening')
    const hide = jest.fn()
    plugin.$el = { hide: hide }

    plugin.disable()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(hide).toHaveBeenCalledTimes(1)
    expect(plugin.enabled).toBeFalsy()
  })

  test('destroys', () => {
    const plugin = new MyPlugin({})
    const spy = jest.spyOn(plugin, 'destroy')

    plugin.destroy()

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
