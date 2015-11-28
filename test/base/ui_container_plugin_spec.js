import UIContainerPlugin from 'base/ui_container_plugin'

describe('UI Container Plugin', function() {
  describe('#constructor', () => {
    it('enables', function() {
      var plugin = new UIContainerPlugin({})

      expect(plugin.enabled).to.be.true
    })

    it('binds all events', () => {
      var bind = false
      var Plugin = class MyPlugin extends UIContainerPlugin{
        bindEvents() {
          bind = true
        }
      }

      new Plugin({})

      expect(bind).to.be.true
    })
  })

  it('enables', () => {
    var plugin = new UIContainerPlugin({})
    var spy = sinon.spy(plugin, 'bindEvents')
    var show = sinon.spy()
    plugin.$el = {show: show}
    plugin.enabled = false

    plugin.enable()

    expect(spy).called.once
    expect(show).called.once
    expect(plugin.enabled).to.be.true
  })

  it('disables', () => {
    var plugin = new UIContainerPlugin({})
    var spy = sinon.spy(plugin, 'stopListening')
    var hide = sinon.spy()
    plugin.$el = {hide: hide}

    plugin.disable()

    expect(spy).called.once
    expect(hide).called.once
    expect(plugin.enabled).to.be.false
  })

  it('destroys', () => {
    var plugin = new UIContainerPlugin({})
    var spy = sinon.spy(plugin, 'remove')

    plugin.destroy()

    expect(spy).called.once
  })
})
