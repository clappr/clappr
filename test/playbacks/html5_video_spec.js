import HTML5Video from 'playbacks/html5_video'

describe('HTML5Video playback', () => {
  it('checks if it can play a resource', () => {
    expect(HTML5Video.canPlay("")).to.be.false
    expect(HTML5Video.canPlay("resource_without_dots")).to.be.false
    expect(HTML5Video.canPlay("http://domain.com/video.ogv")).to.be.true
    expect(HTML5Video.canPlay("http://domain.com/video.ogv?query_string=here")).to.be.true
    expect(HTML5Video.canPlay("/relative/video.ogv")).to.be.true
  })

  it('checks if it can play a resource with mime-type', () => {
    expect(HTML5Video.canPlay("resource_without_dots", 'video/ogg; codecs="theora, vorbis"')).to.be.true
  })

  it('does set a valid src to video element', () => {
    var options = {src: 'http://example.com/dash.ogg'}
    var playback = new HTML5Video(options)

    expect(playback._src).to.be.equals('http://example.com/dash.ogg')
  })

  it('starts not ready', () => {
    var options = {src: 'http://example.com/dash.ogg'}
    var playback = new HTML5Video(options)

    expect(playback.isReady).to.be.undefined
  })

  it('can be ready', () => {
    var options = {src: 'http://example.com/dash.ogg'}
    var playback = new HTML5Video(options)
    playback._ready()

    expect(playback.isReady).to.be.true
  })

  it('setup crossorigin attribute', () => {
    var options = {
      src: 'http://example.com/dash.ogg',
      playbackConfig: {crossorigin: 'use-credentials'}
    }
    var playback = new HTML5Video(options)

    expect(playback.el.crossorigin).to.be.equal('use-credentials')
  })
})
