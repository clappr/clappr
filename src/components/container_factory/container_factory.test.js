import ContainerFactory from './container_factory'
import Loader from '@/components/loader'
import ContainerPlugin from '@/base/container_plugin'
import Playback from '@/base/playback'

describe('ContainerFactory', function() {
  beforeEach(() => {
    this.options = {
      source: 'http://some.url/for/video.mp4',
      autoPlay: false
    }
    this.playback = { canPlay: () => true }
    this.loader = { playbackPlugins: [this.playback] }
    this.i18n = {}
    this.containerFactory = new ContainerFactory(this.options, this.loader, this.i18n)
  })

  test('finds playback based on source', () => {
    const playback = this.containerFactory.findPlaybackPlugin('video.mp4')
    expect(this.playback).toEqual(playback)
  })

  test('allows overriding options', () => {
    expect(this.containerFactory.options.source).toEqual(this.options.source)
    expect(this.containerFactory.options.autoPlay).toEqual(this.options.autoPlay)
    const newSource = 'http://some.url/for/video.m3u8'
    this.containerFactory.options = { ...this.options,  source: newSource }
    expect(this.containerFactory.options.source).toEqual(newSource)
  })

  test('addContainerPlugins method creates registered container plugins for a given container', () => {
    const plugin = ContainerPlugin.extend({ name: 'test_plugin' })
    Loader.registerPlugin(plugin)

    const source = 'http://some.url/for/video.mp4'
    const containerFactory =  new ContainerFactory({}, new Loader(), {})
    const container = containerFactory.createContainer(source)
    expect(container.getPlugin('test_plugin')).not.toBeUndefined()

    const pluginInstance = container.getPlugin('test_plugin')

    expect(pluginInstance.container).toEqual(container)
  })

  describe('createContainer method', () => {
    test('creates a container for a given source', () => {
      const source = 'http://some.url/for/video.mp4'
      const containerFactory =  new ContainerFactory({}, new Loader(), {})
      const container = containerFactory.createContainer(source)

      expect(container.options.src).toEqual(source)
    })

    test('creates a playback instance based on existent playback plugins and a given source', () => {
      class CustomPlayback extends Playback {
        get name() { return 'custom-playback' }
        get supportedVersion() { return { min: VERSION } }
      }
      CustomPlayback.canPlay = () => true
      Loader.registerPlayback(CustomPlayback)

      const source = 'http://some.url/for/video.mp4'
      const containerFactory =  new ContainerFactory({}, new Loader(), {})
      const container = containerFactory.createContainer(source)

      expect(container.playback.name).toEqual('custom-playback')
    })

    test('creates a container for a given set of options that includes a source', () => {
      const options = { source: 'http://some.url/for/video.mp4' }
      const containerFactory =  new ContainerFactory({}, new Loader(), {})
      const container = containerFactory.createContainer(options)

      expect(container.options.src).toEqual(options.source)
    })

    test('creates a container for a given set of options that includes a source and a mimeType', () => {
      const options = { source: 'http://some.url/for/video', mimeType: 'mp4' }
      const containerFactory =  new ContainerFactory({}, new Loader(), {})
      const container = containerFactory.createContainer(options)

      expect(container.options.src).toEqual(options.source)
    })

    test('uses current domain protocol to set source on the container instance', () => {
      const source = '//some.url/for/video.mp4'
      const containerFactory =  new ContainerFactory({}, new Loader(), {})
      const container = containerFactory.createContainer(source)

      expect(container.options.src).toEqual(`http:${source}`)
    })
  })

  describe('createContainers method', () => {
    test('creates a container for each source existent in sources array option', (done) => {
      const sources = ['http://some.url/for/video.mp4', 'http://another.url/for/video.mp4']
      const containerFactory =  new ContainerFactory({ sources }, new Loader(), {})
      containerFactory.createContainers().then(containers => {
        expect(containers.length).toEqual(2)
        expect(containers[0].options.src).toEqual(sources[0])
        expect(containers[1].options.src).toEqual(sources[1])
        done()
      })
    })
  })
})
