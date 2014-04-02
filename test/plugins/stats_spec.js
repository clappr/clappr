var StatsPlugin = require('../spec_helper').StatsPlugin;
var StatsEvents = require('../spec_helper').StatsEvents;
var Container = require('../spec_helper').Container;
var FakePlayback = require('../spec_helper').FakePlayback;

describe('StatsPlugin', function() {
  beforeEach(function() {
    this.container = new Container({settings: ['play', 'pause'], playback: new FakePlayback()});
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
    // to maintain compatibility with the first ping version
    // we'll increment rebuffers even on the startup rebuffer event
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

  it('should consider current rebuffering state', function() {
    var stats = new StatsPlugin({container: this.container});
    this.container.play();
    this.container.buffering(); // startup time
    this.clock.tick(1000);
    this.container.bufferfull();

    this.container.buffering();
    this.clock.tick(1000);
    this.container.bufferfull();
    this.clock.tick(10000);

    this.container.buffering();
    this.clock.tick(500);
    // still rebuffering

    expect(stats.getStats().rebufferingTime).to.equal(1500);
    expect(stats.getStats().watchingTime).to.equal(10000);
  });

  it('should be able to add custom metric', function() {
    var stats = new StatsPlugin({container: this.container});
    this.container.statsAdd({"skippedPreRoll": true});
    expect(stats.getStats()).to.have.property('skippedPreRoll');
    stats.getStats().skippedPreRoll.should.be.true;
  });

  it('should overwrite metric if added twice', function() {
    var stats = new StatsPlugin({container: this.container});
    this.container.statsAdd({"p2pChunks": 20});
    expect(stats.getStats().p2pChunks).to.equal(20);

    this.container.statsAdd({"p2pChunks": 30});
    expect(stats.getStats().p2pChunks).to.equal(30);
  });

  it('should report statistics periodically', function() {
    var stats = new StatsPlugin({container: this.container, reportInterval: 10});
    var spy = sinon.spy(this.container, 'statsReport');
    this.container.play();
    this.clock.tick(25);
    spy.calledTwice.should.be.true;
  });

  it('should stop report when transmission stop', function() {
    var stats = new StatsPlugin({container: this.container, reportInterval: 10});
    var spy = sinon.spy(this.container, 'statsReport');
    this.container.play();
    this.clock.tick(25);
    this.container.stop();
    this.clock.tick(15);
    spy.calledTwice.should.be.true;
  });

  it("should only report if user hits play", function() {
    var stats = new StatsPlugin({container: this.container, reportInterval: 10});
    var spy = sinon.spy(this.container, 'statsReport');
    this.clock.tick(20);
    spy.called.should.be.false;
  });
});
