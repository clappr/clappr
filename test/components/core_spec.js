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
})
