import { Container, Events, Playback, $ } from '@clappr/core'

import Poster from './poster'

describe('Poster', function () {
  beforeEach(function () {
    localStorage.clear()
    this.playback = new Playback()
    this.playback.getPlaybackType = function () {
      return Playback.VOD
    }
    this.container = new Container({ playback: this.playback })
    this.poster = new Poster(this.container)
    this.container.addPlugin(this.poster)
  })

  afterEach(function () {
    jest.restoreAllMocks()
  })

  it('is named poster', function () {
    expect(this.poster.name).toBe('poster')
  })

  it('disables media control by default', function () {
    expect(this.container.mediaControlDisabled).toBeTruthy()
  })

  it('renders if the playback type is not NO_OP', function () {
    expect(this.poster.shouldRender).toBeTruthy()
  })

  it('does not render if the playback type is NO_OP', function () {
    this.playback.getPlaybackType = function () {
      return Playback.NO_OP
    }
    expect(this.poster.shouldRender).toBeFalsy()
  })

  it('does not render if the playback name is html_img', function () {
    this.playback.name = 'html_img'
    expect(this.poster.shouldRender).toBeFalsy()
  })

  it('listens to container:stop event', function () {
    const disableMediaControlSpy = jest.spyOn(this.container, 'disableMediaControl')
    const showPlayButtonSpy = jest.spyOn(this.poster, 'showPlayButton')
    this.container.trigger(Events.CONTAINER_STOP)

    expect(disableMediaControlSpy).toHaveBeenCalledTimes(1)
    expect(showPlayButtonSpy).toHaveBeenCalledTimes(1)

    const onStopSpy = jest.spyOn(this.poster, 'onStop')
    this.poster.bindEvents()

    this.container.trigger(Events.CONTAINER_STOP)

    expect(onStopSpy).toHaveBeenCalledTimes(1)
  })

  it('treats container:ended event as container:stop', function () {
    const disableMediaControlSpy = jest.spyOn(this.container, 'disableMediaControl')
    const showPlayButtonSpy = jest.spyOn(this.poster, 'showPlayButton')
    this.container.trigger(Events.CONTAINER_ENDED)

    expect(disableMediaControlSpy).toHaveBeenCalledTimes(1)
    expect(showPlayButtonSpy).toHaveBeenCalledTimes(1)

    const spy = jest.spyOn(this.poster, 'onStop')
    this.poster.bindEvents()

    this.container.trigger(Events.CONTAINER_STOP)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('disables handling container:ended event as container:stop', function () {
    this.container = new Container({
      playback: this.playback,
      poster: { showOnVideoEnd: false }
    })
    this.poster = new Poster(this.container)
    this.container.addPlugin(this.poster)
    const disableMediaControlSpy = jest.spyOn(this.container, 'disableMediaControl')
    const showPlayButtonSpy = jest.spyOn(this.poster, 'showPlayButton')
    this.container.trigger(Events.CONTAINER_ENDED)

    expect(disableMediaControlSpy).not.toHaveBeenCalled()
    expect(showPlayButtonSpy).not.toHaveBeenCalled()
  })

  it('plays the container on click', function () {
    const playSpy = jest.spyOn(this.container, 'play')
    $(this.poster.$el).click()
    expect(playSpy).toHaveBeenCalledTimes(1)
  })

  it('keeps the poster up for audio only sources', function () {
    expect(this.poster.shouldHideOnPlay()).toBe(true)
    Object.defineProperty(this.playback, 'isAudioOnly', { get: function () { return true } })
    expect(this.poster.shouldHideOnPlay()).toBe(false)
  })

  it('renders custom background', function () {
    this.container = new Container({
      playback: this.playback,
      poster: { custom: 'linear-gradient(rgb(238, 238, 238), rgb(153, 153, 153))' }
    })
    this.poster = new Poster(this.container)
    this.container.addPlugin(this.poster)
    this.poster.$el = $('<div style="background: linear-gradient(rgb(238, 238, 238), rgb(153, 153, 153))"></div>')
    expect($(this.poster.$el).css('background')).toContain('linear-gradient(rgb(238, 238, 238), rgb(153, 153, 153))')
  })
})
