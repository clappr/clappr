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
    let thereWasPlayIntent = false
    const playback = new HTML5Video(this.options)

    playback.on(Events.PLAYBACK_PLAY_INTENT, function() {
      thereWasPlayIntent = true
    })

    playback.play()

    expect(thereWasPlayIntent).to.be.true
  })

  it('isPlaying() is true after constructor when autoPlay is true', function(done) {
    const playback = new HTML5Video({src: 'http://example.com/dash.ogg', autoPlay: true})
    process.nextTick(function(){
      expect(playback.isPlaying()).to.be.true
      done()
    })
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
    expect(playback.el.getAttribute('playsinline')).equal('playsinline')
  })

  it('allows displaying default video tag controls', function() {
    const options = $.extend({playback: {controls: 'controls'}}, this.options)
    const playback = new HTML5Video(options)
    expect(playback.el.controls).to.be.true
  })

  it('mute or unmute video element when volume is changed', function() {
    const playback = new HTML5Video(this.options)

    expect(playback.el.getAttribute('muted')).to.be.null
    expect(playback.el.muted).to.be.false
    playback.volume(0)
    expect(playback.el.getAttribute('muted')).equal('true')
    expect(playback.el.muted).to.be.true
    playback.volume(0.5)
    expect(playback.el.getAttribute('muted')).to.be.null
    expect(playback.el.muted).to.be.false
  })

  describe('progress', function() {
    let start, end, currentTime
    const duration = 300
    beforeEach(function() {
      this.playback = new HTML5Video(this.options)
      currentTime = 0
      start = [0]
      end = [30]
      const fakeEl = {
        get currentTime() { return currentTime },
        get duration() { return duration },
        get buffered() { return {start: (i) => start[i], end: (i) => end[i], get length() { return start.length }} }
      }
      this.playback.setElement(fakeEl)
    })

    it('should trigger PLAYBACK_PROGRESS with current buffer position', function() {
      let progress
      this.playback.on(Events.PLAYBACK_PROGRESS, function(currentProgress) {
        progress = currentProgress
      })
      this.playback._onProgress() // cannot trigger event on fake element (improve later?)
      expect(progress.start).to.be.equal(start[0])
      expect(progress.current).to.be.equal(end[0])
      expect(progress.total).to.be.equal(duration)
    })

    it('should find current buffer position', function() {
      start = [0, 50, 180]
      end = [30, 90, 280]
      currentTime = 75 // this should be located at index 1
      let progress
      this.playback.on(Events.PLAYBACK_PROGRESS, function(currentProgress) {
        progress = currentProgress
      })
      this.playback._onProgress() // cannot trigger event on fake element (improve later?)
      expect(progress.start).to.be.equal(start[1])
      expect(progress.current).to.be.equal(end[1])
    })

    it('should return an array of buffer segments as {start, end} objects', function() {
      start = [0, 50, 180]
      end = [30, 90, 280]
      let buffered
      this.playback.on(Events.PLAYBACK_PROGRESS, function(currentProgress, bufferedSegments) {
        buffered = bufferedSegments
      })
      this.playback._onProgress() // cannot trigger event on fake element (improve later?)
      expect(buffered.length).to.be.equal(start.length)
      expect(buffered[0]).to.deep.equal({start: start[0], end: end[0]})
      expect(buffered[1]).to.deep.equal({start: start[1], end: end[1]})
      expect(buffered[2]).to.deep.equal({start: start[2], end: end[2]})
    })
  })

  it('should be able to identify it can play resources independently of the file extension case', function() {
    expect(HTML5Video.canPlay('/relative/video.ogg')).to.be.true
    expect(HTML5Video.canPlay('/relative/VIDEO.OGG')).to.be.true
  })

  describe('options', function() {
    it('should use the playback object within player options', function() {
      const options = {
        src: 'http://example.com/video.m3u8',
        nonPlaybackOption: false,
        playback: {
          somePlaybackOption: true
        }
      }
      const html5Video = new HTML5Video(options)
      expect(html5Video.options.playback.somePlaybackOption).to.be.true
      expect(html5Video.options.playback).not.to.include.keys('nonPlaybackOption')
    })

    it('should use hlsjsConfig from player options as fallback', function() {
      const options = {
        src: 'http://example.com/video.m3u8',
        nonPlaybackOption: false,
        somePlaybackOption: true
      }
      const html5Video = new HTML5Video(options)
      expect(html5Video.options.playback.somePlaybackOption).to.be.true
      expect(html5Video.options.playback.nonPlaybackOption).to.be.false
    })
  })

  describe('video element', function() {
    it('should set src url from options', function() {
      const options = {
        src: 'http://example.com/some_source?query_string=here',
        mimeType: 'application/x-mpegURL'
      }
      const html5Video = new HTML5Video(options)
      html5Video.render()
      expect(html5Video.el.getAttribute('src')).to.be.equal(options.src)
    })

    it('should have src attribute removed after stop, and then added after play', function() {
      const options = {
        src: 'http://example.com/video.mp4'
      }
      const html5Video = new HTML5Video(options)
      html5Video.render()
      html5Video.play()
      html5Video.stop()
      expect(html5Video.el.hasAttribute('src')).to.be.false
      html5Video.play()
      expect(html5Video.el.getAttribute('src')).to.be.equal(options.src)
    })
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

    it('should not play video resources on an audio tag if audioOnly flag is not set and a video mime-type is set', function() {
      const options = { src: 'http://example.com/video.mp4', mimeType: 'video/mp4' }
      const playback = new HTML5Video(options)
      expect(playback.isAudioOnly).to.be.false
      expect(playback.tagName).to.be.equal('video')
    })

    it('should play on audio tag if audioOnly flag is not set and the mime-type specified is audio only', function() {
      let options = { src: 'http://example.com/audio?some_parameter=value', mimeType: 'audio/ogg' },
        playback = new HTML5Video(options)
      expect(playback.isAudioOnly).to.be.true
      expect(playback.tagName).to.be.equal('audio')

      options = { src: 'http://example.com/audio?some_parameter=value', mimeType: 'audio/wav' }
      playback = new HTML5Video(options)
      expect(playback.isAudioOnly).to.be.true
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
