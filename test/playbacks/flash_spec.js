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
  })
  it('should trigger error when swf is not ready after max retries', function() {
    this.flash.el.playerPlay = null
    const spy = sinon.spy()
    this.flash.on(Events.PLAYBACK_ERROR, spy)
    Mediator.trigger(`${this.flash.uniqueId}:flashready`)
    this.clock.tick(2950)
    expect(spy).not.called
    this.clock.tick(50)
    expect(spy).called.once
  })
  it('should trigger ready only when metadata is loaded', function() {
    const spy = sinon.spy()
    this.flash.on(Events.PLAYBACK_READY, spy)
    Mediator.trigger(`${this.flash.uniqueId}:flashready`)
    expect(spy).not.called
    expect(this.flash.isReady).to.be.false
    this.flash.el.getDuration = () => 100
    Mediator.trigger(`${this.flash.uniqueId}:timeupdate`)
    expect(spy).called.once
    expect(this.flash.isReady).to.be.true
  })
})
