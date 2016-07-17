import HTML5Video from 'playbacks/html5_video'
import Events from 'base/events.js'

import $ from 'clappr-zepto'

describe('HTML5Video playback', function() {
  beforeEach(function() {
    this.options = {src: 'http://example.com/dash.ogg'}
  })

  it('checks if it can play a resource', function() {
    expect(HTML5Video.canPlay('')).to.be.false
    expect(HTML5Video.canPlay('resource_without_dots')).to.be.false
    expect(HTML5Video.canPlay('http://domain.com/video.ogv')).to.be.true
    expect(HTML5Video.canPlay('http://domain.com/video.ogv?query_string=here')).to.be.true
    expect(HTML5Video.canPlay('/relative/video.ogv')).to.be.true
  })

  it('checks if it can play a resource with mime-type', function() {
    expect(HTML5Video.canPlay('resource_without_dots', 'video/ogg; codecs="theora, vorbis"')).to.be.true
  })

  it('does set a valid src to video element', function() {
    const playback = new HTML5Video(this.options)
    expect(playback._src).to.be.equals('http://example.com/dash.ogg')
  })

  it('starts not ready', function() {
    const playback = new HTML5Video(this.options)

    expect(playback.isReady).to.be.undefined
  })

  it('can be ready', function() {
    const playback = new HTML5Video(this.options)
    playback._ready()

    expect(playback.isReady).to.be.true
  })

  it('triggers PLAYBACK_PLAY_INTENT on play request', function() {
    var thereWasPlayIntent = false
    const playback = new HTML5Video(this.options)

    playback.on(Events.PLAYBACK_PLAY_INTENT, function() {
      thereWasPlayIntent = true
    })

    playback.play()

    expect(thereWasPlayIntent).to.be.true
  })

  it('isPlaying() is true immediately when autoPlay is true', function() {
    const playback = new HTML5Video({src: 'http://example.com/dash.ogg', autoPlay: true})
    expect(playback.isPlaying()).to.be.true
  })

  it('setup crossorigin attribute', function() {
    const options = $.extend({playback: {crossOrigin: 'use-credentials'}}, this.options)
    const playback = new HTML5Video(options)

    expect(playback.el.crossOrigin).to.be.equal('use-credentials')
  })

  it('enables inline playback for webviews when playInline flag is set', function() {
    const options = $.extend({playback: {playInline: true}}, this.options)
    const playback = new HTML5Video(options)
    expect(playback.el['x-webkit-playsinline']).to.be.true
  })

  it('allows displaying default video tag controls', function() {
    const options = $.extend({playback: {controls: 'controls'}}, this.options)
    const playback = new HTML5Video(options)
    expect(playback.el.controls).to.be.true
  })

  describe('audio resources', function() {
    it('should be able to play audio resources', function() {
      expect(HTML5Video.canPlay('http://domain.com/Audio.oga')).to.be.true
      expect(HTML5Video.canPlay('http://domain.com/Audio.oga?query_string=here')).to.be.true
      expect(HTML5Video.canPlay('/relative/Audio.oga')).to.be.true
      expect(HTML5Video.canPlay('/relative/Audio.wav')).to.be.true
    })

    it('should play audio resources on an audio tag', function() {
      const options = { src: 'http://example.com/dash.oga' }
      const playback = new HTML5Video(options)
      expect(playback.tagName).to.be.equal('audio')
    })

    it('should use an audio tag when the audioOnly option is set to true', function() {
      const options = {
        src: 'http://example.com/dash.m3u8',
        playback: { audioOnly: true }
      }
      const playback = new HTML5Video(options)
      expect(playback.tagName).to.be.equal('audio')
    })

    it('should not play video resources on an audio tag if audioOnly flag is not set', function() {
      const options = { src: 'http://example.com/dash.m3u8' }
      const playback = new HTML5Video(options)
      expect(playback.isAudioOnly).to.be.false
      expect(playback.tagName).to.be.equal('video')
    })
  })
})
