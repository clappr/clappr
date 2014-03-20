var PipPlugin = require('../spec_helper').PipPlugin;
var Core = require('../spec_helper').Core;

describe('PipPlugin', function() {
  var assertPipStyle = function(container) {
    expect(container.$el.css('width')).to.equal("30%");
    expect(container.$el.css('height')).to.equal("30%");
    expect(container.$el.css('z-index')).to.equal("20");
    expect(container.$el.css('bottom')).to.equal("7px");
    expect(container.$el.css('right')).to.equal("7px");
  };
  var assertMasterStyle = function(container) {
    expect(container.$el.css('width')).to.equal("100%");
    expect(container.$el.css('height')).to.equal("100%");
    expect(container.$el.css('z-index')).to.equal("1");
    expect(container.$el.css('bottom')).to.equal("0px");
    expect(container.$el.css('right')).to.equal("0px");
  };


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
    var core = new Core({sources: ['http://globo.com/video.mp4', 'http://bem.tv/test.mp4']});
    var pip = new PipPlugin(core);
    assertPipStyle(pip.pipContainer);
  });

  it('should add new source as pip', function() {
    var core = new Core({sources: ['http://globo.com/video.mp4']});
    var pip = new PipPlugin(core);
    pip.addPip('http://globo.com/video2.mp4');
    pip.should.have.property('pipContainer');
    expect(core.containers).to.have.length(2);
    assertPipStyle(pip.pipContainer);
  });

  it('should drop current pip when adding another pip', function() {
    var core = new Core({sources: ['http://globo.com/video.mp4', 'http://bem.tv/test.mp4']});
    var pip = new PipPlugin(core);
    expect(pip.pipContainer.getPluginByName('html5_video_playback').el.src).to.equal('http://bem.tv/test.mp4');
    expect(core.containers).to.have.length(2);

    pip.addPip('http://globo.com/video2.mp4');
    expect(pip.pipContainer.getPluginByName('html5_video_playback').el.src).to.equal('http://globo.com/video2.mp4');
    expect(core.containers).to.have.length(2);
    assertPipStyle(pip.pipContainer);
  });

  it('should put principal on pip and discard pip when adding another master', function() {
    var core = new Core({sources: ['http://globo.com/master.mp4', 'http://globo.com/pip.mp4']});
    var pip = new PipPlugin(core);
    expect(pip.pipContainer.getPluginByName('html5_video_playback').el.src).to.equal('http://globo.com/pip.mp4');
    expect(core.containers).to.have.length(2);
    pip.addMaster("http://globo.com/newMaster.mp4");

    expect(pip.pipContainer.getPluginByName('html5_video_playback').el.src).to.equal('http://globo.com/master.mp4');
    expect(pip.masterContainer.getPluginByName('html5_video_playback').el.src).to.equal('http://globo.com/newMaster.mp4');
    expect(core.containers).to.have.length(2);
    assertPipStyle(pip.pipContainer);
  });

  it('should only discard pip on addMaster() if it exists', function() {
    var core = new Core({sources: ['http://globo.com/master.mp4']});
    var pip = new PipPlugin(core);
    var spy = sinon.spy(pip, 'discardPip');
    pip.addMaster("http://globo.com/newMaster.mp4");
    spy.called.should.be.false;
  });

  it('should only put master on pip on addMaster() if it exists', function() {
    var core = new Core({sources: ['http://globo.com/master.mp4']});
    var pip = new PipPlugin(core);
    var spy = sinon.spy(pip, 'setPipStyle');
    pip.discardMaster();
    pip.addMaster("http://globo.com/newMaster.mp4");
    spy.called.should.be.false;
  });


  it('should turn off pip', function() {
    var core = new Core({sources: ['http://globo.com/master.mp4','http://globo.com/pip.mp4']});
    var pip = new PipPlugin(core);
    pip.discardPip();
    pip.should.not.have.property('pipContainer');
    expect(core.containers).to.have.length(1);
  });

  it('should be possible to turn off master', function() {
    var core = new Core({sources: ['http://globo.com/master.mp4','http://globo.com/pip.mp4']});
    var pip = new PipPlugin(core);
    pip.discardMaster();
    pip.should.not.have.property('masterContainer');
    expect(core.containers).to.have.length(1);
  });

  it('should be possible to move master to pip and discard pip', function() {
    var core = new Core({sources: ['http://globo.com/master.mp4','http://globo.com/pip.mp4']});
    var pip = new PipPlugin(core);
    pip.masterToPip();
    expect(pip.pipContainer.getPluginByName('html5_video_playback').el.src).to.equal('http://globo.com/master.mp4');
    expect(core.containers).to.have.length(1);
    assertPipStyle(pip.pipContainer);
  });

  it('should be possible to move pip to master and discard master', function() {
    var core = new Core({sources: ['http://globo.com/master.mp4','http://globo.com/pip.mp4']});
    var pip = new PipPlugin(core);
    pip.pipToMaster();
    expect(pip.masterContainer.getPluginByName('html5_video_playback').el.src).to.equal('http://globo.com/pip.mp4');
    expect(core.containers).to.have.length(1);
    assertMasterStyle(pip.masterContainer);
  });


});
