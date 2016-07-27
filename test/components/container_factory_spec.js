import ContainerFactory from '../../src/components/container_factory'

import $ from 'clappr-zepto'

describe('ContainerFactory', function() {
  beforeEach(function() {
    this.options = {
      source: 'http://some.url/for/video.mp4',
      autoPlay: false
    }
    this.loader = {}
    this.i18n = {}
    this.containerFactory = new ContainerFactory(this.options, this.loader, this.i18n)
  })

  it('allows overriding options', function() {
    expect(this.containerFactory.options.source).to.be.equal(this.options.source)
    expect(this.containerFactory.options.autoPlay).to.be.equal(this.options.autoPlay)
    const newSource = 'http://some.url/for/video.m3u8'
    this.containerFactory.options = $.extend({}, this.options, {source: newSource})
    expect(this.containerFactory.options.source).to.be.equal(newSource)
  })
})
