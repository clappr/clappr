import CorePlugin from 'base/core_plugin'

describe('Core Plugin', function() {
  describe('#constructor', () => {
    it('enables', function() {
      var plugin = new CorePlugin({})

      expect(plugin.enabled).to.be.true
    })

    it('binds all events', () => {
      var bind = false
      var Plugin = class MyPlugin extends CorePlugin{
        bindEvents() {
          bind = true
        }
      }

      new Plugin({})

      expect(bind).to.be.true
    })
  })

  it('disables', () => {
    var plugin = new CorePlugin({})

    plugin.disable()

    expect(plugin.enabled).to.be.false
  })

  it('stops listening when disable an enabled plugin', () => {
    var plugin = new CorePlugin({})
    var spy = sinon.spy(plugin, 'stopListening')

    plugin.disable()

    expect(spy).called.once
  })

  it('doesnt stops listening when disable a disabled plugin', () => {
    var plugin = new CorePlugin({})
    var spy = sinon.spy(plugin, 'stopListening')

    plugin.enabled = false
    plugin.disable()

    expect(spy).not.called
  })

  it('stops listening when destroyed', () => {
    var plugin = new CorePlugin({})
    var spy = sinon.spy(plugin, 'stopListening')

    plugin.destroy()

    expect(spy).called.once
  })

  it('binds events once', () => {
    var plugin = new CorePlugin({})
    var spy = sinon.spy(plugin, 'bindEvents')

    plugin.enable()
    plugin.enable()
    plugin.enable()

    expect(spy).not.called
  })
})
