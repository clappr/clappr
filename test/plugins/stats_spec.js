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

    expect(stats.getStats().startupTime).to.equal(1000);
  });

  it('should calculate rebuffer events', function() {
    var stats = new StatsPlugin({container: this.container});
    this.container.buffering();
    this.container.bufferfull();

    this.container.buffering();
    this.container.bufferfull();

    expect(stats.getStats().rebuffers).to.equal(2);
  });

  it('should calculate total rebuffer time', function() {
    var stats = new StatsPlugin({container: this.container});
    this.container.play();
    this.container.buffering(); // startup time
    this.clock.tick(1000);
    this.container.bufferfull();

    this.container.buffering();
    this.clock.tick(1000);
    this.container.bufferfull();

    this.container.buffering();
    this.clock.tick(500);
    this.container.bufferfull();

    expect(stats.getStats().rebufferingTime).to.equal(1500);
  });

  it('should calculate total watching time', function() {
    var stats = new StatsPlugin({container: this.container});
    this.container.play();
    this.container.buffering(); // startup time
    this.clock.tick(1000);
    this.container.bufferfull();

    this.clock.tick(2000); // watching for 2 secs
    expect(stats.getStats().watchingTime).to.equal(2000);

    this.container.buffering();
    this.clock.tick(500);
    this.container.bufferfull();

    this.clock.tick(2000); // watching for 2 secs
    expect(stats.getStats().watchingTime).to.equal(4000);
  });
});
