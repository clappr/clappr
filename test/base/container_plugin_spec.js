var ContainerPlugin = require('../../src/base/container_plugin');

describe('Container Plugin', () => {
  it('should be enabled when created', () => {
    var plugin = new ContainerPlugin({});
    expect(plugin.enabled).to.be.true;
  });

  it('should be disable when call disable()', () => {
    var plugin = new ContainerPlugin({});
    plugin.disable();
    expect(plugin.enabled).to.be.false;
  });

  it('should call stopListening() when disabled', () => {
    var plugin = new ContainerPlugin({});
    var spy = sinon.spy(plugin, 'stopListening')
    plugin.disable();
    expect(spy).called.once;
  });

  it('should call stopListening() when destroyed', () => {
    var plugin = new ContainerPlugin({});
    var spy = sinon.spy(plugin, 'stopListening')
    plugin.destroy();
    expect(spy).called.once;
  });

  it('should not call bindEvents() twice', () => {
    var plugin = new ContainerPlugin({});
    var spy = sinon.spy(plugin, 'bindEvents')
    plugin.disable();
    plugin.enable();
    plugin.enable();
    expect(spy).called.once;
  });

})
