import { Events, Container, Playback } from 'clappr'

import ClickToPause from 'plugins/click_to_pause'

describe('clickToPause', function() {
  beforeEach(function() {
    this.playback = new Playback()
    this.container = new Container({ playback: this.playback })
    this.plugin = new ClickToPause(this.container)
  })

  it('has name', function() {
    expect(this.plugin.name).to.be.equal('click_to_pause')
  })

  it('call pause when playing and dvr is enabled', function(done) {
    sinon.stub(this.container, 'isPlaying').callsFake(() => true)
    sinon.stub(this.container, 'isDvrEnabled').callsFake(() => true)
    sinon.spy(this.container, 'pause')

    this.container.on(Events.CONTAINER_CLICK, () => {
      this.container.pause.should.have.been.calledOnce
      done()
    })

    this.container.trigger(Events.CONTAINER_CLICK)
  })

  it('call play when not playing and dvr is enabled', function(done) {
    sinon.stub(this.container, 'isPlaying').callsFake(() => false)
    sinon.stub(this.container, 'isDvrEnabled').callsFake(() => true)
    sinon.spy(this.container, 'play')

    this.container.on(Events.CONTAINER_CLICK, () => {
      this.container.play.should.have.been.calledOnce
      done()
    })

    this.container.trigger(Events.CONTAINER_CLICK)
  })

  it('not call play nor pause when playback type is live and dvr is disable', function(done) {
    sinon.stub(this.container, 'getPlaybackType').callsFake(() => Playback.LIVE)
    sinon.stub(this.container, 'isDvrEnabled').callsFake(() => false)
    sinon.spy(this.container, 'play')
    sinon.spy(this.container, 'pause')

    this.container.on(Events.CONTAINER_CLICK, () => {
      this.container.play.should.not.have.been.called
      this.container.pause.should.not.have.been.called
      done()
    })

    this.container.trigger(Events.CONTAINER_CLICK)
  })

  it('not show cursor pointer when playback is live and drv is disable', function(done) {
    sinon.stub(this.container, 'getPlaybackType').callsFake(() => Playback.LIVE)
    sinon.stub(this.container, 'isDvrEnabled').callsFake(() => false)

    this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
      expect(this.container.$el.hasClass('pointer-enabled')).to.be.false
      done()
    })

    this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
  })

  it('show cursor pointer when playback is live and drv is enable', function(done) {
    sinon.stub(this.container, 'getPlaybackType').callsFake(() => Playback.LIVE)
    sinon.stub(this.container, 'isDvrEnabled').callsFake(() => true)

    this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
      expect(this.container.$el.hasClass('pointer-enabled')).to.be.true
      done()
    })

    this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
  })

  describe('show cursor pointer when playback is not live and', function() {

    it('playback is VOD', function(done) {
      sinon.stub(this.container, 'getPlaybackType').callsFake(() => Playback.VOD)

      this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
        expect(this.container.$el.hasClass('pointer-enabled')).to.be.true
        done()
      })

      this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })

    it('playback is AOD', function(done) {
      sinon.stub(this.container, 'getPlaybackType').callsFake(() => Playback.AOD)

      this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
        expect(this.container.$el.hasClass('pointer-enabled')).to.be.true
        done()
      })

      this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })

    it('playback is NO_OP', function(done) {
      sinon.stub(this.container, 'getPlaybackType').callsFake(() => Playback.NO_OP)

      this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
        expect(this.container.$el.hasClass('pointer-enabled')).to.be.true
        done()
      })

      this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })
  })

  describe('on playback live and dvr enabled', function() {
    beforeEach(function(done) {
      sinon.stub(this.container, 'getPlaybackType').callsFake(() => Playback.LIVE)
      sinon.stub(this.container, 'isDvrEnabled').callsFake(() => true)
      sinon.spy(this.container.$el, 'addClass')
      sinon.spy(this.container.$el, 'removeClass')

      this.container.once(Events.CONTAINER_SETTINGSUPDATE, done)
      this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })

    it('add css class when state changes', function() {
      this.container.$el.addClass.should.have.been.calledOnce
    })

    it('do not toggle when state do not changes', function(done) {
      this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
        this.container.$el.removeClass.should.not.have.been.called
        this.container.$el.addClass.should.have.been.calledOnce
        done()
      })
      this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })
  })
})
