import FakePlayback from '../../src/base/playback'
import Container from '../../src/components/container'
import Poster from '../../src/plugins/poster'
import Events from '../../src/base/events'
import $ from 'clappr-zepto'

describe('Poster', function() {
  beforeEach(function() {
    this.playback = new FakePlayback()
    this.container = new Container({playback: this.playback})
    this.poster = new Poster({container: this.container})
    this.container.addPlugin(this.poster)
  })

  it('is named poster', function() {
    expect(this.poster.name).to.equal('poster')
  })

  it('disables media control by default', function() {
    expect(this.container.mediaControlDisabled).to.be.true
  })

  it('listens to container:state:buffering event', function() {
    sinon.spy(this.poster, 'hidePlayButton')
    this.container.trigger(Events.CONTAINER_STATE_BUFFERING)
    expect(this.poster.hidePlayButton).called.once
    expect(this.poster.$playButton.is(':visible')).to.be.false
  })

  it('listens to container:bufferfull event', function() {
    sinon.spy(this.poster, 'onBufferfull')
    this.poster.bindEvents()
    this.container.trigger(Events.CONTAINER_STATE_BUFFERFULL)

    expect(this.poster.onBufferfull).called.once
    expect(this.poster.$el.is(':visible')).to.be.false
  })

  it('listens to container:stop event', function() {
    sinon.spy(this.container, 'disableMediaControl')
    sinon.spy(this.poster, 'showPlayButton')
    this.container.trigger(Events.CONTAINER_STOP)

    expect(this.container.disableMediaControl).called.once
    expect(this.poster.showPlayButton).called.once

    sinon.spy(this.poster, 'onStop')
    this.poster.bindEvents()

    this.container.trigger(Events.CONTAINER_STOP)

    expect(this.poster.onStop).called.once
  })

  it('treats container:ended event as container:stop', function() {
    sinon.spy(this.container, 'disableMediaControl')
    sinon.spy(this.poster, 'showPlayButton')
    this.container.trigger(Events.CONTAINER_ENDED)

    expect(this.container.disableMediaControl).called.once
    expect(this.poster.showPlayButton).called.once

    var spy = sinon.spy(this.poster, 'onStop')
    this.poster.bindEvents()

    this.container.trigger(Events.CONTAINER_STOP)

    expect(spy).called.once
  })

  it('plays the container on click', function() {
    sinon.spy(this.container, 'play')
    $(this.poster.$el).click()
    expect(this.container.play).called.once
  })
})
