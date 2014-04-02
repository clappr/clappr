var MediaControl = require('../spec_helper').MediaControl;
var Container = require('../spec_helper').Container;
var FakePlayback = require('../spec_helper').FakePlayback;
var _ = require('underscore');

describe('MediaControl', function() {
  beforeEach(function() {
    this.playback = new FakePlayback();
    this.container = new Container({settings: ['play', 'pause'], playback: this.playback});
    this.control = new MediaControl({container: this.container});
  });

  it('should have a custom template', function() {
    this.control.template = _.template("<div>foo</div>");
    this.control.template().should.be.equal("<div>foo</div>");
  });

  it('should be able to have a default template', function() {
    this.control.render().$el.html().should.not.be.equal('');
  });

  it('should render the template into the element', function() {
    this.control.container.settings = {left: ['play']};
    this.control.render();
    this.control.$el.find('button').attr('data-play').should.not.be.equal(undefined);
  });

  it('should switch between containers', function() {
    var stopListening = sinon.spy(this.control, 'stopListening');
    var listenTo = sinon.spy(this.control, 'listenTo');
    var newContainer = new Container({playback: this.playback});
    this.control.setContainer(newContainer);

    stopListening.withArgs(this.container).calledOnce.should.be.true;
    listenTo.withArgs(newContainer, 'container:timeupdate').calledOnce.should.be.true;
  });

  describe('events', function() {
    beforeEach(function() {
      this.container = new Container({playback: this.playback});
      this.control = new MediaControl({container: this.container});
    });

    it('should react for clicks on play', function() {
      var spy = sinon.spy(this.container, 'play');
      this.control.container.settings = {left: ['play']}
      this.control.render();
      this.control.$('[data-play]').click();
      spy.called.should.be.true;
    });

    it('should react for clicks on pause', function() {
      var spy = sinon.spy(this.container, 'pause');
      this.control.container.settings = {left: ['pause']};
      this.control.render();
      this.control.$('[data-pause]').click();
      spy.called.should.be.true;
    });

    it('should react for clicks on stop', function() {
      var spy = sinon.stub(this.container, 'stop');
      this.control.container.settings = {left: ['stop']}
      this.control.render();
      this.control.$('[data-stop]').click();
      spy.called.should.be.true;
    });

    it('should react for clicks on the seekbar', function() {
      var spy = sinon.stub(this.container, 'setCurrentTime');
      this.control.container.settings = {left: ['seekbar']};
      this.control.render();
      this.control.$('[data-seekbar]').click();
      spy.called.should.be.true;
    });

    it("should change the container's volume", function() {
      var spy = sinon.spy(this.container, 'setVolume');
      this.control.container.settings = {left: ['volume']};
      this.control.render();
      this.control.$('[data-volume]').click();
      spy.called.should.be.true;
    });

    it('should react for clicks on the fullscreen button', function() {
      this.control.template = _.template('<div data-fullscreen></div>');
      var spy = sinon.spy(this.control, 'trigger');
      this.control.render();
      this.control.$('[data-fullscreen]').click();
      spy.withArgs('mediacontrol:fullscreen').calledOnce.should.be.true;
    });
  });
});
