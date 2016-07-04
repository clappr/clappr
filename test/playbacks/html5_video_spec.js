import HTML5Video from 'playbacks/html5_video'
import Events from 'base/events.js'

describe('HTML5Video playback', () => {
  it('checks if it can play a resource', () => {
    expect(HTML5Video.canPlay('')).to.be.false
    expect(HTML5Video.canPlay('resource_without_dots')).to.be.false
    expect(HTML5Video.canPlay('http://domain.com/video.ogv')).to.be.true
    expect(HTML5Video.canPlay('http://domain.com/video.ogv?query_string=here')).to.be.true
    expect(HTML5Video.canPlay('/relative/video.ogv')).to.be.true
  })

  it('checks if it can play a resource with mime-type', () => {
    expect(HTML5Video.canPlay('resource_without_dots', 'video/ogg; codecs="theora, vorbis"')).to.be.true
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

  it('triggers PLAYBACK_PLAY_INTENT on play request', () => {
    var thereWasPlayIntent = false
    var options = {src: 'http://example.com/dash.ogg'}
    var playback = new HTML5Video(options)

    playback.on(Events.PLAYBACK_PLAY_INTENT, function() {
      thereWasPlayIntent = true
    })

    playback.play()

    expect(thereWasPlayIntent).to.be.true
  })

  it('setup crossorigin attribute', () => {
    var options = {
      src: 'http://example.com/dash.ogg',
      playback: {crossOrigin: 'use-credentials'}
    }
    var playback = new HTML5Video(options)

    expect(playback.el.crossOrigin).to.be.equal('use-credentials')
  })

  describe('audio resources', () => {
    it('should be able to play audio resources', () => {
      expect(HTML5Video.canPlay('http://domain.com/Audio.oga')).to.be.true
      expect(HTML5Video.canPlay('http://domain.com/Audio.oga?query_string=here')).to.be.true
      expect(HTML5Video.canPlay('/relative/Audio.oga')).to.be.true
      expect(HTML5Video.canPlay('/relative/Audio.mp3')).to.be.true
    })

    it('should play audio resources on an audio tag', () => {
      var options = { src: 'http://example.com/dash.oga' }
      var playback = new HTML5Video(options)
      expect(playback.tagName).to.be.equal('audio')
    })

    it('should use an audio tag when the audioOnly option is set to true', () => {
      var options = {
        src: 'http://example.com/dash.m3u8',
        playback: { audioOnly: true }
      }
      var playback = new HTML5Video(options)
      expect(playback.tagName).to.be.equal('audio')
    })
  })
})
