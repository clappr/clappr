import Playback from 'base/playback'

describe('Playback', function() {
  beforeEach(() => {
    this.basePlayback = new Playback({})
  })

  it('has default duration', () => {
    expect(this.basePlayback.getDuration()).to.be.equal(0)
  })

  it('is not playing', () => {
    expect(this.basePlayback.isPlaying()).to.be.equal(false)
  })

  it('is not ready', () => {
    expect(this.basePlayback.isReady).to.be.equal(false)
  })

  it('has NO_OP as playback type', () => {
    expect(this.basePlayback.getPlaybackType()).to.be.equal(Playback.NO_OP)
  })

  it('is not on highdefintion', () => {
    expect(this.basePlayback.isHighDefinitionInUse()).to.be.equal(false)
  })

  it('destroys by removing element from DOM', () => {
    var spy = sinon.spy()
    this.basePlayback.$el = {remove: spy}

    this.basePlayback.destroy()

    expect(spy).called.once
  })
})
