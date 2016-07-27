import UIContainerPlugin from 'base/ui_container_plugin'

describe('UI Container Plugin', function() {
  describe('#constructor', () => {
    it('enables', function() {
      const plugin = new UIContainerPlugin({})

      expect(plugin.enabled).to.be.true
    })

    it('binds all events', () => {
      let bind = false
      const Plugin = class MyPlugin extends UIContainerPlugin{
        bindEvents() {
          bind = true
        }
      }

      new Plugin({})

      expect(bind).to.be.true
    })
  })

  it('enables', () => {
    const plugin = new UIContainerPlugin({})
    const spy = sinon.spy(plugin, 'bindEvents')
    const show = sinon.spy()
    plugin.$el = {show: show}
    plugin.enabled = false

    plugin.enable()

    expect(spy).called.once
    expect(show).called.once
    expect(plugin.enabled).to.be.true
  })

  it('disables', () => {
    const plugin = new UIContainerPlugin({})
    const spy = sinon.spy(plugin, 'stopListening')
    const hide = sinon.spy()
    plugin.$el = {hide: hide}

    plugin.disable()

    expect(spy).called.once
    expect(hide).called.once
    expect(plugin.enabled).to.be.false
  })

  it('destroys', () => {
    const plugin = new UIContainerPlugin({})
    const spy = sinon.spy(plugin, 'remove')

    plugin.destroy()

    expect(spy).called.once
  })
})
