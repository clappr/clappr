import Container from './container'
import HTML5Playback from '../../playbacks/html5_video'
import Playback from '../../base/playback'
import Events from '../../base/events'

const FakePlayback = Playback

describe('Container', function () {
  let playback
  let container
  beforeEach(() => {
    playback = new FakePlayback()
    container = new Container({ playback: playback })
  })

  test('uses settings from playback', () => {
    expect(container.settings).toEqual((new FakePlayback()).settings)
  })

  test('gets playback type', () => {
    expect(container.getPlaybackType()).toEqual(Playback.NO_OP)
  })

  test('treats the playback as a plugin', () => {
    expect(container.plugins[0]).toEqual(playback)
  })

  test('gets a plugin by name', () => {
    const plugin = { name: 'fake' }
    container.addPlugin(plugin)
    expect(container.getPlugin('fake')).toEqual(plugin)
  })

  test('delegates audioTracks calls to playback', () => {
    const audioTracks = []
    jest.spyOn(playback, 'audioTracks', 'get').mockReturnValue(audioTracks)

    const result = container.audioTracks

    expect(result).toBe(audioTracks)
  })

  test('delegates currentAudioTrack calls to playback', () => {
    const currentAudioTrack = {}
    jest.spyOn(playback, 'currentAudioTrack', 'get').mockReturnValue(currentAudioTrack)

    const result = container.currentAudioTrack

    expect(result).toBe(currentAudioTrack)
  })

  test('delegates switchAudioTrack calls to playback', () => {
    jest.spyOn(playback, 'switchAudioTrack').mockImplementation()

    container.switchAudioTrack(42)

    expect(playback.switchAudioTrack).toHaveBeenCalledTimes(1)
    expect(playback.switchAudioTrack).toHaveBeenCalledWith(42)
  })

  test('destroys all the plugins', () => {
    const fakePlugin = { destroy: () => {} }

    jest.spyOn(playback, 'destroy')
    jest.spyOn(fakePlugin, 'destroy')
    jest.spyOn(container, 'stopListening')
    jest.spyOn(container, 'trigger')
    jest.spyOn(container.$el, 'remove')
    container.addPlugin(fakePlugin)

    container.destroy()

    expect(container.trigger).toHaveBeenCalledWith(Events.CONTAINER_DESTROYED, container, container.name)
    expect(container.stopListening).toHaveBeenCalledTimes(1)
    expect(playback.destroy).toHaveBeenCalledTimes(1)
    expect(fakePlugin.destroy).toHaveBeenCalledTimes(1)
    expect(container.$el.remove).toHaveBeenCalledTimes(1)
  })

  test('update playback options when configure', () => {
    jest.spyOn(playback, 'configure')
    const fakeOptions = { foo: 'bar' }
    container.configure(fakeOptions)

    expect(playback.configure).toHaveBeenCalled()
    expect(playback.options.foo).toEqual(fakeOptions.foo)
  })

  test('should trigger options will change event', () => {
    const callback = jest.fn()
    container.on(Events.CONTAINER_OPTIONS_WILL_CHANGE, callback)

    const newOptions = {
      autoPlay: false
    }
    container.configure(newOptions)

    expect(callback).toHaveBeenCalled()
  })

  test('should trigger both events in correct order', () => {
    const eventOrder = []

    container.on(Events.CONTAINER_OPTIONS_WILL_CHANGE, () => {
      eventOrder.push('will_change')
    })

    container.on(Events.CONTAINER_OPTIONS_CHANGE, () => {
      eventOrder.push('change')
    })

    container.configure({ autoPlay: false })

    expect(eventOrder).toEqual(['will_change', 'change'])
  })

  test('listens to playback:progress event', () => {
    jest.spyOn(container, 'onProgress')

    container.bindEvents()
    playback.trigger(Events.PLAYBACK_PROGRESS, { start: 0, current: 3000, total: 6000 })

    expect(container.onProgress).toHaveBeenCalledWith({ start: 0, current: 3000, total: 6000 })
  })

  test('listens to playback:timeupdate event', () => {
    jest.spyOn(container, 'timeUpdated')
    container.bindEvents()
    playback.trigger(Events.PLAYBACK_TIMEUPDATE, { current: 2, total: 40 })

    expect(container.timeUpdated).toHaveBeenCalledWith({ current: 2, total: 40 })
  })

  test('listens to playback:seek event', () => {
    const playback = new HTML5Playback({ src: '/base/test/fixtures/SampleVideo_360x240_1mb.mp4' })
    const container = new Container({ playback: playback })
    const callback = jest.fn()

    container.bindEvents()
    container.on(Events.CONTAINER_SEEK, callback)
    container.on(Events.CONTAINER_SEEK, () => {
      expect(callback).toHaveBeenCalled()
    })

    playback.el.dispatchEvent(new Event('seeking'))
  })

  test('listens to playback:seeked event', () => {
    const playback = new HTML5Playback({ src: '/base/test/fixtures/SampleVideo_360x240_1mb.mp4' })
    const container = new Container({ playback: playback })
    const callback = jest.fn()

    container.bindEvents()
    container.on(Events.CONTAINER_SEEKED, callback)
    container.on(Events.CONTAINER_SEEKED, () => {
      expect(callback).toHaveBeenCalled()
    })

    playback.el.dispatchEvent(new Event('seeked'))
  })

  test('listens to playback:ready event', () => {
    jest.spyOn(container, 'ready')
    container.bindEvents()
    playback.trigger(Events.PLAYBACK_READY)
    expect(container.isReady).toBeTruthy()
    expect(container.ready).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:buffering event', () => {
    jest.spyOn(container, 'onBuffering')
    container.bindEvents()
    playback.trigger(Events.PLAYBACK_BUFFERING)
    expect(container.onBuffering).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:bufferfull event', () => {
    jest.spyOn(container, 'bufferfull')
    container.bindEvents()
    playback.trigger(Events.PLAYBACK_BUFFERFULL)
    expect(container.bufferfull).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:settingsupdate event', () => {
    jest.spyOn(container, 'settingsUpdate')
    container.bindEvents()
    playback.trigger(Events.PLAYBACK_SETTINGSUPDATE)
    expect(container.settingsUpdate).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:loadedmetadata event', () => {
    jest.spyOn(container, 'loadedMetadata')

    container.bindEvents()
    playback.trigger(Events.PLAYBACK_LOADEDMETADATA, { duration: 45, data: { hold: 'on' } })

    expect(container.loadedMetadata).toHaveBeenCalledWith({ duration: 45, data: { hold: 'on' } })
  })

  test('listens to playback:highdefinitionupdate event', () => {
    const isHD = true
    jest.spyOn(container, 'highDefinitionUpdate')

    container.bindEvents()
    playback.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, isHD)

    expect(container.highDefinitionUpdate).toHaveBeenCalledWith(true)
  })

  test('listens to playback:mediacontrol:disable event', () => {
    jest.spyOn(container, 'disableMediaControl')
    container.bindEvents()
    playback.trigger(Events.PLAYBACK_MEDIACONTROL_DISABLE)

    expect(container.disableMediaControl).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:mediacontrol:enable event', () => {
    jest.spyOn(container, 'enableMediaControl')
    container.bindEvents()
    playback.trigger(Events.PLAYBACK_MEDIACONTROL_ENABLE)

    expect(container.enableMediaControl).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:ended event', () => {
    jest.spyOn(container, 'onEnded')
    container.bindEvents()
    playback.trigger(Events.PLAYBACK_ENDED)

    expect(container.onEnded).toHaveBeenCalledTimes(1)
  })

  test('listens to playback:play event', () => {
    jest.spyOn(container, 'playing')
    container.bindEvents()
    playback.trigger(Events.PLAYBACK_PLAY)

    expect(container.playing).toHaveBeenCalledTimes(1)
  })

  test('trigger container:pause with no parameters', () => {
    jest.spyOn(container, 'trigger')
    container.pause()
    playback.trigger(Events.PLAYBACK_PAUSE)

    expect(container.trigger).toHaveBeenCalledWith(Events.CONTAINER_PAUSE, container.name, {})
  })

  test('trigger container:pause with parameters', () => {
    jest.spyOn(container, 'trigger')
    const parameter = { anyParameter: 'parameter' }
    container.pause(parameter)
    playback.trigger(Events.PLAYBACK_PAUSE)

    expect(container.trigger).toHaveBeenCalledWith(Events.CONTAINER_PAUSE, container.name, parameter)
  })

  test('trigger container:play with no parameters', () => {
    jest.spyOn(container, 'trigger')
    container.pause()
    playback.trigger(Events.PLAYBACK_PLAY)

    expect(container.trigger).toHaveBeenCalledWith(Events.CONTAINER_PLAY, container.name, {})
  })

  test('trigger container:play with parameters', () => {
    jest.spyOn(container, 'trigger')
    const parameter = { anyParameter: 'parameter' }
    container.play(parameter)
    playback.trigger(Events.PLAYBACK_PLAY)

    expect(container.trigger).toHaveBeenCalledWith(Events.CONTAINER_PLAY, container.name, parameter)
  })

  test('trigger container:stop with no parameters', () => {
    jest.spyOn(container, 'trigger')
    container.stop()
    playback.trigger(Events.PLAYBACK_STOP)

    expect(container.trigger).toHaveBeenCalledWith(Events.CONTAINER_STOP, {})
  })

  test('trigger container:stop with parameters', () => {
    jest.spyOn(container, 'trigger')
    const parameter = { anyParameter: 'parameter' }
    container.stop(parameter)
    playback.trigger(Events.PLAYBACK_STOP)

    expect(container.trigger).toHaveBeenCalledWith(Events.CONTAINER_STOP, parameter)
  })

  test('triggers CONTAINER_AUDIO_AVAILABLE when PLAYBACK_AUDIO_AVAILABLE happens', () => {
    const audioTracks = []
    jest.spyOn(container, 'trigger')
    container.bindEvents()

    playback.trigger(Events.PLAYBACK_AUDIO_AVAILABLE, audioTracks)

    expect(container.trigger).toHaveBeenCalledWith(Events.CONTAINER_AUDIO_AVAILABLE, audioTracks)
  })

  test('triggers CONTAINER_AUDIO_CHANGED when PLAYBACK_AUDIO_CHANGED happens', () => {
    const audioTracks = []
    jest.spyOn(container, 'trigger')
    container.bindEvents()

    playback.trigger(Events.PLAYBACK_AUDIO_CHANGED, audioTracks)

    expect(container.trigger).toHaveBeenCalledWith(Events.CONTAINER_AUDIO_CHANGED, audioTracks)
  })

  describe('#checkResize', () => {
    beforeEach(() => {
      container.el = { clientWidth: 640, clientHeight: 360 }
    })

    test('sets the current size if it\'s uninitialized', () => {
      expect(container.currentSize).toBeUndefined()

      container.checkResize()

      expect(container.currentSize).toEqual({ width: 640, height: 360 })
    })

    test('triggers a CONTAINER_RESIZE event when the size changes', () => {
      const newSize = { width: 320, height: 240 }

      jest.spyOn(container, 'trigger')
      container.el = { clientWidth: newSize.width, clientHeight: newSize.height }
      container.checkResize()

      expect(container.trigger).toHaveBeenCalledWith(Events.CONTAINER_RESIZE, newSize)
    })

    test('doesn\'t trigger CONTAINER_RESIZE if size hasn\'t changed', () => {
      container.checkResize() // this will initialized currentSize AND trigger the first resize

      jest.spyOn(container, 'trigger')
      container.checkResize()

      expect(container.trigger).not.toHaveBeenCalled()
    })
  })

  test('resize', () => {
    const data = { width: 100, height: 100 }
    jest.spyOn(container, 'onResize')
    jest.spyOn(playback, 'resize')
    container.resize(data)
    expect(container.onResize).toHaveBeenCalledWith(data)
    expect(playback.resize).toHaveBeenCalledWith(data)
  })
})
