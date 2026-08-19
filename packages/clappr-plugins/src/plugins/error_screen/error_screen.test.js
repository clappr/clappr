import { Core, Container, Events, Playback, PlayerError } from '@clappr/core'

const ctx = {}
import ErrorScreen from './error_screen'

describe('ErrorScreen', function () {
  beforeEach(function () {
    localStorage.clear()
    ctx.core = new Core({})
    ctx.errorScreen = new ErrorScreen(ctx.core)
    ctx.core.addPlugin(ctx.errorScreen)
  })

  afterEach(function () {
    vi.restoreAllMocks()
  })

  it('is named error_screen', function () {
    expect(ctx.errorScreen.name).toBe('error_screen')
  })

  describe('on ERROR event', function () {
    it('calls onError', function () {
      const spy = vi.spyOn(ctx.errorScreen, 'onError')

      ctx.errorScreen.stopListening()
      ctx.errorScreen.bindEvents()
      ctx.core.trigger(Events.ERROR, {})

      expect(spy).toHaveBeenCalled()
    })

    describe('when error level is fatal', function () {
      beforeEach(function () {
        ctx.fakeError = {
          code: '42',
          level: PlayerError.Levels.FATAL,
          UI: {
            title: 'tigle',
            message: 'message'
          }
        }
        ctx.playback = new Playback()
        ctx.container = new Container({ playback: ctx.playback })
        ctx.core.setupContainers([ctx.container])
      })

      it('disables media control', function () {
        const containerStopSpy = vi.spyOn(ctx.container, 'stop')

        ctx.errorScreen.onError(ctx.fakeError)

        expect(containerStopSpy).toHaveBeenCalled()
      })

      it('stops media', function () {
        const containerDisableMediaControlSpy = vi.spyOn(ctx.container, 'disableMediaControl')

        ctx.errorScreen.onError(ctx.fakeError)

        expect(containerDisableMediaControlSpy).toHaveBeenCalled()
      })

      it('shows component', function () {
        const pluginShowSpy = vi.spyOn(ctx.errorScreen, 'show')
        const pluginRenderSpy = vi.spyOn(ctx.errorScreen, 'render')

        ctx.errorScreen.onError(ctx.fakeError)

        expect(pluginShowSpy).toHaveBeenCalled()
        expect(pluginRenderSpy).toHaveBeenCalled()
      })

      it('bind method to reload player', function () {
        const pluginReloadSpy = vi.spyOn(ctx.errorScreen, 'bindReload')

        ctx.errorScreen.onError(ctx.fakeError)

        expect(pluginReloadSpy).toHaveBeenCalled()
      })

      describe('when reload is clicked', function () {
        it('loads media again', function () {
          ctx.core.load = vi.fn()

          ctx.errorScreen.reload()

          expect(ctx.core.load).toHaveBeenCalled()
        })

        it('plays when core is ready', function () {
          ctx.core.load = () => {}
          const playSpy = vi.fn()
          ctx.core.getCurrentContainer = () => ({ play: playSpy })

          ctx.errorScreen.reload()
          ctx.core.trigger(Events.CORE_READY)

          expect(ctx.errorScreen.container.play).toHaveBeenCalled()
        })
      })
    })
  })
})
