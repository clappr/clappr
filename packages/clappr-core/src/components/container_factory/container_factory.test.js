import ContainerFactory from './container_factory'
import Loader from '@/components/loader'
import ContainerPlugin from '@/base/container_plugin'
import Playback from '@/base/playback'

describe('ContainerFactory', function() {
  let options, playback, loader, container_factory
  beforeEach(() => {
    options = {
      source: 'http://some.url/for/video.mp4',
      autoPlay: false
    }
    playback = { canPlay: () => true }
    loader = { playbackPlugins: [playback] }
    container_factory = new ContainerFactory(options, loader, {})
  })

  test('finds playback based on source', () => {
    const activePlayback = container_factory.findPlaybackPlugin('video.mp4')
    expect(playback).toEqual(activePlayback)
  })

  test('allows overriding options', () => {
    expect(container_factory.options.source).toEqual(options.source)
    expect(container_factory.options.autoPlay).toEqual(options.autoPlay)
    const newSource = 'http://some.url/for/video.m3u8'
    container_factory.options = { ...options,  source: newSource }
    expect(container_factory.options.source).toEqual(newSource)
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
