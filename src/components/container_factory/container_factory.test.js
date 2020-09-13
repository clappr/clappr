import ContainerFactory from './container_factory'

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
})
