import HTML5Video from '../../src/playbacks/html5_video'

describe('HTML5Video playback', function() {
  it('should check if canPlay resource', function() {
    expect(HTML5Video.canPlay("")).to.be.false
    expect(HTML5Video.canPlay("resource_without_dots")).to.be.false
    expect(HTML5Video.canPlay("http://domain.com/video.ogv")).to.be.true
    expect(HTML5Video.canPlay("http://domain.com/video.ogv?query_string=here")).to.be.true
    expect(HTML5Video.canPlay("/relative/video.ogv")).to.be.true
  })
})
