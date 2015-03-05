var HTML5Video = require('../src/playbacks/html5_video');

describe('HTML5Video playback', () => {
  it('should check if canPlay resource', () => {
    expect(HTML5Video.canPlay("")).to.be.false;
    expect(HTML5Video.canPlay("resource_without_dots")).to.be.false;
    expect(HTML5Video.canPlay("http://domain.com/video.mp4")).to.be.true;
    expect(HTML5Video.canPlay("http://domain.com/video.mp4?query_string=here")).to.be.true;
    expect(HTML5Video.canPlay("/relative/video.mp4")).to.be.true;
  });
})
