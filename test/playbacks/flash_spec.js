import Flash from '../../src/playbacks/flash/flash.js'
import Events from '../../src/base/events.js'
import Mediator from '../../src/components/mediator.js'

describe('Flash playback', function() {
  before(function() {
    this.clock = sinon.useFakeTimers()
  })

  after(function() {
    this.clock.restore()
  })

  beforeEach(function() {
    this.flash = new Flash({})
    this.flash.el = { getDuration: () => NaN, getPosition: () => 0, playerPlay: () => {} }
    this.callback = sinon.spy()
  })

  it('should trigger error when swf is not ready after max retries', function() {
    this.flash.el.playerPlay = null
    this.flash.on(Events.PLAYBACK_ERROR, this.callback)
    Mediator.trigger(`${this.flash.uniqueId}:flashready`)

    this.clock.tick(2950)
    this.callback.should.have.not.been.called

    this.clock.tick(50)
    this.callback.should.have.been.calledOnce
  })

  it('should trigger ready only when metadata is loaded', function() {
    this.flash.on(Events.PLAYBACK_READY, this.callback)
    Mediator.trigger(`${this.flash.uniqueId}:flashready`)
    this.callback.should.have.not.been.called
    expect(this.flash.isReady).to.be.false

    this.flash.el.getDuration = () => 100
    Mediator.trigger(`${this.flash.uniqueId}:timeupdate`)
    this.callback.should.have.been.calledOnce
    expect(this.flash.isReady).to.be.true
  })
})
