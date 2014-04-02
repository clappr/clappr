var Core = require('../spec_helper').Core;

describe('Core', function() {
  window.WP3 = {};
  it('should create a playbackhandler', function() {
    var core = new Core({sources: ['http://globo.com/video.mp4']});
    expect(core.playbackHandler).to.be.a('object');
  });
});
