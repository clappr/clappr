var Core = require('../spec_helper').Core;

describe('Core', function() {
  it('should create a playbackhandler', function() {
    var core = new Core({sources: ['http://globo.com/video.mp4'], player: {}});
    expect(core.playbackHandler).to.be.a('object');
  });
});
