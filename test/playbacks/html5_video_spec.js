import HTML5Video from 'playbacks/html5_video'
import Events from 'base/events.js'

import $ from 'clappr-zepto'

describe('HTML5Video playback', function() {
  beforeEach(function() {
    this.options = { src: 'http://example.com/dash.ogg' }
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
    const callback = sinon.spy()
    const playback = new HTML5Video(this.options)

    playback.on(Events.PLAYBACK_PLAY_INTENT, callback)
    playback.play()

    callback.should.have.been.calledOnce
  })

  it('trigger PLAYBACK_SEEK on media seeking event', function(done) {
    this.timeout(5000)
    const callback = sinon.spy()
    const playback = new HTML5Video({ src: '/test/fixtures/SampleVideo_360x240_1mb.mp4' })

    playback.on(Events.PLAYBACK_SEEK, callback)
    playback.on(Events.PLAYBACK_SEEK, () => {
      callback.should.have.been.calledOnce
      done()
    }, this)

    playback.el.dispatchEvent(new Event('seeking'))
  })

  it('triggers PLAYBACK_SEEKED on media seeked event', function(done) {
    this.timeout(5000)
    const callback = sinon.spy()
    const playback = new HTML5Video({ src: '/test/fixtures/SampleVideo_360x240_1mb.mp4' })

    playback.on(Events.PLAYBACK_SEEKED, callback)
    playback.on(Events.PLAYBACK_SEEKED, () => {
      callback.should.have.been.calledOnce
      done()
    }, this)

    playback.el.dispatchEvent(new Event('seeked'))
  })

  it('isPlaying() is true after constructor when autoPlay is true', function(done) {
    const playback = new HTML5Video({ src: 'http://example.com/dash.ogg', autoPlay: true })
    process.nextTick(function(){
      expect(playback.isPlaying()).to.be.true
      done()
    })
  })

  it('setup crossorigin attribute', function() {
    const options = $.extend({ playback: { crossOrigin: 'use-credentials' } }, this.options)
    const playback = new HTML5Video(options)

    expect(playback.el.crossOrigin).to.be.equal('use-credentials')
    expect(playback.el.getAttribute('crossorigin')).equal('use-credentials')
  })

  it('enables inline playback for webviews when playInline flag is set', function() {
    const options = $.extend({ playback: { playInline: true } }, this.options)
    const playback = new HTML5Video(options)

    expect(playback.el['x-webkit-playsinline']).to.be.true
    expect(playback.el.getAttribute('playsinline')).equal('playsinline')
  })

  it('allows displaying default video tag controls', function() {
    const options = $.extend({ playback: { controls: 'controls' } }, this.options)
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

  it('setup external tracks', function() {
    let newTrackUrl = () => { URL.createObjectURL(new Blob([], { type: 'text/vtt' })) }
    const options = $.extend({ playback: {
      externalTracks: [
        { lang: 'en', label: 'English', src: newTrackUrl(), kind: 'subtitles' },
        { lang: 'fr', label: 'French', src: newTrackUrl() }
      ]
    } }, this.options)
    const playback = new HTML5Video(options)
    playback.render()
    const $tracks = playback.$el.find('track[data-html5-video-track]')

    expect($tracks[0].getAttribute('data-html5-video-track')).to.be.equal('0')
    expect($tracks[0].getAttribute('kind')).to.be.equal('subtitles')
    expect($tracks[0].getAttribute('label')).to.be.equal('English')
    expect($tracks[0].getAttribute('srclang')).to.be.equal('en')

    expect($tracks[1].getAttribute('data-html5-video-track')).to.be.equal('1')
    expect($tracks[1].getAttribute('kind')).to.be.equal('subtitles')
    expect($tracks[1].getAttribute('label')).to.be.equal('French')
    expect($tracks[1].getAttribute('srclang')).to.be.equal('fr')
  })

  it('can switch text tracks', function() {
    let newTrackUrl = () => { URL.createObjectURL(new Blob([], { type: 'text/vtt' })) }
    const options = $.extend({ playback: {
      externalTracks: [
        { lang: 'en', label: 'English', src: newTrackUrl(), kind: 'subtitles' },
        { lang: 'fr', label: 'French', src: newTrackUrl() }
      ]
    } }, this.options)
    const playback = new HTML5Video(options)
    playback.render()

    expect(playback.hasClosedCaptionsTracks).to.be.true
    expect(playback.closedCaptionsTracks.length).equal(2)
    expect(playback.closedCaptionsTrackId).equal(-1)
    expect(playback.closedCaptionsTracks[0].track.mode).to.not.equal('showing')
    expect(playback.closedCaptionsTracks[1].track.mode).to.not.equal('showing')

    playback.closedCaptionsTrackId = 0
    expect(playback.closedCaptionsTrackId).equal(0)
    expect(playback.closedCaptionsTracks[0].track.mode).equal('showing')
    expect(playback.closedCaptionsTracks[1].track.mode).to.not.equal('showing')

    playback.closedCaptionsTrackId = 1
    expect(playback.closedCaptionsTrackId).equal(1)
    expect(playback.closedCaptionsTracks[0].track.mode).to.not.equal('showing')
    expect(playback.closedCaptionsTracks[1].track.mode).equal('showing')

    playback.closedCaptionsTrackId = -1
    expect(playback.closedCaptionsTrackId).equal(-1)
    expect(playback.closedCaptionsTracks[0].track.mode).to.not.equal('showing')
    expect(playback.closedCaptionsTracks[1].track.mode).to.not.equal('showing')
  })

  describe('progress', function() {
    let start, end, currentTime
    const duration = 300
    const fakeEl = {
      get currentTime() { return currentTime },
      get duration() { return duration },
      get buffered() { return { start: (i) => start[i], end: (i) => end[i], get length() { return start.length } } }
    }

    beforeEach(function() {
      currentTime = 0
      start = [0]
      end = [30]

      this.callback = sinon.spy()
      this.playback = new HTML5Video(this.options)
      this.playback.setElement(fakeEl)
      this.playback.on(Events.PLAYBACK_PROGRESS, this.callback)
    })

    it('should trigger PLAYBACK_PROGRESS with current buffer position', function() {
      this.playback._onProgress() // cannot trigger event on fake element (improve later?)
      let currentProgess = this.callback.getCall(0).args[0]

      expect(currentProgess.start).to.be.equal(start[0])
      expect(currentProgess.current).to.be.equal(end[0])
      expect(currentProgess.total).to.be.equal(duration)
    })

    it('should find current buffer position', function() {
      start = [0, 50, 180]
      end = [30, 90, 280]
      currentTime = 75 // this should be located at index 1

      this.playback._onProgress() // cannot trigger event on fake element (improve later?)
      let progress = this.callback.getCall(0).args[0]

      expect(progress.start).to.be.equal(start[1])
      expect(progress.current).to.be.equal(end[1])
    })

    it('does not trigger buffer event when the playback is initialized', function() {
      /*
        Only trigger buffer events when buffer state change. 
        The default value for _bufferState is false.
      */

      let builtInEvents = ['loadedmetadata', 'progress', 'timeupdate'].map(
        function(label) {
          return new Event(label)
        }
      )

      let callback = sinon.spy()
      let playback = new HTML5Video(this.options)

      playback.on(Events.PLAYBACK_BUFFERING, callback)
      playback.on(Events.PLAYBACK_BUFFERFULL, callback)

      builtInEvents.map(function(event) { playback.el.dispatchEvent(event) })
      callback.should.not.have.been.called
    })

    it('should return an array of buffer segments as {start, end} objects', function() {
      start = [0, 50, 180]
      end = [30, 90, 280]

      this.playback._onProgress() // cannot trigger event on fake element (improve later?)
      let buffered = this.callback.getCall(0).args[1]

      expect(buffered.length).to.be.equal(start.length)
      expect(buffered[0]).to.deep.equal({ start: start[0], end: end[0] })
      expect(buffered[1]).to.deep.equal({ start: start[1], end: end[1] })
      expect(buffered[2]).to.deep.equal({ start: start[2], end: end[2] })
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
