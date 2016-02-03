import HLS from 'playbacks/hls'

describe('HLS playback', () => {
  var playback;

  beforeEach(() => {
    var options = {src: 'http://example.com/foo.m3u8'}
    playback = new HLS(options);
    playback.setupHls();
    // XXX: Monkeypatching deep into hls.js to support our test. Demeter would be sad :(
    playback.hls.levelController._levels = [];
    playback.fillLevels();
  });

  it('supports specifying the level', () => {

    // AUTO by default (-1)
    expect(playback.currentLevel).to.equal(-1);

    // supports other level specification
    playback.currentLevel = 0;
    expect(playback.currentLevel).to.equal(0);
    playback.currentLevel = 1;
    expect(playback.currentLevel).to.equal(1);
  })
})
