import { Container, Events, Playback, $ } from '@clappr/core'

const ctx = {}
import Poster from './poster'

describe('Poster', function () {
  beforeEach(function () {
    localStorage.clear()
    ctx.playback = new Playback()
    ctx.playback.getPlaybackType = function () {
      return Playback.VOD
    }
    ctx.container = new Container({ playback: ctx.playback })
    ctx.poster = new Poster(ctx.container)
    ctx.container.addPlugin(ctx.poster)
  })

  afterEach(function () {
    vi.restoreAllMocks()
  })

  it('is named poster', function () {
    expect(ctx.poster.name).toBe('poster')
  })

  it('disables media control by default', function () {
    expect(ctx.container.mediaControlDisabled).toBeTruthy()
  })

  it('renders if the playback type is not NO_OP', function () {
    expect(ctx.poster.shouldRender).toBeTruthy()
  })

  it('does not render if the playback type is NO_OP', function () {
    ctx.playback.getPlaybackType = function () {
      return Playback.NO_OP
    }
    expect(ctx.poster.shouldRender).toBeFalsy()
  })

  it('does not render if the playback name is html_img', function () {
    ctx.playback.name = 'html_img'
    expect(ctx.poster.shouldRender).toBeFalsy()
  })

  it('listens to container:stop event', function () {
    const disableMediaControlSpy = vi.spyOn(ctx.container, 'disableMediaControl')
    const showPlayButtonSpy = vi.spyOn(ctx.poster, 'showPlayButton')
    ctx.container.trigger(Events.CONTAINER_STOP)

    expect(disableMediaControlSpy).toHaveBeenCalledTimes(1)
    expect(showPlayButtonSpy).toHaveBeenCalledTimes(1)

    const onStopSpy = vi.spyOn(ctx.poster, 'onStop')
    ctx.poster.bindEvents()

    ctx.container.trigger(Events.CONTAINER_STOP)

    expect(onStopSpy).toHaveBeenCalledTimes(1)
  })

  it('treats container:ended event as container:stop', function () {
    const disableMediaControlSpy = vi.spyOn(ctx.container, 'disableMediaControl')
    const showPlayButtonSpy = vi.spyOn(ctx.poster, 'showPlayButton')
    ctx.container.trigger(Events.CONTAINER_ENDED)

    expect(disableMediaControlSpy).toHaveBeenCalledTimes(1)
    expect(showPlayButtonSpy).toHaveBeenCalledTimes(1)

    const spy = vi.spyOn(ctx.poster, 'onStop')
    ctx.poster.bindEvents()

    ctx.container.trigger(Events.CONTAINER_STOP)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('disables handling container:ended event as container:stop', function () {
    ctx.container = new Container({
      playback: ctx.playback,
      poster: { showOnVideoEnd: false }
    })
    ctx.poster = new Poster(ctx.container)
    ctx.container.addPlugin(ctx.poster)
    const disableMediaControlSpy = vi.spyOn(ctx.container, 'disableMediaControl')
    const showPlayButtonSpy = vi.spyOn(ctx.poster, 'showPlayButton')
    ctx.container.trigger(Events.CONTAINER_ENDED)

    expect(disableMediaControlSpy).not.toHaveBeenCalled()
    expect(showPlayButtonSpy).not.toHaveBeenCalled()
  })

  it('plays the container on click', function () {
    const playSpy = vi.spyOn(ctx.container, 'play')
    $(ctx.poster.$el).click()
    expect(playSpy).toHaveBeenCalledTimes(1)
  })

  it('keeps the poster up for audio only sources', function () {
    expect(ctx.poster.shouldHideOnPlay()).toBe(true)
    Object.defineProperty(ctx.playback, 'isAudioOnly', { get: function () { return true } })
    expect(ctx.poster.shouldHideOnPlay()).toBe(false)
  })

  it('renders custom background', function () {
    ctx.container = new Container({
      playback: ctx.playback,
      poster: { custom: 'linear-gradient(rgb(238, 238, 238), rgb(153, 153, 153))' }
    })
    ctx.poster = new Poster(ctx.container)
    ctx.container.addPlugin(ctx.poster)
    ctx.poster.$el = $('<div style="background: linear-gradient(rgb(238, 238, 238), rgb(153, 153, 153))"></div>')
    expect($(ctx.poster.$el).css('background')).toContain('linear-gradient(rgb(238, 238, 238), rgb(153, 153, 153))')
  })
})
