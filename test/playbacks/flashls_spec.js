import FlasHLS from '../../src/playbacks/flashls/flashls.js'
import Events from '../../src/base/events.js'

describe('HLS playback', function() {
  describe('#setPlaybackState', function() {
    beforeEach(function() {
      this.hls = new FlasHLS({})
      this.hls.el.getbufferLength = function() { return 0 }
      this.hls.el.getDuration = function() { return 30 }
      this.hls.el.getType = function() { return 'live' }
    })

    it('triggers PLAYBACK_PLAY_INTENT on play request', function() {
      var thereWasPlayIntent = false

      this.hls.on(Events.PLAYBACK_PLAY_INTENT, function() {
        thereWasPlayIntent = true
      })

      this.hls.play()

      expect(thereWasPlayIntent).to.be.true
    })

    it('should trigger a buffering event on buffering states', function() {
      var buffering = false
      this.hls.on(Events.PLAYBACK_BUFFERING, function() { buffering = true })
      this.hls._setPlaybackState('PLAYING_BUFFERING')
      expect(buffering).to.be.true
      buffering = false
      this.hls._setPlaybackState('PAUSED_BUFFERING')
      expect(buffering).to.be.true
    })

    it('should trigger a buffering event regardless of buffer size', function() {
      var buffering = false
      this.hls.el.getbufferLength = function() { return 10 }
      this.hls.on(Events.PLAYBACK_BUFFERING, function() { buffering = true })
      this.hls._setPlaybackState('PLAYING_BUFFERING')
      expect(buffering).to.be.true
    })

    it('should trigger a buffer full event when transitioning from a buffering state to playing', function() {
      var buffering = true
      this.hls._setPlaybackState('PLAYING_BUFFERING')
      this.hls.on(Events.PLAYBACK_BUFFERFULL, function() { buffering = false })
      this.hls._setPlaybackState('PLAYING')
      expect(buffering).to.be.false
    })

    it('should trigger a buffer full event when transitioning from a buffering state to paused', function() {
      var buffering = true
      this.hls._setPlaybackState('PAUSED_BUFFERING')
      this.hls.on(Events.PLAYBACK_BUFFERFULL, function() { buffering = false })
      this.hls._setPlaybackState('PAUSED')
      expect(buffering).to.be.false
    })

    it('should trigger an ended event when changing to idle', function() {
      var ended = false
      this.hls.on(Events.PLAYBACK_ENDED, function() { ended = true })
      this.hls._setPlaybackState('IDLE')
      expect(ended).to.be.true
    })

    it('should set current time to 0 when changing to idle', function() {
      var current = -1
      this.hls.on(Events.PLAYBACK_TIMEUPDATE, function(timeProgress) { current = timeProgress.current })
      this.hls._setPlaybackState('IDLE')

      expect(current).to.be.equal(0)
    })

    it('should create flashls callbacks', function() {
      this.hls._createCallbacks()
      expect(window.Clappr.flashlsCallbacks).to.be.a('object')
      expect(window.Clappr.flashlsCallbacks[this.hls.cid]).to.be.a('function')
    })
  })
})
