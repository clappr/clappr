var FakePlayback = require('playback');
var Container = require('container');
var Poster = require('../src/plugins/poster');

describe('Poster', () => {
  beforeEach(() => {
    this.playback = new FakePlayback();
    this.container = new Container({playback: this.playback});
    this.poster = new Poster({container: this.container});
    this.container.addPlugin(this.poster);
  });

  it('is named poster', () => {
    expect(this.poster.name).to.equal('poster');
  });

  it('disable media control by default', () => {
    expect(this.container.mediaControlDisabled).to.be.true;
  });

  it('listens to container:state:buffering event', () => {
    sinon.spy(this.poster, 'hidePlayButton');
    this.container.trigger('container:state:buffering');
    expect(this.poster.hidePlayButton).called.once;
    expect(this.poster.$playButton.is(':visible')).to.be.false;
  });

  it('listens to container:bufferful event', () => {
    sinon.spy(this.poster, 'onBufferfull');
    this.poster.bindEvents();
    this.container.trigger('container:state:bufferfull');

    expect(this.poster.onBufferfull).called.once;
//    expect(this.poster.$el.is(':visible')).to.be.false;
  });

  it('listens to container:stop event', () => {
    sinon.spy(this.container, 'disableMediaControl');
    sinon.spy(this.poster, 'showPlayButton');
    this.container.trigger('container:stop');

    expect(this.container.disableMediaControl).called.once;
    expect(this.poster.showPlayButton).called.once;

    sinon.spy(this.poster, 'onStop');
    this.poster.bindEvents();

    this.container.trigger('container:stop');

    expect(this.poster.onStop).called.once;
  });

  it('listens treats container:ended event as container:stop', () => {
    sinon.spy(this.container, 'disableMediaControl');
    sinon.spy(this.poster, 'showPlayButton');
    this.container.trigger('container:ended');

    expect(this.container.disableMediaControl).called.once;
    expect(this.poster.showPlayButton).called.once;

    var spy = sinon.spy(this.poster, 'onStop');
    this.poster.bindEvents();

    this.container.trigger('container:stop');

    expect(spy).called.once;
  });

  it('plays the container on click', () => {
    sinon.spy(this.container, 'play');
    $(this.poster.$el).click();
    expect(this.container.play).called.once;
  });
});
