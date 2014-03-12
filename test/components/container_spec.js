var Container = require('../spec_helper').Container;
var BaseObject = require('../spec_helper').BaseObject;
var StatsPlugin = require('../spec_helper').StatsPlugin;

describe('Container', function() {
  beforeEach(function() {
    this.container = new Container();
  });

  it('has a data-container attribute', function() {
    this.container.render();
    expect(this.container.$el.attr('data-container')).to.equal('');
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
      this.container.stop();
      expect(this.spy.withArgs('container:stop').calledOnce).to.be.true;
    });

    it('#pause', function() {
      this.container.pause();
      expect(this.spy.withArgs('container:pause').calledOnce).to.be.true;
    });

    it('#setCurrentTime', function() {
      this.container.setCurrentTime(300);
      expect(this.spy.withArgs('container:seek', 300).calledOnce).to.be.true;
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
  });
  describe('plugins', function() {
    it('#addPlugin', function() {
      expect(this.container.plugins.length).to.equal(0);
      this.container.addPlugin({plugin: {}, type: 'ui'});
      expect(this.container.plugins.length).to.equal(1);
    });

    it('#disablePlugins', function() {
      var disable = sinon.spy();
      var plugin = {disable: disable};
      this.container.addPlugin(plugin);
      this.container.disablePlugins();
      expect(disable.calledOnce).to.be.true;
    });

    it('disable plugins by type', function() {
      var disable = sinon.spy();
      var plugin1 = {disable: disable, type: 'ui'};
      var plugin2 = {disable: disable, type: 'stats'};
      this.container.addPlugin(plugin1);
      this.container.addPlugin(plugin2);
      this.container.disablePlugins('ui');
      expect(disable.calledOnce).to.be.true;
    });

    it('#enablePlugins', function() {
      var disable = sinon.spy();
      var enable = sinon.spy();
      var plugin = {enable: enable, disable: disable};
      this.container.addPlugin(plugin);
      this.container.disablePlugins();
      this.container.enablePlugins();
      expect(enable.calledOnce).to.be.true;
    });

    it('enable plugins by type', function() {
      var disable = sinon.spy();
      var enable = sinon.spy();
      var plugin = {enable: enable, disable: disable, type: 'ui'};
      var plugin2 = {enable: enable, disable: disable, type: 'ui'};
      this.container.addPlugin(plugin);
      this.container.disablePlugins('ui');
      this.container.enablePlugins('ui');
      expect(enable.calledOnce).to.be.true;
    });
  });
});
