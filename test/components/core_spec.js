import Core from '../../src/components/core'
import Events from '../../src/base/events'
import { Fullscreen } from '../../src/base/utils'
import Browser from '../../src/components/browser'

describe('Core', function() {
  describe('When configure', function() {
    beforeEach(function () {
      this.core = new Core({})
      this.core.load = sinon.spy()
    })

    it('should update option', function() {
      const newOptions = {
        autoPlay: true
      }
      this.core.configure(newOptions)

      expect(this.core.options.autoPlay).to.equal(newOptions.autoPlay)
    })

    it('should update option and load source', function() {
      const newOptions = {
        source: 'some/path/to/media.mp4',
        mute: true
      }
      this.core.configure(newOptions)

      assert.ok(this.core.load.called)
      expect(this.core.options.mute).to.equal(newOptions.mute)
    })

    it('shoud trigger options change event', function () {
      let callback = sinon.spy()
      this.core.on(Events.CORE_OPTIONS_CHANGE, callback)

      const newOptions = {
        autoPlay: false
      }
      this.core.configure(newOptions)

      assert.ok(callback.called)
      expect(this.core.options.autoPlay).to.equal(newOptions.autoPlay)
    })
  })

  describe('#toggleFullscreen', () => {
    beforeEach(() => {
      this.core = new Core({})
    })

    it('calls this.mediaControl.show()', () => {
      const spy = sinon.spy(this.core.mediaControl, 'show')
      this.core.toggleFullscreen()
      expect(spy).to.have.been.called
    })

    describe('when is not in fullscreen', () => {
      let fullScreenSpy

      beforeEach(() => {
        sinon.stub(Fullscreen, 'isFullscreen').value(() => false)
        fullScreenSpy = sinon.spy(Fullscreen, 'requestFullscreen')
      })

      afterEach(() => {
        fullScreenSpy.restore()
      })

      describe('and is not an iOS Browser', () => {
        beforeEach(() => {
          sinon.stub(Browser, 'isiOS').value(false)
        })

        it('calls Fullscreen.requestFullscreen with core element', () => {
          this.core.toggleFullscreen()
          expect(fullScreenSpy).to.have.been.calledWith(this.core.el)
        })

        it('adds a class "fullscreen" to core element', () => {
          const spy = sinon.spy(this.core.$el, 'addClass')
          expect(spy).not.to.have.been.called

          this.core.toggleFullscreen()

          expect(spy).to.have.been.calledWith('fullscreen')
        })
      })

      describe('and is an iOS Browser', () => {
        it('calls Fullscreen.requestFullscreen with currentContainer element', () => {
          sinon.stub(Browser, 'isiOS').value(true)
          const fakeCurrentContainer = '<div id="fakeCurrentContainer"></div>'
          this.core.getCurrentContainer = sinon.stub().returns({ el: fakeCurrentContainer })

          this.core.toggleFullscreen()

          expect(fullScreenSpy).to.have.been.calledWith(this.core.getCurrentContainer().el)
        })
      })
    })

    describe('when is in fullscreen', () => {
      beforeEach(() => {
        sinon.stub(Fullscreen, 'isFullscreen').value(() => true)
      })

      it('calls Fullscreen.cancelFullscreen', () => {
        const spy = sinon.spy(Fullscreen, 'cancelFullscreen')
        this.core.toggleFullscreen()
        expect(spy).to.have.been.called
      })

      describe('Browser.isiOS', () => {
        it('removes "fullscreen nocursor" classes from core element', () => {
          sinon.stub(Browser, 'isiOS').value(false)
          const spy = sinon.spy(this.core.$el, 'removeClass')
          expect(spy).not.to.have.been.called

          this.core.toggleFullscreen()

          expect(spy).to.have.been.calledWith('fullscreen nocursor')
        })
      })
    })
  })

  describe('#enableResizeObserver', () => {
    beforeEach(() => {
      this.clock = sinon.useFakeTimers()
      this.core = new Core({})
      sinon.spy(this.core, 'triggerResize')
    })

    afterEach(() => {
      this.clock.restore()
    })

    it('calls #triggerResize every 500 milliseconds', () => {
      this.core.enableResizeObserver()
      expect(this.core.triggerResize).not.to.have.been.called
      this.clock.tick(500)
      expect(this.core.triggerResize).to.have.been.called
      this.clock.tick(500)
      expect(this.core.triggerResize).to.have.been.calledTwice
    })

    it('calls #triggerResize with core element width and height', () => {
      this.core.enableResizeObserver()
      this.clock.tick(500)
      expect(this.core.triggerResize).to.have.been.calledWith({ height: 0, width: 0 })
    })
  })

  describe('#triggerResize', () => {
    it('triggers on an event Events.CORE_RESIZE', () => {
      const newSize = { width: '50%', height: '50%' }

      this.core = new Core({})
      sinon.spy(this.core, 'trigger')
      this.core.triggerResize(newSize)

      expect(this.core.trigger).to.have.been.calledWith(Events.CORE_RESIZE, newSize)
    })
  })

  describe('#handleWindowResize', () => {
    beforeEach(() => {
      this.core = new Core({})
      this.core._screenOrientation = 'landscape'
      sinon.spy(this.core, 'triggerResize')
    })

    describe('when change the screen orientation', () => {
      it('calls #triggerResize with core element width and height', () => {
        this.core._screenOrientation = 'portrait'
        this.core.handleWindowResize("event")
        expect(this.core.triggerResize).to.have.been.calledWith({ height: 0, width: 0 })
      })
    })

    describe('when screen orientation doesn\'t change', () => {
      it('doesn\'t calls #triggerResize', () => {
        this.core.handleWindowResize("event")
        expect(this.core.triggerResize).not.to.have.been.called
      })
    })
  })
})
