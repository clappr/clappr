import FlasHLS from '../../src/playbacks/flashls/flashls.js'
import Events from '../../src/base/events.js'

describe('HLS playback', function() {
  describe('#setPlaybackState', function() {
    beforeEach(function() {
      this.callback = sinon.spy()
      this.hls = new FlasHLS({})
      this.hls.el.getbufferLength = function() { return 0 }
      this.hls.el.getDuration = function() { return 30 }
      this.hls.el.getType = function() { return 'live' }
      this.hls.el.getPosition = function() { return 10 }
    })

    it('get current video time', function() {
      expect(this.hls.getCurrentTime()).to.be.equal(10)
    })

    it('triggers PLAYBACK_PLAY_INTENT on play request', function() {
      this.hls.on(Events.PLAYBACK_PLAY_INTENT, this.callback)

      this.hls.play()
      this.callback.should.have.been.calledOnce
    })

    it('should trigger a buffering event on buffering states', function() {
      this.hls.on(Events.PLAYBACK_BUFFERING, this.callback)

      this.hls._setPlaybackState('PLAYING_BUFFERING')
      this.callback.should.have.been.calledOnce

      this.hls._setPlaybackState('PAUSED_BUFFERING')
      this.callback.should.have.been.calledTwice
    })

    it('should trigger a buffering event regardless of buffer size', function() {
      this.hls.el.getbufferLength = function() { return 10 }
      this.hls.on(Events.PLAYBACK_BUFFERING, this.callback)

      this.hls._setPlaybackState('PLAYING_BUFFERING')
      this.callback.should.have.been.calledOnce
    })

    it('should trigger a buffer full event when transitioning from a buffering state to playing', function() {
      this.hls._setPlaybackState('PLAYING_BUFFERING')
      this.hls.on(Events.PLAYBACK_BUFFERFULL, this.callback)

      this.hls._setPlaybackState('PLAYING')
      this.callback.should.have.been.calledOnce
    })

    it('should trigger a buffer full event when transitioning from a buffering state to paused', function() {
      this.hls._setPlaybackState('PAUSED_BUFFERING')
      this.hls.on(Events.PLAYBACK_BUFFERFULL, this.callback)

      this.hls._setPlaybackState('PAUSED')
      this.callback.should.have.been.calledOnce
    })

    it('should trigger an ended event when changing to idle', function() {
      this.hls.on(Events.PLAYBACK_ENDED, this.callback)

      this.hls._setPlaybackState('IDLE')
      this.callback.should.have.been.calledOnce
    })

    it('should set current time to 0 when changing to idle', function() {
      this.hls.on(Events.PLAYBACK_TIMEUPDATE, this.callback)

      this.hls._setPlaybackState('IDLE')
      let timeProgress = this.callback.getCall(0).args[0]
      expect(timeProgress.current).to.be.equal(0)
    })

    it('should create flashls callbacks', function() {
      this.hls._createCallbacks()
      expect(window.Clappr.flashlsCallbacks).to.be.a('object')
      expect(window.Clappr.flashlsCallbacks[this.hls.cid]).to.be.a('function')
    })

    it('should update data element attribute with base url on render', function() {
      const playback = new FlasHLS({baseUrl: '/foo/bar'})
      expect(playback.el.getAttribute('data')).to.not.match(/^\/foo\/bar/)
      playback.render()
      expect(playback.el.getAttribute('data')).to.match(/^\/foo\/bar/)
    })
  })
})
