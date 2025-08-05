import { Container, Events, Playback, $ } from '@clappr/core'

import Poster from './poster'

describe('Poster', function () {
  beforeEach(function () {
    this.playback = new Playback()
    this.playback.getPlaybackType = function () {
      return Playback.VOD
    }
    this.container = new Container({ playback: this.playback })
    this.poster = new Poster(this.container)
    this.container.addPlugin(this.poster)
  })

  it('is named poster', function () {
    expect(this.poster.name).to.equal('poster')
  })

  it('disables media control by default', function () {
    expect(this.container.mediaControlDisabled).to.be.true
  })

  it('renders if the playback type is not NO_OP', function () {
    expect(this.poster.shouldRender).to.be.true
  })

  it('does not render if the playback type is NO_OP', function () {
    this.playback.getPlaybackType = function () {
      return Playback.NO_OP
    }
    expect(this.poster.shouldRender).to.be.false
  })

  it('does not render if the playback name is html_img', function () {
    this.playback.name = 'html_img'
    expect(this.poster.shouldRender).to.be.false
  })

  it('listens to container:stop event', function () {
    sinon.spy(this.container, 'disableMediaControl')
    sinon.spy(this.poster, 'showPlayButton')
    this.container.trigger(Events.CONTAINER_STOP)

    expect(this.container.disableMediaControl).to.have.been.calledOnce
    expect(this.poster.showPlayButton).to.have.been.calledOnce

    sinon.spy(this.poster, 'onStop')
    this.poster.bindEvents()

    this.container.trigger(Events.CONTAINER_STOP)

    expect(this.poster.onStop).to.have.been.calledOnce
  })

  it('treats container:ended event as container:stop', function () {
    sinon.spy(this.container, 'disableMediaControl')
    sinon.spy(this.poster, 'showPlayButton')
    this.container.trigger(Events.CONTAINER_ENDED)

    expect(this.container.disableMediaControl).to.have.been.calledOnce
    expect(this.poster.showPlayButton).to.have.been.calledOnce

    const spy = sinon.spy(this.poster, 'onStop')
    this.poster.bindEvents()

    this.container.trigger(Events.CONTAINER_STOP)

    expect(spy).to.have.been.calledOnce
  })

  it('disables handling container:ended event as container:stop', function () {
    this.container = new Container({ playback: this.playback, poster: { showOnVideoEnd: false } })
    this.poster = new Poster(this.container)
    this.container.addPlugin(this.poster)
    sinon.spy(this.container, 'disableMediaControl')
    sinon.spy(this.poster, 'showPlayButton')
    this.container.trigger(Events.CONTAINER_ENDED)

    expect(this.container.disableMediaControl).to.not.have.been.called
    expect(this.poster.showPlayButton).to.not.have.been.called
  })

  it('plays the container on click', function () {
    sinon.spy(this.container, 'play')
    $(this.poster.$el).click()
    expect(this.container.play).to.have.been.calledOnce
  })

  it('keeps the poster up for audio only sources', function () {
    expect(this.poster.shouldHideOnPlay()).to.equal(true)
    Object.defineProperty(this.playback, 'isAudioOnly', { get: function () { return true } })
    expect(this.poster.shouldHideOnPlay()).to.equal(false)
  })

  it('renders custom background', function () {
    this.container = new Container({
      playback: this.playback,
      poster: { custom: 'linear-gradient(rgb(238, 238, 238), rgb(153, 153, 153))' }
    })
    this.poster = new Poster(this.container)
    this.container.addPlugin(this.poster)
    expect($(this.poster.$el).css('background')).include('linear-gradient(rgb(238, 238, 238), rgb(153, 153, 153))')
  })
})
