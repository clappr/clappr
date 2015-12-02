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
    expect(HTML5Video.canPlay("resource_without_dots", 'video/mp4;"codecs=mp4v.20.8,mp4a.40.2"')).to.be.true
  })

  it('does set a valid src to video element', () => {
    var options = {src: 'http://example.com/dash.mp4'}
    var playback = new HTML5Video(options)

    expect(playback.src).to.be.equals('http://example.com/dash.mp4')
  })

  it('does not set an invalid src to video element', () => {
    // although clappr can play dash.mpd it uses MSE, this is done to avoid to create source tag with invalid src
    var options = {src: 'http://example.com/dash.mpd'}
    var playback = new HTML5Video(options)

    expect(playback.src).to.be.equals(undefined)
  })
})
