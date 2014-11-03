var HTML5Video = require('../src/playbacks/html5_video');

describe('HTML5Video', () => {
  it('should convert querystring seek regex in seconds', () => {
    this.playback = new HTML5Video({src: 'fakesrc.mp4', loop: false});

    var url = 'http://globotv.globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?t=1h10m30s'
    expect(this.playback.getInitialSeek(url)).to.equal(4230);

    url = 'http://globotv.globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?t=40s'
    expect(this.playback.getInitialSeek(url)).to.equal(40);

    url = 'http://globotv.globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?t=40s&stretch=false'
    expect(this.playback.getInitialSeek(url)).to.equal(40);

    url = 'http://globotv.globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?t=30m5s'
    expect(this.playback.getInitialSeek(url)).to.equal(1805);

    url = 'http://globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?autoPlay=true&t=5m5s'
    expect(this.playback.getInitialSeek(url)).to.equal(305);

    url = 'http://globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/'
    expect(this.playback.getInitialSeek(url)).to.equal(0);
  });
})


