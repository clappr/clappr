var ContainerPlugin = require('../../src/base/container_plugin')

describe('Container Plugin', function() {
  it('should be enabled when created', function() {
    var plugin = new ContainerPlugin({})
    expect(plugin.enabled).to.be.true
  })

  it('should be disable when call disable()', function() {
    var plugin = new ContainerPlugin({})
    plugin.disable()
    expect(plugin.enabled).to.be.false
  })

  it('should call stopListening() when disabled', function() {
    var plugin = new ContainerPlugin({})
    var spy = sinon.spy(plugin, 'stopListening')
    plugin.disable()
    expect(spy).called.once
  })

  it('should call stopListening() when destroyed', function() {
    var plugin = new ContainerPlugin({})
    var spy = sinon.spy(plugin, 'stopListening')
    plugin.destroy()
    expect(spy).called.once
  })

  it('should not call bindEvents() twice', function() {
    var plugin = new ContainerPlugin({})
    var spy = sinon.spy(plugin, 'bindEvents')
    plugin.disable()
    plugin.enable()
    plugin.enable()
    expect(spy).called.once
  })

})
