var Container = require('../spec_helper').Container;
var BaseObject = require('../spec_helper').BaseObject;
var StatsPlugin = require('../spec_helper').StatsPlugin;
var FakePlayback = require('../spec_helper').FakePlayback;

describe('Container', function() {
  beforeEach(function() {
    this.container = new Container({playback: new FakePlayback()});
  });

  it('has a data-container attribute', function() {
    this.container.render();
    expect(this.container.$el.attr('data-container')).to.equal('');
  });

  it('is extensible', function() {
    var foo = sinon.spy();
    expect(this.container.foo).to.not.exists;
    this.container.with({foo: foo});
    expect(this.container.foo).to.exists;
    this.container.foo();
    expect(foo.called).to.be.true;
  });

  describe('events', function() {
    beforeEach(function() {
      this.spy = sinon.spy(this.container, 'trigger');
    });

    it('#timeUpdated', function() {
      this.container.timeUpdated(200);
      expect(this.spy.withArgs('container:timeupdate', 200).calledOnce).to.be.true;
    });

    it('#play', function() {
      this.container.play();
      expect(this.spy.withArgs('container:play').calledOnce).to.be.true;
    });

    it('#stop', function() {
      var spy = sinon.stub(this.container.playback, 'stop');
      this.container.stop();
      expect(this.spy.withArgs('container:stop').calledOnce).to.be.true;
      expect(spy.calledOnce).to.be.true;
    });

    it('#pause', function() {
      this.container.pause();
      expect(this.spy.withArgs('container:pause').calledOnce).to.be.true;
    });

    it('#setCurrentTime', function() {
      var spy = sinon.stub(this.container.playback, 'seek');
      this.container.setCurrentTime(300);
      expect(this.spy.withArgs('container:seek', 300).calledOnce).to.be.true;
      expect(spy.calledOnce).to.be.true;
    });

    it('#setVolume', function() {
      this.container.setVolume(30);
      expect(this.spy.withArgs('container:volume', 30).calledOnce).to.be.true;
    });

    it('#requestFullscreen', function() {
      this.container.requestFullscreen();
      expect(this.spy.withArgs('container:fullscreen').calledOnce).to.be.true;
    });

    it('#buffering', function() {
      this.container.buffering();
      expect(this.spy.withArgs('container:state:buffering').calledOnce).to.be.true;
    });

    it('#bufferfull', function() {
      this.container.bufferfull();
      expect(this.spy.withArgs('container:state:bufferfull').calledOnce).to.be.true;
    });

    it('#click', function() {
      this.container.clicked();
      expect(this.spy.withArgs('container:click', this.container).calledOnce).to.be.true;
    });

    it('#mouseover', function() {
      this.container.hover();
      expect(this.spy.withArgs('container:hover', this.container).calledOnce).to.be.true;
    });

  });
  describe('plugins', function() {
    it('#addPlugin', function() {
      expect(this.container.plugins.length).to.equal(1);
      this.container.addPlugin({name: 'foo'});
      expect(this.container.plugins.length).to.equal(2);
    });

    it('#hasPlugin', function() {
      expect(this.container.hasPlugin('olar')).to.be.false;
      this.container.addPlugin({name: 'olar'});
      expect(this.container.hasPlugin('olar')).to.be.true;
    });

    describe('#getPluginByName', function() {
      it('find by name', function() {
        var plugin = {name: 'olar'};
        this.container.addPlugin(plugin);
        expect(this.container.getPluginByName('olar')).to.equal(plugin);
      });

      it('throws error when plugin not found', function() {
        expect(this.container.getPluginByName.bind(this.container, 'foo')).to.throw(/Plugin .* not found/);
      });
    });
  });
});
