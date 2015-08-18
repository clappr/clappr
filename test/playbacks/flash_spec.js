import Flash from '../../src/playbacks/flash/flash.js'
import Events from '../../src/base/events.js'
import Mediator from '../../src/components/mediator.js'

describe('Flash playback', function() {
  beforeEach(function() {
    this.flash = new Flash({})
    this.flash.el = { getPosition: () => 0, playerPlay: () => {} }
  })
  it('should trigger ready only when metadata is loaded', function() {
    var spy = sinon.spy()
    this.flash.on(Events.PLAYBACK_READY, spy)
    this.flash.el.getDuration = () => NaN
    Mediator.trigger(`${this.flash.uniqueId}:flashready`)
    expect(spy).not.called
    expect(this.flash.isReady).to.be.false
    this.flash.el.getDuration = () => 100
    Mediator.trigger(`${this.flash.uniqueId}:timeupdate`)
    expect(spy).called.once
    expect(this.flash.isReady).to.be.true
  })
})
