var Container = require('../spec_helper').Container;

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
});
