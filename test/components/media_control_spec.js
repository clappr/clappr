import {Config} from '../../src/base/utils'
import template from '../../src/base/template'
import MediaControl from '../../src/components/media_control'
import Playback from '../../src/base/playback'
import Container from '../../src/components/container'
import Events from '../../src/base/events'

describe('MediaControl', function() {
  beforeEach(function() {
    this.playback = new Playback()
    this.playback.getPlaybackType = function() {
      return Playback.VOD
    }
    this.container = new Container({playback: this.playback})
    this.mediaControl = new MediaControl({container: this.container})
    localStorage.removeItem('clappr.localhost.volume')
  })

  describe('#constructor', function() {
    it('can be built muted', function() {
      const mediaControl = new MediaControl({mute: true, container: this.container})
      expect(mediaControl.muted).to.be.equal(true)
      expect(mediaControl.volume).to.be.equal(0)
    })

    it('restores saved volume', function() {
      Config.persist('volume', 42)
      const mediaControl = new MediaControl({persistConfig: true, container: this.container})

      expect(mediaControl.volume).to.be.equal(42)
    })
  })

  describe('#setVolume', function() {

    it('sets the volume', function() {
      sinon.spy(this.container, 'setVolume')
      sinon.spy(this.mediaControl, 'updateVolumeUI')

      this.mediaControl.setVolume(42)

      this.container.trigger(Events.CONTAINER_READY)

      expect(this.mediaControl.volume).to.be.equal(42)
      expect(this.mediaControl.muted).to.be.equal(false)
      expect(this.container.setVolume).called.once
      expect(this.mediaControl.updateVolumeUI).called.once
    })

    it('limits volume to an integer between 0 and 100', function() {
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

    it('mutes when volume is 0 or less than 0', function() {
      this.mediaControl.setVolume(10)
      expect(this.mediaControl.muted).to.be.equal(false)

      this.mediaControl.setVolume(0)
      expect(this.mediaControl.muted).to.be.equal(true)
    })

    it('persists volume when persistence is on', function() {
      // expected to be default value (100)
      expect(Config.restore('volume')).to.be.equal(100)

      const mediacontrol = new MediaControl({persistConfig: true, container: this.container})
      mediacontrol.setVolume(78)

      expect(Config.restore('volume')).to.be.equal(78)
    })
  })

  it('persists volume when persistence is on', function() {
    // expected to be default value (100)
    expect(Config.restore('volume')).to.be.equal(100)

    const mediacontrol = new MediaControl({persistConfig: true, container: this.container})
    mediacontrol.setVolume(78)

    expect(Config.restore('volume')).to.be.equal(78)
  })

  it('can appear when playback type is not NO_OP', function() {
    const mediaControl = new MediaControl({container: this.container})
    mediaControl.render()
    mediaControl.enable()
    expect(mediaControl.$el.hasClass('media-control-hide')).to.be.false
    expect(mediaControl.disabled).to.be.false
  })

  it('never appears when playback type is NO_OP', function() {
    this.playback.getPlaybackType = function() {
      return Playback.NO_OP
    }
    const mediaControl = new MediaControl({container: this.container})
    mediaControl.render()
    mediaControl.enable()
    expect(mediaControl.$el.hasClass('media-control-hide')).to.be.true
    expect(mediaControl.disabled).to.be.true
  })

  describe('custom media control', function() {
    it('can be extend the base mediacontrol with a custom template', function() {
      class MyMediaControl extends MediaControl {
        get template() { return template('<div>My HTML here</div>') }
        constructor(options) { super(options) }
      }

      const mediaControl = new MyMediaControl({mute: true, container: this.container})
      mediaControl.render()
      expect(mediaControl.muted).to.be.equal(true)
      expect(mediaControl.volume).to.be.equal(0)
      expect(mediaControl.$el.html()).to.be.equal(
        '<div>My HTML here</div>'
      )
    })
  })
})
