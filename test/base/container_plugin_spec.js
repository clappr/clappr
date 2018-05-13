import ContainerPlugin from 'base/container_plugin'

describe('Container Plugin', function() {
  describe('#constructor', () => {
    it('enables', function() {
      const plugin = new ContainerPlugin({})

      expect(plugin.enabled).to.be.true
    })

    it('binds all events', () => {
      let bind = false
      const Plugin = class MyPlugin extends ContainerPlugin {
        bindEvents() {
          bind = true
        }
      }

      new Plugin({})

      expect(bind).to.be.true
    })
  })

  it('disables', () => {
    const plugin = new ContainerPlugin({})

    plugin.disable()

    expect(plugin.enabled).to.be.false
  })

  it('stops listening when disable an enabled plugin', () => {
    const plugin = new ContainerPlugin({})
    const spy = sinon.spy(plugin, 'stopListening')

    plugin.disable()

    expect(spy).to.have.been.calledOnce
  })

  it('doesnt stops listening when disable a disabled plugin', () => {
    const plugin = new ContainerPlugin({})
    const spy = sinon.spy(plugin, 'stopListening')

    plugin.enabled = false
    plugin.disable()

    expect(spy).to.not.have.been.called
  })

  it('stops listening when destroyed', () => {
    const plugin = new ContainerPlugin({})
    const spy = sinon.spy(plugin, 'stopListening')

    plugin.destroy()

    expect(spy).to.have.been.calledOnce
  })

  it('binds events once', () => {
    const plugin = new ContainerPlugin({})
    const spy = sinon.spy(plugin, 'bindEvents')

    plugin.enable()
    plugin.enable()
    plugin.enable()

    expect(spy).to.not.have.been.called
  })
})
