var MediaControl = require('../spec_helper').MediaControl;
var Container = require('../spec_helper').Container;
var _ = require('underscore');

describe('MediaControl', function() {
  beforeEach(function() {
    this.container = new Container({settings: ['play', 'pause']});
    this.control = new MediaControl({container: this.container});
  });

  it('should have a custom template', function() {
    this.control.template = _.template("<div>foo</div>");
    this.control.template().should.be.equal("<div>foo</div>");
  });

  it('should be able to have a default template', function() {
    this.control.render().$el.html().should.be.equal("  <button data-play=\"\">play</button>   <button data-stop=\"\">stop</button>   <button data-pause=\"\">pause</button>   <input type=\"range\" value=\"0\" data-seekbar=\"\" />  <input type=\"range\" value=\"100\" data-volume=\"\" />");
  });

  it('should render the template into the element', function() {
    this.control.container.settings = ['play'];
    this.control.render().$el.html().should.be.equal("  <button data-play=\"\">play</button> ");
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
      var spy = sinon.spy(this.container, 'play');
      this.control.render();
      this.control.$('[data-play]').click();
      spy.called.should.be.true;
    });

    it('should react for clicks on pause', function() {
      var spy = sinon.spy(this.container, 'pause');
      this.control.render();
      this.control.$('[data-pause]').click();
      spy.called.should.be.true;
    });

    it('should react for clicks on stop', function() {
      var spy = sinon.spy(this.container, 'stop');
      this.control.render();
      this.control.$('[data-stop]').click();
      spy.called.should.be.true;
    });

    it('should react for clicks on the seekbar', function() {
      var spy = sinon.spy(this.container, 'setCurrentTime');
      this.control.render();
      this.control.$('[data-seekbar]').click();
      spy.called.should.be.true;
    });

    it("should change the container's volume", function() {
      var spy = sinon.spy(this.container, 'setVolume');
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
