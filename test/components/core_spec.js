var Core = require('../spec_helper').Core;

describe('Core', function() {
  it('should create a playbackhandler', function() {
    var core = new Core({sources: ['http://globo.com/video.mp4']});
    expect(core.playbackHandler).to.be.a('object');
  });

  it('should create a mediacontrol', function() {
    var core = new Core({sources: ['http://globo.com/video.mp4']});
    expect(core.mediaControl).to.be.a('object');
  });

  it('should have containers', function() {
    var core = new Core({sources: ['http://globo.com/video.mp4']});
    expect(core.containers).to.be.a('Array');
  });

});
