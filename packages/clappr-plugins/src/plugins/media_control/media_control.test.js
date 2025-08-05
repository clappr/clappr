import { Container, Core, Events, Playback, Utils, template } from '@clappr/core'

import MediaControl from './media_control'

const { Config } = Utils

describe('MediaControl', function () {
  beforeEach(function () {
    this.playback = new Playback()
    this.playback.getPlaybackType = function () {
      return Playback.VOD
    }
    this.container = new Container({ playback: this.playback })
    this.core = new Core({ playerId: 0 })
    this.mediaControl = new MediaControl(this.core)
    this.core.activeContainer = this.container
    localStorage.removeItem('clappr.localhost.volume')
  })

  describe('#constructor', function () {
    it('can be built muted', function () {
      const container = new Container({ playback: this.playback, mute: true })
      const mediaControl = new MediaControl(this.core)
      this.core.activeContainer = container
      expect(mediaControl.muted).to.be.equal(true)
      expect(mediaControl.volume).to.be.equal(0)
    })

    it('restores saved volume', function () {
      Config.persist('volume', 42)
      Object.assign(this.core.options, { persistConfig: true })
      const mediaControl = new MediaControl(this.core)
      expect(mediaControl.volume).to.be.equal(42)
    })
  })

  describe('#setVolume', function () {
    it('sets the volume', function () {
      sinon.spy(this.container, 'setVolume')
      sinon.spy(this.mediaControl, 'updateVolumeUI')

      this.mediaControl.setVolume(42)
      this.container.trigger(Events.CONTAINER_READY)

      expect(this.mediaControl.volume).to.be.equal(42)
      expect(this.mediaControl.muted).to.be.equal(false)
      expect(this.container.setVolume).to.have.been.called
      expect(this.mediaControl.updateVolumeUI).to.have.been.called
    })

    it('limits volume to an integer between 0 and 100', function () {
      this.mediaControl.setVolume(1000)
      expect(this.mediaControl.volume).to.be.equal(100)

      this.mediaControl.setVolume(101)
      expect(this.mediaControl.volume).to.be.equal(100)

      this.mediaControl.setVolume(481)
      expect(this.mediaControl.volume).to.be.equal(100)

      this.mediaControl.setVolume(-1)
      expect(this.mediaControl.volume).to.be.equal(0)

      this.mediaControl.setVolume(0)
      expect(this.mediaControl.volume).to.be.equal(0)
    })

    it('mutes when volume is 0 or less than 0', function () {
      this.mediaControl.setVolume(10)
      expect(this.mediaControl.muted).to.be.equal(false)

      this.mediaControl.setVolume(0)
      expect(this.mediaControl.muted).to.be.equal(true)
    })

    it('persists volume when persistence is on', function () {
      // expected to be default value (100)
      expect(Config.restore('volume')).to.be.equal(100)

      Object.assign(this.core.options, { persistConfig: true })
      const mediacontrol = new MediaControl(this.core)
      this.core.activeContainer = this.container
      mediacontrol.setVolume(78)

      expect(Config.restore('volume')).to.be.equal(78)
    })

    it('reset volume after configure', function () {
      Object.assign(this.core.options, { persistConfig: true })

      const container = new Container({ playback: this.playback, mute: true })
      const mediacontrol = new MediaControl(this.core)

      this.core.activeContainer = container

      container.configure({ mute: false })

      expect(mediacontrol.volume).to.be.equal(100)
    })

    it('do not persist when is initial volume', function () {
      Config.persist = sinon.spy()

      Object.assign(this.core.options, { persistConfig: true })

      const container = new Container({ playback: this.playback, mute: false })

      MediaControl(this.core)

      this.core.activeContainer = container

      Config.persist.should.not.have.been.called
    })
  })

  it('can appear when playback type is not NO_OP', function () {
    const mediaControl = new MediaControl(this.core)
    this.core.trigger(Events.CORE_ACTIVE_CONTAINER_CHANGED, this.container)
    mediaControl.enable()
    expect(mediaControl.$el.hasClass('media-control-hide')).to.be.false
    expect(mediaControl.disabled).to.be.false
  })

  describe('never appears when', function () {
    it('playback type is NO_OP', function () {
      this.container.getPlaybackType = function () {
        return Playback.NO_OP
      }
      const mediaControl = new MediaControl(this.core)
      this.core.activeContainer = this.container
      mediaControl.render()
      mediaControl.enable()
      expect(mediaControl.$el.hasClass('media-control-hide')).to.be.true
      expect(mediaControl.disabled).to.be.true
    })

    it('option chromeless has value true', function () {
      this.core.options.chromeless = true
      this.core.activeContainer = this.container
      const mediaControl = new MediaControl(this.core)
      this.core.trigger(Events.CORE_ACTIVE_CONTAINER_CHANGED, this.container)
      expect(mediaControl.$el.hasClass('media-control-hide')).to.be.true
      expect(mediaControl.disabled).to.be.true
    })
  })

  describe('custom media control', function () {
    it('can be extend the base mediacontrol with a custom template', function () {
      class MyMediaControl extends MediaControl {
        get template() {
          return template('<div>My HTML here</div>')
        }
      }

      const container = new Container({ playback: this.playback, mute: true })
      const mediaControl = new MyMediaControl(this.core)

      this.core.activeContainer = container

      mediaControl.render()
      mediaControl.$el.find('.clappr-style').remove()
      expect(mediaControl.muted).to.be.equal(true)
      expect(mediaControl.volume).to.be.equal(0)
      expect(mediaControl.$el.html()).to.be.equal('<div>My HTML here</div>')
    })
  })

  it('can be configured after its creation', function () {
    expect(this.mediaControl._options.hideMediaControl).to.be.undefined
    expect(this.mediaControl._options.mediacontrol).to.be.undefined

    this.core.configure({
      hideMediaControl: false,
      mediacontrol: { seekbar: '#E113D3', buttons: '#66B2FF' }
    })
    expect(this.mediaControl._options.hideMediaControl).to.be.false
    expect(this.mediaControl._options.mediacontrol).not.to.be.undefined

    this.core.configure({ hideMediaControl: true })
    expect(this.mediaControl._options.hideMediaControl).to.be.true
  })
})
