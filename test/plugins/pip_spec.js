var PipPlugin = require('../spec_helper').PipPlugin;
var Core = require('../spec_helper').Core;

describe('PipPlugin', function() {
  it('should have only masterContainer for one source', function() {
    var core = new Core({sources: ['http://globo.com/video.mp4']});
    var pip = new PipPlugin(core);
    pip.should.have.property('masterContainer');
    pip.should.not.have.property('pipContainer');
  });

  it('should have pipContainer for two sources', function() {
    var core = new Core({sources: ['http://globo.com/video.mp4', 'http://bem.tv/test.mp4']});
    var pip = new PipPlugin(core);
    pip.should.have.property('masterContainer');
    pip.should.have.property('pipContainer');
  });

  it('should modify style of pip when receive two sources', function() {
    var core = new Core({sources: ['http://globo.com/video.mp4',
                                   'http://bem.tv/test.mp4']});
    var pip = new PipPlugin(core);
    expect(pip.pipContainer.$el.css('width')).to.equal("30%");
    expect(pip.pipContainer.$el.css('height')).to.equal("30%");
    expect(pip.pipContainer.$el.css('z-index')).to.equal("2");
  });
});
