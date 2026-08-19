import { Events, Container, Playback } from '@clappr/core'

const ctx = {}
import ClickToPause from './click_to_pause'

describe('clickToPause', function () {
  beforeEach(function () {
    localStorage.clear()
    ctx.playback = new Playback()
    ctx.container = new Container({ playback: ctx.playback })
    ctx.plugin = new ClickToPause(ctx.container)
  })

  afterEach(function () {
    vi.restoreAllMocks()
  })

  it('has name', function () {
    expect(ctx.plugin.name).toBe('click_to_pause')
  })

  it('call pause when playing and dvr is enabled', function () {
    return new Promise(done => {
      vi.spyOn(ctx.container, 'isPlaying').mockImplementation(() => true)
      vi.spyOn(ctx.container, 'isDvrEnabled').mockImplementation(() => true)
      const pauseSpy = vi.spyOn(ctx.container, 'pause')

      ctx.container.on(Events.CONTAINER_CLICK, () => {
        expect(pauseSpy).toHaveBeenCalledTimes(1)
        done()
      })

      ctx.container.trigger(Events.CONTAINER_CLICK)
    })
  })

  it('call play when not playing and dvr is enabled', function () {
    return new Promise(done => {
      vi.spyOn(ctx.container, 'isPlaying').mockImplementation(() => false)
      vi.spyOn(ctx.container, 'isDvrEnabled').mockImplementation(() => true)
      const playSpy = vi.spyOn(ctx.container, 'play')

      ctx.container.on(Events.CONTAINER_CLICK, () => {
        expect(playSpy).toHaveBeenCalledTimes(1)
        done()
      })

      ctx.container.trigger(Events.CONTAINER_CLICK)
    })
  })

  it('not call play nor pause when playback type is live and dvr is disable', function () {
    return new Promise(done => {
      vi.spyOn(ctx.container, 'getPlaybackType').mockImplementation(() => Playback.LIVE)
      vi.spyOn(ctx.container, 'isDvrEnabled').mockImplementation(() => false)
      const playSpy = vi.spyOn(ctx.container, 'play')
      const pauseSpy = vi.spyOn(ctx.container, 'pause')

      ctx.container.on(Events.CONTAINER_CLICK, () => {
        expect(playSpy).not.toHaveBeenCalled()
        expect(pauseSpy).not.toHaveBeenCalled()
        done()
      })

      ctx.container.trigger(Events.CONTAINER_CLICK)
    })
  })

  it('not show cursor pointer when playback is live and drv is disable', function () {
    return new Promise(done => {
      vi.spyOn(ctx.container, 'getPlaybackType').mockImplementation(() => Playback.LIVE)
      vi.spyOn(ctx.container, 'isDvrEnabled').mockImplementation(() => false)

      ctx.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
        expect(ctx.container.$el.hasClass('pointer-enabled')).toBeFalsy()
        done()
      })

      ctx.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })
  })

  it('show cursor pointer when playback is live and drv is enable', function () {
    return new Promise(done => {
      vi.spyOn(ctx.container, 'getPlaybackType').mockImplementation(() => Playback.LIVE)
      vi.spyOn(ctx.container, 'isDvrEnabled').mockImplementation(() => true)

      ctx.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
        expect(ctx.container.$el.hasClass('pointer-enabled')).toBeTruthy()
        done()
      })

      ctx.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })
  })

  describe('show cursor pointer when playback is not live and', function () {
    it('playback is VOD', function () {
      return new Promise(done => {
        vi.spyOn(ctx.container, 'getPlaybackType').mockImplementation(() => Playback.VOD)

        ctx.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
          expect(ctx.container.$el.hasClass('pointer-enabled')).toBeTruthy()
          done()
        })

        ctx.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
      })
    })

    it('playback is AOD', function () {
      return new Promise(done => {
        vi.spyOn(ctx.container, 'getPlaybackType').mockImplementation(() => Playback.AOD)

        ctx.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
          expect(ctx.container.$el.hasClass('pointer-enabled')).toBeTruthy()
          done()
        })

        ctx.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
      })
    })

    it('playback is NO_OP', function () {
      return new Promise(done => {
        vi.spyOn(ctx.container, 'getPlaybackType').mockImplementation(() => Playback.NO_OP)

        ctx.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
          expect(ctx.container.$el.hasClass('pointer-enabled')).toBeTruthy()
          done()
        })

        ctx.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
      })
    })
  })

  describe('on playback live and dvr enabled', function () {
    beforeEach(function () {
      return new Promise(done => {
        vi.spyOn(ctx.container, 'getPlaybackType').mockImplementation(() => Playback.LIVE)
        vi.spyOn(ctx.container, 'isDvrEnabled').mockImplementation(() => true)
        ctx.addClassSpy = vi.spyOn(ctx.container.$el, 'addClass')
        ctx.removeClassSpy = vi.spyOn(ctx.container.$el, 'removeClass')

        ctx.container.once(Events.CONTAINER_SETTINGSUPDATE, done)
        ctx.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
      })
    })

    it('add css class when state changes', function () {
      expect(ctx.addClassSpy).toHaveBeenCalledTimes(1)
    })

    it('do not toggle when state do not changes', function () {
      return new Promise(done => {
        ctx.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
          expect(ctx.removeClassSpy).not.toHaveBeenCalled()
          expect(ctx.addClassSpy).toHaveBeenCalledTimes(1)
          done()
        })
        ctx.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
      })
    })
  })

  it('call container play with parameters when received from config', function () {
    return new Promise(done => {
      ctx.container = new Container({
        playback: ctx.playback,
        clickToPauseConfig: { onClickPayload: { testing: true } }
      })
      ctx.plugin = new ClickToPause(ctx.container)

      vi.spyOn(ctx.container, 'isPlaying').mockImplementation(() => false)
      vi.spyOn(ctx.container, 'isDvrEnabled').mockImplementation(() => true)
      const playSpy = vi.spyOn(ctx.container, 'play')

      ctx.container.on(Events.CONTAINER_CLICK, () => {
        expect(playSpy).toHaveBeenCalledWith({ testing: true })
        done()
      })

      ctx.container.trigger(Events.CONTAINER_CLICK)
    })
  })

  it('call container pause with parameters when received from config', function () {
    return new Promise(done => {
      ctx.container = new Container({
        playback: ctx.playback,
        clickToPauseConfig: { onClickPayload: { testing: true } }
      })
      ctx.plugin = new ClickToPause(ctx.container)

      vi.spyOn(ctx.container, 'isPlaying').mockImplementation(() => true)
      vi.spyOn(ctx.container, 'isDvrEnabled').mockImplementation(() => true)
      const pauseSpy = vi.spyOn(ctx.container, 'pause')

      ctx.container.on(Events.CONTAINER_CLICK, () => {
        expect(pauseSpy).toHaveBeenCalledWith({ testing: true })
        done()
      })

      ctx.container.trigger(Events.CONTAINER_CLICK)
    })
  })
})
