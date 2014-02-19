var MediaControl = require('../spec_helper').MediaControl;
var Container = require('../spec_helper').Container;
var _ = require('underscore');

describe('MediaControl', function() {
  beforeEach(function() {
    this.container = new Container();
    this.control = new MediaControl({container: this.container});
  });

  it('should have a default template', function() {
    this.control.template = _.template("<div>foo</div>");
    this.control.template().should.be.equal("<div>foo</div>");
  });

  it('should be able to have a custom template', function() {
    this.control.template().should.be.equal("<div>MediaControl</div>");
  });

  it('should render the template into the element', function() {
    this.control.render().$el.html().should.be.equal("<div>MediaControl</div>");
  });

  it('should be able to update seekbar', function() {
      this.control.template = _.template('<input data-seekbar value="0"></input>');
      this.control.render();
      this.control.updateSeekBar(10);
      this.control.$('[data-seekbar]').val().should.be.equal('10');
  });

  it('should switch between containers', function() {
    var stopListening = sinon.spy(this.control, 'stopListening');
    var listenTo = sinon.spy(this.control, 'listenTo');
    var newContainer = new Container(); 
    this.control.setContainer(newContainer);

    stopListening.withArgs(this.container).calledOnce.should.be.true;
    listenTo.calledOnce.should.be.true;
  });

  describe('events', function() {
    beforeEach(function() {
      this.container = new Container();
      this.control = new MediaControl({container: this.container});
    });

    it('should react for clicks on play', function() {
      this.control.template = _.template('<div data-play></div>');
      var spy = sinon.spy(this.container, 'play');
      this.control.render();
      this.control.$('[data-play]').click();
      spy.called.should.be.true;
    });

    it('should react for clicks on pause', function() {
      this.control.template = _.template('<div data-pause></div>');
      var spy = sinon.spy(this.container, 'pause');
      this.control.render();
      this.control.$('[data-pause]').click();
      spy.called.should.be.true;
    });

    it('should react for clicks on stop', function() {
      this.control.template = _.template('<div data-stop></div>');
      var spy = sinon.spy(this.container, 'stop');
      this.control.render();
      this.control.$('[data-stop]').click();
      spy.called.should.be.true;
    });

    it('should react for clicks on the seekbar', function() {
      this.control.template = _.template('<input data-seekbar value="10"></input>');
      var spy = sinon.spy(this.container, 'setCurrentTime');
      this.control.render();
      this.control.$('[data-seekbar]').click();
      spy.called.should.be.true;
      spy.withArgs("10").calledOnce.should.be.true;
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
