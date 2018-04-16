import UICorePlugin from 'base/ui_core_plugin'

describe('UI Core Plugin', function() {
  class MyPlugin extends UICorePlugin {
    render() { }
  }
  it('constructs', () => {
    let callCount = 0
    class MyPlugin extends UICorePlugin {
      bindEvents() { callCount += 1 }
      render() { callCount += 1 }
    }
    const plugin = new MyPlugin(42)

    expect(plugin.core).to.be.equals(42)
    expect(plugin.enabled).to.be.true
    expect(callCount).to.be.equals(2)
  })

  it('enables', () => {
    const plugin = new MyPlugin({})
    const spy = sinon.spy(plugin, 'bindEvents')
    const show = sinon.spy()
    plugin.$el = { show: show }
    plugin.enabled = false

    plugin.enable()

    expect(spy).to.have.been.calledOnce
    expect(show).to.have.been.calledOnce
    expect(plugin.enabled).to.be.true
  })

  it('disables', () => {
    const plugin = new MyPlugin({})
    const spy = sinon.spy(plugin, 'stopListening')
    const hide = sinon.spy()
    plugin.$el = { hide: hide }

    plugin.disable()

    expect(spy).to.have.been.calledOnce
    expect(hide).to.have.been.calledOnce
    expect(plugin.enabled).to.be.false
  })

  it('destroys', () => {
    const plugin = new MyPlugin({})
    const spy = sinon.spy(plugin, 'remove')

    plugin.remove()

    expect(spy).to.have.been.calledOnce
  })
})
