import { Core, Container, Events, Playback, PlayerError } from '@clappr/core'

import ErrorScreen from './error_screen'

describe('ErrorScreen', function () {
  beforeEach(function () {
    localStorage.clear()
    this.core = new Core({})
    this.errorScreen = new ErrorScreen(this.core)
    this.core.addPlugin(this.errorScreen)
  })

  afterEach(function () {
    jest.restoreAllMocks()
  })

  it('is named error_screen', function () {
    expect(this.errorScreen.name).toBe('error_screen')
  })

  describe('on ERROR event', function () {
    it('calls onError', function () {
      const spy = jest.spyOn(this.errorScreen, 'onError')

      this.errorScreen.stopListening()
      this.errorScreen.bindEvents()
      this.core.trigger(Events.ERROR, {})

      expect(spy).toHaveBeenCalled()
    })

    describe('when error level is fatal', function () {
      beforeEach(function () {
        this.fakeError = {
          code: '42',
          level: PlayerError.Levels.FATAL,
          UI: {
            title: 'tigle',
            message: 'message'
          }
        }
        this.playback = new Playback()
        this.container = new Container({ playback: this.playback })
        this.core.setupContainers([this.container])
      })

      it('disables media control', function () {
        const containerStopSpy = jest.spyOn(this.container, 'stop')

        this.errorScreen.onError(this.fakeError)

        expect(containerStopSpy).toHaveBeenCalled()
      })

      it('stops media', function () {
        const containerDisableMediaControlSpy = jest.spyOn(this.container, 'disableMediaControl')

        this.errorScreen.onError(this.fakeError)

        expect(containerDisableMediaControlSpy).toHaveBeenCalled()
      })

      it('shows component', function () {
        const pluginShowSpy = jest.spyOn(this.errorScreen, 'show')
        const pluginRenderSpy = jest.spyOn(this.errorScreen, 'render')

        this.errorScreen.onError(this.fakeError)

        expect(pluginShowSpy).toHaveBeenCalled()
        expect(pluginRenderSpy).toHaveBeenCalled()
      })

      it('bind method to reload player', function () {
        const pluginReloadSpy = jest.spyOn(this.errorScreen, 'bindReload')

        this.errorScreen.onError(this.fakeError)

        expect(pluginReloadSpy).toHaveBeenCalled()
      })

      describe('when reload is clicked', function () {
        it('loads media again', function () {
          this.core.load = jest.fn()

          this.errorScreen.reload()

          expect(this.core.load).toHaveBeenCalled()
        })

        it('plays when core is ready', function () {
          this.core.load = () => {}
          const playSpy = jest.fn()
          this.core.getCurrentContainer = () => ({ play: playSpy })

          this.errorScreen.reload()
          this.core.trigger(Events.CORE_READY)

          expect(this.errorScreen.container.play).toHaveBeenCalled()
        })
      })
    })
  })
})
