import CorePlugin from 'base/core_plugin'

describe('Core Plugin', function() {
  describe('#constructor', () => {
    it('enables', function() {
      const plugin = new CorePlugin({})

      expect(plugin.enabled).to.be.true
    })

    it('binds all events', () => {
      let bind = false
      const Plugin = class MyPlugin extends CorePlugin{
        bindEvents() {
          bind = true
        }
      }

      new Plugin({})

      expect(bind).to.be.true
    })
  })

  it('disables', () => {
    const plugin = new CorePlugin({})

    plugin.disable()

    expect(plugin.enabled).to.be.false
  })

  it('stops listening when disable an enabled plugin', () => {
    const plugin = new CorePlugin({})
    const spy = sinon.spy(plugin, 'stopListening')

    plugin.disable()

    expect(spy).called.once
  })

  it('doesnt stops listening when disable a disabled plugin', () => {
    const plugin = new CorePlugin({})
    const spy = sinon.spy(plugin, 'stopListening')

    plugin.enabled = false
    plugin.disable()

    expect(spy).not.called
  })

  it('stops listening when destroyed', () => {
    const plugin = new CorePlugin({})
    const spy = sinon.spy(plugin, 'stopListening')

    plugin.destroy()

    expect(spy).called.once
  })

  it('binds events once', () => {
    const plugin = new CorePlugin({})
    const spy = sinon.spy(plugin, 'bindEvents')

    plugin.enable()
    plugin.enable()
    plugin.enable()

    expect(spy).not.called
  })
})
