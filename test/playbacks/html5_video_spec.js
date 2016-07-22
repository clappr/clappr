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
