import Core from '../../src/components/core'
import Container from '../../src/components/container'
import Playback from '../../src/base/playback'
import ErrorScreen from '../../src/plugins/error_screen'
import Events from '../../src/base/events'
import PlayerError from '../../src/components/error/error'

describe('ErrorScreen', function() {
  beforeEach(() => {
    this.core = new Core({})
    this.errorScreen = new ErrorScreen(this.core)
    this.core.addPlugin(this.errorScreen)
  })

  it('is named error_screen', () => {
    expect(this.errorScreen.name).to.equal('error_screen')
  })

  describe('on ERROR event', () => {
    it('calls onError', () => {
      const spy = sinon.spy(this.errorScreen, 'onError')

      this.errorScreen.stopListening()
      this.errorScreen.bindEvents()
      this.core.trigger(Events.ERROR, {})

      expect(spy).to.have.been.called
    })

    describe('when error level is fatal', () => {
      beforeEach(() => {
        this.fakeError = {
          code: '42',
          level: PlayerError.Levels.FATAL,
          UI: {
            title: 'tigle',
            message: 'message',
          }
        }
        this.playback = new Playback()
        this.container = new Container({ playback: this.playback })
        this.core.setupContainer(this.container)
      })
      it('disables media control', () => {
        const containerStopSpy = sinon.spy(this.container, 'stop')

        this.errorScreen.onError(this.fakeError)

        expect(containerStopSpy).to.have.been.called
      })

      it('stops media', () => {
        const containerDisableMediaControlSpy = sinon.spy(this.container, 'disableMediaControl')

        this.errorScreen.onError(this.fakeError)

        expect(containerDisableMediaControlSpy).to.have.been.called
      })

      it('shows component', () => {
        const pluginShowSpy = sinon.spy(this.errorScreen, 'show')
        const pluginRenderSpy = sinon.spy(this.errorScreen, 'render')

        this.errorScreen.onError(this.fakeError)

        expect(pluginShowSpy).to.have.been.called
        expect(pluginRenderSpy).to.have.been.called
      })
    })
  })
})
