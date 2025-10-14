import { Container, Core, Events, Playback, Utils, template } from '@clappr/core'

import MediaControl from './media_control'

const { Config } = Utils

describe('MediaControl', function () {
  beforeEach(function () {
    localStorage.clear()

    this.playback = new Playback()
    this.playback.getPlaybackType = function () {
      return Playback.VOD
    }
    this.container = new Container({ playback: this.playback })
    this.core = new Core({ playerId: 0 })
    this.mediaControl = new MediaControl(this.core)
    this.core.activeContainer = this.container
  })

  afterEach(function () {
    jest.restoreAllMocks()
  })

  describe('#constructor', function () {
    it('can be built muted', function () {
      const container = new Container({ playback: this.playback, mute: true })
      const mediaControl = new MediaControl(this.core)
      this.core.activeContainer = container
      expect(mediaControl.muted).toBe(true)
      expect(mediaControl.volume).toBe(0)
    })

    it('restores saved volume', function () {
      Config.persist('volume', 42)
      Object.assign(this.core.options, { persistConfig: true })
      const mediaControl = new MediaControl(this.core)
      expect(mediaControl.volume).toBe(42)
    })
  })

  describe('#setVolume', function () {
    it('sets the volume', function () {
      const setVolumeSpy = jest.spyOn(this.container, 'setVolume')
      const updateVolumeUISpy = jest.spyOn(this.mediaControl, 'updateVolumeUI')

      this.mediaControl.setVolume(42)
      this.container.trigger(Events.CONTAINER_READY)

      expect(this.mediaControl.volume).toBe(42)
      expect(this.mediaControl.muted).toBe(false)
      expect(setVolumeSpy).toHaveBeenCalled()
      expect(updateVolumeUISpy).toHaveBeenCalled()
    })

    it('limits volume to an integer between 0 and 100', function () {
      this.mediaControl.setVolume(1000)
      expect(this.mediaControl.volume).toBe(100)

      this.mediaControl.setVolume(101)
      expect(this.mediaControl.volume).toBe(100)

      this.mediaControl.setVolume(481)
      expect(this.mediaControl.volume).toBe(100)

      this.mediaControl.setVolume(-1)
      expect(this.mediaControl.volume).toBe(0)

      this.mediaControl.setVolume(0)
      expect(this.mediaControl.volume).toBe(0)
    })

    it('mutes when volume is 0 or less than 0', function () {
      this.mediaControl.setVolume(10)
      expect(this.mediaControl.muted).toBe(false)

      this.mediaControl.setVolume(0)
      expect(this.mediaControl.muted).toBe(true)
    })

    it('persists volume when persistence is on', function () {
      // expected to be default value (100)
      expect(Config.restore('volume')).toBe(100)

      Object.assign(this.core.options, { persistConfig: true })
      const mediacontrol = new MediaControl(this.core)
      this.core.activeContainer = this.container
      mediacontrol.setVolume(78)

      expect(Config.restore('volume')).toBe(78)
    })

    it('reset volume after configure', function () {
      Object.assign(this.core.options, { persistConfig: true })

      const container = new Container({ playback: this.playback, mute: true })
      const mediacontrol = new MediaControl(this.core)

      this.core.activeContainer = container

      container.configure({ mute: false })

      expect(mediacontrol.volume).toBe(100)
    })

    it('do not persist when is initial volume', function () {
      const persistSpy = jest.spyOn(Config, 'persist').mockImplementation(() => {})

      Object.assign(this.core.options, { persistConfig: true })

      const container = new Container({ playback: this.playback, mute: false })

      // Create MediaControl instance to test persistence behavior
      // eslint-disable-next-line no-new
      new MediaControl(this.core)

      this.core.activeContainer = container

      expect(persistSpy).not.toHaveBeenCalled()
    })
  })

  it('can appear when playback type is not NO_OP', function () {
    const mediaControl = new MediaControl(this.core)
    this.core.trigger(Events.CORE_ACTIVE_CONTAINER_CHANGED, this.container)
    mediaControl.enable()
    expect(mediaControl.$el.hasClass('media-control-hide')).toBeFalsy()
    expect(mediaControl.disabled).toBeFalsy()
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
      expect(mediaControl.$el.hasClass('media-control-hide')).toBeTruthy()
      expect(mediaControl.disabled).toBeTruthy()
    })

    it('option chromeless has value true', function () {
      this.core.options.chromeless = true
      this.core.activeContainer = this.container
      const mediaControl = new MediaControl(this.core)
      this.core.trigger(Events.CORE_ACTIVE_CONTAINER_CHANGED, this.container)
      expect(mediaControl.$el.hasClass('media-control-hide')).toBeTruthy()
      expect(mediaControl.disabled).toBeTruthy()
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
      expect(mediaControl.muted).toBe(true)
      expect(mediaControl.volume).toBe(0)
      expect(mediaControl.$el.html()).toBe('<div>My HTML here</div>')
    })
  })

  it('can be configured after its creation', function () {
    expect(this.mediaControl._options.hideMediaControl).toBeUndefined()
    expect(this.mediaControl._options.mediacontrol).toBeUndefined()

    this.core.configure({
      hideMediaControl: false,
      mediacontrol: { seekbar: '#E113D3', buttons: '#66B2FF' }
    })
    expect(this.mediaControl._options.hideMediaControl).toBeFalsy()
    expect(this.mediaControl._options.mediacontrol).not.toBeUndefined()

    this.core.configure({ hideMediaControl: true })
    expect(this.mediaControl._options.hideMediaControl).toBeTruthy()
  })
})
