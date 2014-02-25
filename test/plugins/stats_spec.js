var StatsPlugin = require('../spec_helper').StatsPlugin;
var Container = require('../spec_helper').Container;

describe('StatsPlugin', function() {
  beforeEach(function() {
    this.container = new Container({settings: ['play', 'pause']});
    this.clock = sinon.useFakeTimers();
  });

  it('should calculate startup time', function() {
    var stats = new StatsPlugin({container: this.container});
    this.container.buffering();
    this.clock.tick(1000);
    this.container.bufferfull();

    expect(stats.startupTime).to.equal(1000);
  });

});
