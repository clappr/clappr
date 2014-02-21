var Core = require('../spec_helper').Core;

describe('Core', function() {
  it('should receive embed parameters', function() {
    var core = new Core({width: 320, height: 240, el: "div_here"});
    core.embedParams.should.have.property("width");
    core.embedParams.should.have.property("height");
    core.embedParams.should.have.property("el");
  });

  it('should create a playbackhandler', function() {
    var core = new Core({'src': 'http://globo.com/video.mp4'});
    expect(core.playbackHandler).to.be.a('object');
  });
});
