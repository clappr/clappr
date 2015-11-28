import UICorePlugin from 'base/ui_core_plugin'

describe('UI Core Plugin', function() {
  class MyPlugin extends UICorePlugin{
    render() { }
  }
  it('constructs', () => {
    var callCount = 0
    class MyPlugin extends UICorePlugin{
      bindEvents() { callCount += 1 }
      render() { callCount += 1 }
    }
    var plugin = new MyPlugin(42)

    expect(plugin.core).to.be.equals(42)
    expect(plugin.enabled).to.be.true
    expect(callCount).to.be.equals(2)
  })

  it('enables', () => {
    var plugin = new MyPlugin({})
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
    var plugin = new MyPlugin({})
    var spy = sinon.spy(plugin, 'stopListening')
    var hide = sinon.spy()
    plugin.$el = {hide: hide}

    plugin.disable()

    expect(spy).called.once
    expect(hide).called.once
    expect(plugin.enabled).to.be.false
  })

  it('destroys', () => {
    var plugin = new MyPlugin({})
    var spy = sinon.spy(plugin, 'remove')

    plugin.destroy()

    expect(spy).called.once
  })
})
