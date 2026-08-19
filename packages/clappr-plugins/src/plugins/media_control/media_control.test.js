import { Container, Core, Events, Playback, Utils, template } from '@clappr/core'

const ctx = {}
import MediaControl from './media_control'

const { Config } = Utils

describe('MediaControl', function () {
  beforeEach(function () {
    localStorage.clear()

    ctx.playback = new Playback()
    ctx.playback.getPlaybackType = function () {
      return Playback.VOD
    }
    ctx.container = new Container({ playback: ctx.playback })
    ctx.core = new Core({ playerId: 0 })
    ctx.mediaControl = new MediaControl(ctx.core)
    ctx.core.activeContainer = ctx.container
  })

  afterEach(function () {
    vi.restoreAllMocks()
  })

  describe('#constructor', function () {
    it('can be built muted', function () {
      const container = new Container({ playback: ctx.playback, mute: true })
      const mediaControl = new MediaControl(ctx.core)
      ctx.core.activeContainer = container
      expect(mediaControl.muted).toBe(true)
      expect(mediaControl.volume).toBe(0)
    })

    it('restores saved volume', function () {
      Config.persist('volume', 42)
      Object.assign(ctx.core.options, { persistConfig: true })
      const mediaControl = new MediaControl(ctx.core)
      expect(mediaControl.volume).toBe(42)
    })
  })

  describe('#setVolume', function () {
    it('sets the volume', function () {
      const setVolumeSpy = vi.spyOn(ctx.container, 'setVolume')
      const updateVolumeUISpy = vi.spyOn(ctx.mediaControl, 'updateVolumeUI')

      ctx.mediaControl.setVolume(42)
      ctx.container.trigger(Events.CONTAINER_READY)

      expect(ctx.mediaControl.volume).toBe(42)
      expect(ctx.mediaControl.muted).toBe(false)
      expect(setVolumeSpy).toHaveBeenCalled()
      expect(updateVolumeUISpy).toHaveBeenCalled()
    })

    it('limits volume to an integer between 0 and 100', function () {
      ctx.mediaControl.setVolume(1000)
      expect(ctx.mediaControl.volume).toBe(100)

      ctx.mediaControl.setVolume(101)
      expect(ctx.mediaControl.volume).toBe(100)

      ctx.mediaControl.setVolume(481)
      expect(ctx.mediaControl.volume).toBe(100)

      ctx.mediaControl.setVolume(-1)
      expect(ctx.mediaControl.volume).toBe(0)

      ctx.mediaControl.setVolume(0)
      expect(ctx.mediaControl.volume).toBe(0)
    })

    it('mutes when volume is 0 or less than 0', function () {
      ctx.mediaControl.setVolume(10)
      expect(ctx.mediaControl.muted).toBe(false)

      ctx.mediaControl.setVolume(0)
      expect(ctx.mediaControl.muted).toBe(true)
    })

    it('restores prior volume after mute toggle instead of jumping to 100', function () {
      const setVolumeSpy = vi.spyOn(ctx.container, 'setVolume')

      ctx.mediaControl.setVolume(10)
      ctx.container.trigger(Events.CONTAINER_READY)

      ctx.mediaControl.toggleMute()
      expect(ctx.mediaControl.muted).toBe(true)
      expect(ctx.mediaControl.volume).toBe(0)

      ctx.mediaControl.toggleMute()
      expect(ctx.mediaControl.muted).toBe(false)
      expect(ctx.mediaControl.volume).toBe(10)
      expect(setVolumeSpy).toHaveBeenLastCalledWith(10)
    })

    it('unmute toggle defaults to 100 when there was no stored level (already at 0)', function () {
      ctx.mediaControl.setVolume(0)
      ctx.container.trigger(Events.CONTAINER_READY)

      ctx.mediaControl.toggleMute()
      expect(ctx.mediaControl.muted).toBe(false)
      expect(ctx.mediaControl.volume).toBe(100)
    })

    it('persists volume when persistence is on', function () {
      // expected to be default value (100)
      expect(Config.restore('volume')).toBe(100)

      Object.assign(ctx.core.options, { persistConfig: true })
      const mediacontrol = new MediaControl(ctx.core)
      ctx.core.activeContainer = ctx.container
      mediacontrol.setVolume(78)

      expect(Config.restore('volume')).toBe(78)
    })

    it('reset volume after configure', function () {
      Object.assign(ctx.core.options, { persistConfig: true })

      const container = new Container({ playback: ctx.playback, mute: true })
      const mediacontrol = new MediaControl(ctx.core)

      ctx.core.activeContainer = container

      container.configure({ mute: false })

      expect(mediacontrol.volume).toBe(100)
    })

    it('do not persist when is initial volume', function () {
      const persistSpy = vi.spyOn(Config, 'persist').mockImplementation(() => {})

      Object.assign(ctx.core.options, { persistConfig: true })

      const container = new Container({ playback: ctx.playback, mute: false })

      // Create MediaControl instance to test persistence behavior
      // eslint-disable-next-line no-new
      new MediaControl(ctx.core)

      ctx.core.activeContainer = container

      expect(persistSpy).not.toHaveBeenCalled()
    })
  })

  it('can appear when playback type is not NO_OP', function () {
    const mediaControl = new MediaControl(ctx.core)
    ctx.core.trigger(Events.CORE_ACTIVE_CONTAINER_CHANGED, ctx.container)
    mediaControl.enable()
    expect(mediaControl.$el.hasClass('media-control-hide')).toBeFalsy()
    expect(mediaControl.disabled).toBeFalsy()
  })

  describe('never appears when', function () {
    it('playback type is NO_OP', function () {
      ctx.container.getPlaybackType = function () {
        return Playback.NO_OP
      }
      const mediaControl = new MediaControl(ctx.core)
      ctx.core.activeContainer = ctx.container
      mediaControl.render()
      mediaControl.enable()
      expect(mediaControl.$el.hasClass('media-control-hide')).toBeTruthy()
      expect(mediaControl.disabled).toBeTruthy()
    })

    it('option chromeless has value true', function () {
      ctx.core.options.chromeless = true
      ctx.core.activeContainer = ctx.container
      const mediaControl = new MediaControl(ctx.core)
      ctx.core.trigger(Events.CORE_ACTIVE_CONTAINER_CHANGED, ctx.container)
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

      const container = new Container({ playback: ctx.playback, mute: true })
      const mediaControl = new MyMediaControl(ctx.core)

      ctx.core.activeContainer = container

      mediaControl.render()
      mediaControl.$el.find('.clappr-style').remove()
      expect(mediaControl.muted).toBe(true)
      expect(mediaControl.volume).toBe(0)
      expect(mediaControl.$el.html()).toBe('<div>My HTML here</div>')
    })
  })

  it('can be configured after its creation', function () {
    expect(ctx.mediaControl._options.hideMediaControl).toBeUndefined()
    expect(ctx.mediaControl._options.mediacontrol).toBeUndefined()

    ctx.core.configure({
      hideMediaControl: false,
      mediacontrol: { seekbar: '#E113D3', buttons: '#66B2FF' }
    })
    expect(ctx.mediaControl._options.hideMediaControl).toBeFalsy()
    expect(ctx.mediaControl._options.mediacontrol).not.toBeUndefined()

    ctx.core.configure({ hideMediaControl: true })
    expect(ctx.mediaControl._options.hideMediaControl).toBeTruthy()
  })
})
