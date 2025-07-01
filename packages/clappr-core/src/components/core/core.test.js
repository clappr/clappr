import Core from './core'
import Browser from '../browser'
import Events from '../../base/events'
import { Fullscreen } from '../../utils'

describe('Core', function() {
  describe('When configure', () => {
    let core
    beforeEach(() => {
      core = new Core({})
      core.load = jest.fn()
    })

    test('should update option', () => {
      const newOptions = {
        autoPlay: true
      }
      core.configure(newOptions)

      expect(core.options.autoPlay).toEqual(newOptions.autoPlay)
    })

    test('should update option and load source', () => {
      const newOptions = {
        source: 'some/path/to/media.mp4',
        mute: true
      }
      core.configure(newOptions)

      expect(core.load).toHaveBeenCalled()
      expect(core.options.mute).toEqual(newOptions.mute)
    })

    test('shoud trigger options change event', () => {
      let callback = jest.fn()
      core.on(Events.CORE_OPTIONS_CHANGE, callback)

      const newOptions = {
        autoPlay: false
      }
      core.configure(newOptions)

      expect(callback).toHaveBeenCalled()
      expect(core.options.autoPlay).toEqual(newOptions.autoPlay)
    })

    test('should trigger options will change event', () => {
      let callback = jest.fn()
      core.on(Events.CORE_OPTIONS_WILL_CHANGE, callback)

      const newOptions = {
        autoPlay: false
      }
      core.configure(newOptions)

      expect(callback).toHaveBeenCalled()
    })

    test('should trigger both events in correct order', () => {
      const eventOrder = []
      
      core.on(Events.CORE_OPTIONS_WILL_CHANGE, () => {
        eventOrder.push('will_change')
      })
      
      core.on(Events.CORE_OPTIONS_CHANGE, () => {
        eventOrder.push('change')
      })

      core.configure({ autoPlay: false })

      expect(eventOrder).toEqual(['will_change', 'change'])
    })
  })

  describe('#isFullscreen', () => {
    let core
    beforeEach(() => {
      const el = document.createElement('div')
      el.setAttribute('id', 'fakeCoreElement')
      core = new Core({})
      core.el = el
    })

    test('returns false when there\'s no active fullscreen element', () => {
      jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(undefined)

      expect(core.isFullscreen()).toEqual(false)
    })

    test('returns false when the active fullscreen element is not the core element', () => {
      const el = document.createElement('div')
      jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(el)

      expect(core.isFullscreen()).toEqual(false)
    })

    test('returns true if the active fullscreen element is the core element', () => {
      jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(core.el)

      expect(core.isFullscreen()).toEqual(true)
    })

    test('returns true if the active fullscreen element is the playback element', () => {
      const playbackEl = document.createElement('div')
      core.activeContainer = { playback: { el: playbackEl } }

      jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(playbackEl)

      expect(core.isFullscreen()).toEqual(true)
    })

    describe('on iOS', () => {
      beforeEach(() => { Browser.isiOS = true })
      afterEach(() => { Browser.isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) })

      test('returns false if there\'s no active playback', () => {
        core.activeContainer = undefined

        expect(core.isFullscreen()).toEqual(false)
      })

      test('returns true if the fullscreen element is from the active playback', () => {
        const el = document.createElement('div')
        el.setAttribute('id', 'fakePlayback')
        const playback = { el }
        core.activeContainer = { playback }

        jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(el)

        expect(core.isFullscreen()).toEqual(true)
      })
    })
  })

  describe('#toggleFullscreen', () => {
    let core
    beforeEach(() => {
      core = new Core({})
    })

    describe('when is not in fullscreen', () => {
      beforeEach(() => { jest.spyOn(Fullscreen, 'requestFullscreen') })

      describe('and is not an iOS Browser', () => {
        test('calls Fullscreen.requestFullscreen with core element', () => {
          core.el.requestFullscreen = () => new Promise((resolve, reject) => core.el ? resolve() : reject())
          core.toggleFullscreen()

          expect(Fullscreen.requestFullscreen).toHaveBeenCalledWith(core.el)
          delete core.el.requestFullscreen
        })

        test('adds a class "fullscreen" to core element', () => {
          core.el.requestFullscreen = () => new Promise((resolve, reject) => core.el ? resolve() : reject())
          jest.spyOn(core.$el, 'addClass')
          jest.spyOn(core, 'isFullscreen').mockReturnValue(false)

          expect(core.$el.addClass).not.toHaveBeenCalled()

          core.toggleFullscreen()

          expect(core.$el.addClass).toHaveBeenCalledWith('fullscreen')
          delete core.el.requestFullscreen
        })
      })

      describe('and is an iOS Browser', () => {
        beforeEach(() => { Browser.isiOS = true })
        afterEach(() => { Browser.isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) })

        test('calls Fullscreen.requestFullscreen with activePlayback element', () => {
          const el = document.createElement('div')
          el.setAttribute('id', 'fakePlayback')
          const playback = { el }
          core.activeContainer = { playback }

          core.toggleFullscreen()

          expect(Fullscreen.requestFullscreen).toHaveBeenCalledWith(el)
        })
      })
    })

    describe('when is in fullscreen', () => {
      beforeEach(() => {
        Browser.isiOS = true
        jest.spyOn(core, 'isFullscreen').mockReturnValue(true)
      })
      afterEach(() => { Browser.isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) })

      test('calls Fullscreen.cancelFullscreen', () => {
        jest.spyOn(Fullscreen, 'cancelFullscreen')

        core.toggleFullscreen()
        expect(Fullscreen.cancelFullscreen).toHaveBeenCalled()
      })

      describe('Browser.isiOS', () => {
        beforeEach(() => { Browser.isiOS = false })
        afterEach(() => { Browser.isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) })

        test('removes "fullscreen nocursor" classes from core element', () => {
          jest.spyOn(core.$el, 'removeClass')
          expect(core.$el.removeClass).not.toHaveBeenCalled()

          core.toggleFullscreen()

          expect(core.$el.removeClass).toHaveBeenCalledWith('fullscreen nocursor')
        })
      })
    })

    describe('Multiple instances', () => {
      test('shouldn\'t toggle one instance fullscreen state when another one stops', () => {
        const newInstance = new Core({})
        const fakeContainer1 = document.createElement('div')
        fakeContainer1.setAttribute('id', 'fakeContainer1')
        newInstance.el = fakeContainer1

        expect(core.isFullscreen()).toEqual(false)
        expect(newInstance.isFullscreen()).toEqual(false)

        jest.spyOn(Fullscreen, 'fullscreenElement').mockReturnValue(fakeContainer1)

        expect(core.isFullscreen()).toEqual(false)
        expect(newInstance.isFullscreen()).toEqual(true)
      })
    })
  })

  describe('#enableResizeObserver', () => {
    let core
    beforeEach(() => {
      core = new Core({})
      jest.spyOn(core, 'triggerResize')
    })

    test('calls #triggerResize every 500 milliseconds', () => {
      core.enableResizeObserver()

      expect(core.triggerResize).not.toHaveBeenCalled()

      setTimeout(() => {
        expect(core.triggerResize).toHaveBeenCalledTimes(1)

        setTimeout(() => {
          expect(core.triggerResize).toHaveBeenCalledTimes(2)
        },500)
      }, 500)
    })

    test('calls #triggerResize with core element width and height', () => {
      core.enableResizeObserver()

      setTimeout(() => {
        expect(core.triggerResize).toHaveBeenCalledWith({ height: 0, width: 0 })
      }, 500)
    })
  })

  describe('#triggerResize', () => {
    test('sets the properties oldHeight and oldWidth with the new one', () => {
      const newSize = { width: '50%', height: '50%' }

      let core = new Core({})

      expect(core.oldHeight).toEqual(undefined)
      expect(core.oldWidth).toEqual(undefined)

      core.triggerResize(newSize)

      expect(core.oldHeight).toEqual('50%')
      expect(core.oldWidth).toEqual('50%')
    })

    test('sets the property computedSize with the new one', () => {
      const newSize = { width: '50%', height: '50%' }
      let core = new Core({})

      expect(core.computedSize).toEqual(undefined)

      core.triggerResize(newSize)

      expect(core.computedSize).toEqual(newSize)
    })

    test('triggers on an event Events.CORE_RESIZE', () => {
      const newSize = { width: '50%', height: '50%' }
      let core = new Core({})
      jest.spyOn(core, 'trigger')
      core.triggerResize(newSize)

      expect(core.trigger).toHaveBeenCalledWith(Events.CORE_RESIZE, newSize)
    })
  })

  describe('#handleWindowResize', () => {
    let core
    let currentScreenOrientation
    beforeEach(() => {
      core = new Core({})
      currentScreenOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      core._screenOrientation = currentScreenOrientation
      jest.spyOn(core, 'triggerResize')
    })

    describe('when change the screen orientation', () => {
      let core
      let currentScreenOrientation
      let mockTriggerResize
      beforeEach(() => {
        core = new Core({})
        mockTriggerResize = jest.spyOn(core, 'triggerResize')
        currentScreenOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        core._screenOrientation = currentScreenOrientation
      })

      afterEach(() => {
        mockTriggerResize.mockRestore()
      })

      test('calls #triggerResize with core element width and height', () => {
        core._screenOrientation = currentScreenOrientation === 'landscape' ? 'portrait' : 'landscape'
        core.handleWindowResize('event')
        expect(core.triggerResize).toHaveBeenCalledWith({ height: 0, width: 0 })
      })
    })

    describe('when screen orientation doesn\'t change', () => {
      test('doesn\'t calls #triggerResize', () => {
        core.handleWindowResize('event')
        expect(core.triggerResize).not.toHaveBeenCalled()
      })
    })
  })

  describe('when rendering', () => {
    let core
    beforeEach(() => {
      core = new Core({})
    })

    test('append default style element', () => {
      core.render()

      expect(core.el.children.length).toEqual(1)
      expect(core.el.children[0].tagName).toEqual('STYLE')
    })

    test('append default and reset style elements with includeResetStyle set', () => {
      const newOptions = {
        includeResetStyle: true,
      }
      core.configure(newOptions)

      core.render()

      expect(core.el.children.length).toEqual(2)
      expect(core.el.children[0].tagName).toEqual('STYLE')
      expect(core.el.children[1].tagName).toEqual('STYLE')
    })

    test('does append style elements twice', () => {
      core.render()
      core.render()

      expect(core.el.children.length).toEqual(1)
      expect(core.el.children[0].tagName).toEqual('STYLE')
    })
  })

  test('resize', () => {
    const data = { width: 100, height: 100 }
    let callback = jest.fn()
    const core = new Core({})
    jest.spyOn(core, 'onResize')
    core.on(Events.CORE_RESIZE, callback)
    core.resize(data)
    expect(core.onResize).toHaveBeenCalledWith(data)
    expect(callback).toHaveBeenCalledWith(data)
  })
})
