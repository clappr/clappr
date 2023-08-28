import Core from './core'
import Browser from '../browser'
import Events from '../../base/events'
import { Fullscreen } from '../../utils'

describe('Core', function() {
  describe('When configure', () => {
    beforeEach(() => {
      this.core = new Core({})
      this.core.load = jest.fn()
    })

    test('should update option', () => {
      const newOptions = {
        autoPlay: true
      }
      this.core.configure(newOptions)

      expect(this.core.options.autoPlay).toEqual(newOptions.autoPlay)
    })

    test('should update option and load source', () => {
      const newOptions = {
        source: 'some/path/to/media.mp4',
        mute: true
      }
      this.core.configure(newOptions)

      expect(this.core.load).toHaveBeenCalled()
      expect(this.core.options.mute).toEqual(newOptions.mute)
    })

    test('shoud trigger options change event', () => {
      let callback = jest.fn()
      this.core.on(Events.CORE_OPTIONS_CHANGE, callback)

      const newOptions = {
        autoPlay: false
      }
      this.core.configure(newOptions)

      expect(callback).toHaveBeenCalled()
      expect(this.core.options.autoPlay).toEqual(newOptions.autoPlay)
    })
  })

  describe('#isFullscreen', () => {
    beforeEach(() => {
      const el = document.createElement('div')
      el.setAttribute('id', 'fakeCoreElement')
      this.core = new Core({})
      this.core.el = el
    })

    test('returns false when there\'s no active fullscreen element', () => {
      jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(undefined)

      expect(this.core.isFullscreen()).toEqual(false)
    })

    test('returns false when the active fullscreen element is not the core element', () => {
      const el = document.createElement('div')
      jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(el)

      expect(this.core.isFullscreen()).toEqual(false)
    })

    test('returns true if the active fullscreen element is the core element', () => {
      jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(this.core.el)

      expect(this.core.isFullscreen()).toEqual(true)
    })

    test('returns true if the active fullscreen element is the playback element', () => {
      const playbackEl = document.createElement('div')
      this.core.activeContainer = { playback: { el: playbackEl } }

      jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(playbackEl)

      expect(this.core.isFullscreen()).toEqual(true)
    })

    describe('on iOS', () => {
      beforeEach(() => { Browser.isiOS = true })
      afterEach(() => { Browser.isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) })

      test('returns false if there\'s no active playback', () => {
        this.core.activeContainer = undefined

        expect(this.core.isFullscreen()).toEqual(false)
      })

      test('returns true if the fullscreen element is from the active playback', () => {
        const el = document.createElement('div')
        el.setAttribute('id', 'fakePlayback')
        const playback = { el }
        this.core.activeContainer = { playback }

        jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(el)

        expect(this.core.isFullscreen()).toEqual(true)
      })
    })
  })

  describe('#toggleFullscreen', () => {
    beforeEach(() => {
      this.core = new Core({})
    })

    describe('when is not in fullscreen', () => {
      beforeEach(() => { jest.spyOn(Fullscreen, 'requestFullscreen') })

      describe('and is not an iOS Browser', () => {
        test('calls Fullscreen.requestFullscreen with core element', () => {
          this.core.el.requestFullscreen = () => new Promise((resolve, reject) => this.core.el ? resolve() : reject())
          this.core.toggleFullscreen()

          expect(Fullscreen.requestFullscreen).toHaveBeenCalledWith(this.core.el)
          delete this.core.el.requestFullscreen
        })

        test('adds a class "fullscreen" to core element', () => {
          this.core.el.requestFullscreen = () => new Promise((resolve, reject) => this.core.el ? resolve() : reject())
          jest.spyOn(this.core.$el, 'addClass')
          jest.spyOn(this.core, 'isFullscreen').mockReturnValue(false)

          expect(this.core.$el.addClass).not.toHaveBeenCalled()

          this.core.toggleFullscreen()

          expect(this.core.$el.addClass).toHaveBeenCalledWith('fullscreen')
          delete this.core.el.requestFullscreen
        })
      })

      describe('and is an iOS Browser', () => {
        beforeEach(() => { Browser.isiOS = true })
        afterEach(() => { Browser.isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) })

        test('calls Fullscreen.requestFullscreen with activePlayback element', () => {
          const el = document.createElement('div')
          el.setAttribute('id', 'fakePlayback')
          const playback = { el }
          this.core.activeContainer = { playback }

          this.core.toggleFullscreen()

          expect(Fullscreen.requestFullscreen).toHaveBeenCalledWith(el)
        })
      })
    })

    describe('when is in fullscreen', () => {
      beforeEach(() => {
        Browser.isiOS = true
        jest.spyOn(this.core, 'isFullscreen').mockReturnValue(true)
      })
      afterEach(() => { Browser.isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) })

      test('calls Fullscreen.cancelFullscreen', () => {
        jest.spyOn(Fullscreen, 'cancelFullscreen')

        this.core.toggleFullscreen()
        expect(Fullscreen.cancelFullscreen).toHaveBeenCalled()
      })

      describe('Browser.isiOS', () => {
        beforeEach(() => { Browser.isiOS = false })
        afterEach(() => { Browser.isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) })

        test('removes "fullscreen nocursor" classes from core element', () => {
          jest.spyOn(this.core.$el, 'removeClass')
          expect(this.core.$el.removeClass).not.toHaveBeenCalled()

          this.core.toggleFullscreen()

          expect(this.core.$el.removeClass).toHaveBeenCalledWith('fullscreen nocursor')
        })
      })
    })

    describe('Multiple instances', () => {
      test('shouldn\'t toggle one instance fullscreen state when another one stops', () => {
        const newInstance = new Core({})
        const fakeContainer1 = document.createElement('div')
        fakeContainer1.setAttribute('id', 'fakeContainer1')
        newInstance.el = fakeContainer1

        expect(this.core.isFullscreen()).toEqual(false)
        expect(newInstance.isFullscreen()).toEqual(false)

        jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(fakeContainer1)

        expect(this.core.isFullscreen()).toEqual(false)
        expect(newInstance.isFullscreen()).toEqual(true)
      })
    })
  })

  describe('#enableResizeObserver', () => {
    beforeEach(() => {
      this.core = new Core({})
      jest.spyOn(this.core, 'triggerResize')
    })

    test('calls #triggerResize every 500 milliseconds', () => {
      this.core.enableResizeObserver()

      expect(this.core.triggerResize).not.toHaveBeenCalled()

      setTimeout(() => {
        expect(this.core.triggerResize).toHaveBeenCalledTimes(1)

        setTimeout(() => {
          expect(this.core.triggerResize).toHaveBeenCalledTimes(2)
        },500)
      }, 500)
    })

    test('calls #triggerResize with core element width and height', () => {
      this.core.enableResizeObserver()

      setTimeout(() => {
        expect(this.core.triggerResize).toHaveBeenCalledWith({ height: 0, width: 0 })
      }, 500)
    })
  })

  describe('#triggerResize', () => {
    test('sets the properties oldHeight and oldWidth with the new one', () => {
      const newSize = { width: '50%', height: '50%' }
      this.core = new Core({})

      expect(this.core.oldHeight).toEqual(undefined)
      expect(this.core.oldWidth).toEqual(undefined)

      this.core.triggerResize(newSize)

      expect(this.core.oldHeight).toEqual('50%')
      expect(this.core.oldWidth).toEqual('50%')
    })

    test('sets the property computedSize with the new one', () => {
      const newSize = { width: '50%', height: '50%' }
      this.core = new Core({})

      expect(this.core.computedSize).toEqual(undefined)

      this.core.triggerResize(newSize)

      expect(this.core.computedSize).toEqual(newSize)
    })

    test('triggers on an event Events.CORE_RESIZE', () => {
      const newSize = { width: '50%', height: '50%' }
      this.core = new Core({})
      jest.spyOn(this.core, 'trigger')
      this.core.triggerResize(newSize)

      expect(this.core.trigger).toHaveBeenCalledWith(Events.CORE_RESIZE, newSize)
    })
  })

  describe('#handleWindowResize', () => {
    beforeEach(() => {
      this.core = new Core({})
      this.currentScreenOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      this.core._screenOrientation = this.currentScreenOrientation
      jest.spyOn(this.core, 'triggerResize')
    })

    describe('when change the screen orientation', () => {
      test('calls #triggerResize with core element width and height', () => {
        this.core._screenOrientation = this.currentScreenOrientation == 'landscape' ? 'portrait' : 'landscape'
        this.core.handleWindowResize('event')
        expect(this.core.triggerResize).toHaveBeenCalledWith({ height: 0, width: 0 })
      })
    })

    describe('when screen orientation doesn\'t change', () => {
      test('doesn\'t calls #triggerResize', () => {
        this.core.handleWindowResize('event')
        expect(this.core.triggerResize).not.toHaveBeenCalled()
      })
    })
  })

  describe('when rendering', () => {
    beforeEach(() => {
      this.core = new Core({})
    })

    test('append default style element', () => {
      this.core.render()

      expect(this.core.el.children.length).toEqual(1)
      expect(this.core.el.children[0].tagName).toEqual('STYLE')
    })

    test('append default and reset style elements with includeResetStyle set', () => {
      const newOptions = {
        includeResetStyle: true,
      }
      this.core.configure(newOptions)

      this.core.render()

      expect(this.core.el.children.length).toEqual(2)
      expect(this.core.el.children[0].tagName).toEqual('STYLE')
      expect(this.core.el.children[1].tagName).toEqual('STYLE')
    })

    test('does append style elements twice', () => {
      this.core.render()
      this.core.render()

      expect(this.core.el.children.length).toEqual(1)
      expect(this.core.el.children[0].tagName).toEqual('STYLE')
    })
  })
})
