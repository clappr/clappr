import Container from './container'
import HTML5Playback from '../../playbacks/html5_video'
import Playback from '../../base/playback'
import Events from '../../base/events'

const FakePlayback = Playback

describe('Container', function() {
  beforeEach(() => {
    this.playback = new FakePlayback()
    this.container = new Container({ playback: this.playback })
  })

  test('uses settings from playback', () => {
    expect(this.container.settings).toEqual((new FakePlayback).settings)
  })

  test('gets playback type', () => {
    expect(this.container.getPlaybackType()).toEqual(Playback.NO_OP)
  })

  test('treats the playback as a plugin', () => {
    expect(this.container.plugins[0]).toEqual(this.playback)
  })

  test('gets a plugin by name', () => {
    const plugin = { name: 'fake' }
    this.container.addPlugin(plugin)
    expect( this.container.getPlugin('fake')).toEqual(plugin)
  })

  test('destroys all the plugins', () => {
    const fakePlugin = { destroy: () => {} }

    jest.spyOn(this.playback, 'destroy')
    jest.spyOn(fakePlugin, 'destroy')
    jest.spyOn(this.container, 'stopListening')
    jest.spyOn(this.container, 'trigger')
    jest.spyOn(this.container.$el, 'remove')
    this.container.addPlugin(fakePlugin)

    this.container.destroy()

    expect(this.container.trigger).toHaveBeenCalledWith(Events.CONTAINER_DESTROYED, this.container, this.container.name)
    expect(this.container.stopListening).toHaveBeenCalledTimes(1)
    expect(this.playback.destroy).toHaveBeenCalledTimes(1)
    expect(fakePlugin.destroy).toHaveBeenCalledTimes(1)
    expect(this.container.$el.remove).toHaveBeenCalledTimes(1)
  })

  test('update playback options when configure', () => {
    jest.spyOn(this.playback, 'configure')
    const fakeOptions = { foo: 'bar' }
    this.container.configure(fakeOptions)

    expect(this.playback.configure).toHaveBeenCalled()
    expect(this.playback.options.foo).toEqual(fakeOptions.foo)
  })

  test('listens to playback:progress event', () => {
    jest.spyOn(this.container, 'onProgress')

    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_PROGRESS, { start: 0, current: 3000, total: 6000 })

    expect(this.container.onProgress).toHaveBeenCalledWith({ start: 0, current: 3000, total: 6000 })
  })

  test('listens to playback:timeupdate event', () => {
    jest.spyOn(this.container, 'timeUpdated')
    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_TIMEUPDATE, { current: 2, total: 40 })

    expect(this.container.timeUpdated).toHaveBeenCalledWith({ current: 2, total: 40 })
  })

  test('listens to playback:seek event', (done) => {
    let playback = new HTML5Playback({ src: '/base/test/fixtures/SampleVideo_360x240_1mb.mp4' })
    let container = new Container({ playback: playback })
    let callback = jest.fn()

    container.bindEvents()
    container.on(Events.CONTAINER_SEEK, callback)
    container.on(Events.CONTAINER_SEEK, () => {
      expect(callback).toHaveBeenCalled()
      done()
    })

    playback.el.dispatchEvent(new Event('seeking'))
  })

  test('listens to playback:seeked event', (done) => {
    let playback = new HTML5Playback({ src: '/base/test/fixtures/SampleVideo_360x240_1mb.mp4' })
    let container = new Container({ playback: playback })
    let callback = jest.fn()

    container.bindEvents()
    container.on(Events.CONTAINER_SEEKED, callback)
    container.on(Events.CONTAINER_SEEKED, () => {
      expect(callback).toHaveBeenCalled()
      done()
    })

    playback.el.dispatchEvent(new Event('seeked'))
  })

  test('listens to playback:ready event', () => {
    jest.spyOn(this.container, 'ready')
    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_READY)
    expect(this.container.isReady).toBeTruthy()
    expect(this.container.ready).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:buffering event', () => {
    jest.spyOn(this.container, 'onBuffering')
    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_BUFFERING)
    expect(this.container.onBuffering).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:bufferfull event', () => {
    jest.spyOn(this.container, 'bufferfull')
    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_BUFFERFULL)
    expect(this.container.bufferfull).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:settingsupdate event', () => {
    jest.spyOn(this.container, 'settingsUpdate')
    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_SETTINGSUPDATE)
    expect(this.container.settingsUpdate).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:loadedmetadata event', () => {
    jest.spyOn(this.container, 'loadedMetadata')

    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_LOADEDMETADATA, { duration: 45, data: { hold: 'on' } })

    expect(this.container.loadedMetadata).toHaveBeenCalledWith({ duration: 45, data: { hold: 'on' } })
  })

  test('listens to playback:highdefinitionupdate event', () => {
    const isHD = true
    jest.spyOn(this.container, 'highDefinitionUpdate')

    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, isHD)

    expect(this.container.highDefinitionUpdate).toHaveBeenCalledWith(true)
  })

  test('listens to playback:mediacontrol:disable event', () => {
    jest.spyOn(this.container, 'disableMediaControl')
    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_MEDIACONTROL_DISABLE)

    expect(this.container.disableMediaControl).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:mediacontrol:enable event', () => {
    jest.spyOn(this.container, 'enableMediaControl')
    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_MEDIACONTROL_ENABLE)

    expect(this.container.enableMediaControl).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:ended event', () => {
    jest.spyOn(this.container, 'onEnded')
    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_ENDED)

    expect(this.container.onEnded).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:play event', () => {
    jest.spyOn(this.container, 'playing')
    this.container.bindEvents()
    this.playback.trigger(Events.PLAYBACK_PLAY)

    expect(this.container.playing).toHaveBeenCalledTimes(1)
  })

  describe('#checkResize', () => {
    beforeEach(() => {
      this.container.el = { clientWidth: 640, clientHeight: 360 }
    })

    test('sets the current size if it\'s uninitialized', () => {
      expect(this.container.currentSize).toBeUndefined()

      this.container.checkResize()

      expect(this.container.currentSize).toEqual({ width: 640, height: 360 })
    })

    test('triggers a CONTAINER_RESIZE event when the size changes', () => {
      const newSize = { width: 320, height: 240 }

      jest.spyOn(this.container, 'trigger')
      this.container.el = { clientWidth: newSize.width, clientHeight: newSize.height }
      this.container.checkResize()

      expect(this.container.trigger).toHaveBeenCalledWith(Events.CONTAINER_RESIZE, newSize)
    })

    test('doesn\'t trigger CONTAINER_RESIZE if size hasn\'t changed', () => {
      this.container.checkResize() // this will initialized currentSize AND trigger the first resize

      jest.spyOn(this.container, 'trigger')
      this.container.checkResize()

      expect(this.container.trigger).not.toHaveBeenCalled()
    })
  })
})
