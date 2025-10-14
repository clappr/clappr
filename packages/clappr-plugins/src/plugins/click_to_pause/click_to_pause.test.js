import { Events, Container, Playback } from '@clappr/core'

import ClickToPause from './click_to_pause'

describe('clickToPause', function () {
  beforeEach(function () {
    localStorage.clear()
    this.playback = new Playback()
    this.container = new Container({ playback: this.playback })
    this.plugin = new ClickToPause(this.container)
  })

  afterEach(function () {
    jest.restoreAllMocks()
  })

  it('has name', function () {
    expect(this.plugin.name).toBe('click_to_pause')
  })

  it('call pause when playing and dvr is enabled', function (done) {
    jest.spyOn(this.container, 'isPlaying').mockImplementation(() => true)
    jest.spyOn(this.container, 'isDvrEnabled').mockImplementation(() => true)
    const pauseSpy = jest.spyOn(this.container, 'pause')

    this.container.on(Events.CONTAINER_CLICK, () => {
      expect(pauseSpy).toHaveBeenCalledTimes(1)
      done()
    })

    this.container.trigger(Events.CONTAINER_CLICK)
  })

  it('call play when not playing and dvr is enabled', function (done) {
    jest.spyOn(this.container, 'isPlaying').mockImplementation(() => false)
    jest.spyOn(this.container, 'isDvrEnabled').mockImplementation(() => true)
    const playSpy = jest.spyOn(this.container, 'play')

    this.container.on(Events.CONTAINER_CLICK, () => {
      expect(playSpy).toHaveBeenCalledTimes(1)
      done()
    })

    this.container.trigger(Events.CONTAINER_CLICK)
  })

  it('not call play nor pause when playback type is live and dvr is disable', function (done) {
    jest.spyOn(this.container, 'getPlaybackType').mockImplementation(() => Playback.LIVE)
    jest.spyOn(this.container, 'isDvrEnabled').mockImplementation(() => false)
    const playSpy = jest.spyOn(this.container, 'play')
    const pauseSpy = jest.spyOn(this.container, 'pause')

    this.container.on(Events.CONTAINER_CLICK, () => {
      expect(playSpy).not.toHaveBeenCalled()
      expect(pauseSpy).not.toHaveBeenCalled()
      done()
    })

    this.container.trigger(Events.CONTAINER_CLICK)
  })

  it('not show cursor pointer when playback is live and drv is disable', function (done) {
    jest.spyOn(this.container, 'getPlaybackType').mockImplementation(() => Playback.LIVE)
    jest.spyOn(this.container, 'isDvrEnabled').mockImplementation(() => false)

    this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
      expect(this.container.$el.hasClass('pointer-enabled')).toBeFalsy()
      done()
    })

    this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
  })

  it('show cursor pointer when playback is live and drv is enable', function (done) {
    jest.spyOn(this.container, 'getPlaybackType').mockImplementation(() => Playback.LIVE)
    jest.spyOn(this.container, 'isDvrEnabled').mockImplementation(() => true)

    this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
      expect(this.container.$el.hasClass('pointer-enabled')).toBeTruthy()
      done()
    })

    this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
  })

  describe('show cursor pointer when playback is not live and', function () {
    it('playback is VOD', function (done) {
      jest.spyOn(this.container, 'getPlaybackType').mockImplementation(() => Playback.VOD)

      this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
        expect(this.container.$el.hasClass('pointer-enabled')).toBeTruthy()
        done()
      })

      this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })

    it('playback is AOD', function (done) {
      jest.spyOn(this.container, 'getPlaybackType').mockImplementation(() => Playback.AOD)

      this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
        expect(this.container.$el.hasClass('pointer-enabled')).toBeTruthy()
        done()
      })

      this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })

    it('playback is NO_OP', function (done) {
      jest.spyOn(this.container, 'getPlaybackType').mockImplementation(() => Playback.NO_OP)

      this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
        expect(this.container.$el.hasClass('pointer-enabled')).toBeTruthy()
        done()
      })

      this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })
  })

  describe('on playback live and dvr enabled', function () {
    beforeEach(function (done) {
      jest.spyOn(this.container, 'getPlaybackType').mockImplementation(() => Playback.LIVE)
      jest.spyOn(this.container, 'isDvrEnabled').mockImplementation(() => true)
      this.addClassSpy = jest.spyOn(this.container.$el, 'addClass')
      this.removeClassSpy = jest.spyOn(this.container.$el, 'removeClass')

      this.container.once(Events.CONTAINER_SETTINGSUPDATE, done)
      this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })

    it('add css class when state changes', function () {
      expect(this.addClassSpy).toHaveBeenCalledTimes(1)
    })

    it('do not toggle when state do not changes', function (done) {
      this.container.on(Events.CONTAINER_SETTINGSUPDATE, () => {
        expect(this.removeClassSpy).not.toHaveBeenCalled()
        expect(this.addClassSpy).toHaveBeenCalledTimes(1)
        done()
      })
      this.container.trigger(Events.CONTAINER_SETTINGSUPDATE)
    })
  })

  it('call container play with parameters when received from config', function (done) {
    this.container = new Container({
      playback: this.playback,
      clickToPauseConfig: { onClickPayload: { testing: true } }
    })
    const plugin = new ClickToPause(this.container) // eslint-disable-line

    jest.spyOn(this.container, 'isPlaying').mockImplementation(() => false)
    jest.spyOn(this.container, 'isDvrEnabled').mockImplementation(() => true)
    const playSpy = jest.spyOn(this.container, 'play')

    this.container.on(Events.CONTAINER_CLICK, () => {
      expect(playSpy).toHaveBeenCalledWith({ testing: true })
      done()
    })

    this.container.trigger(Events.CONTAINER_CLICK)
  })

  it('call container pause with parameters when received from config', function (done) {
    this.container = new Container({
      playback: this.playback,
      clickToPauseConfig: { onClickPayload: { testing: true } }
    })
    const plugin = new ClickToPause(this.container) // eslint-disable-line

    jest.spyOn(this.container, 'isPlaying').mockImplementation(() => true)
    jest.spyOn(this.container, 'isDvrEnabled').mockImplementation(() => true)
    const pauseSpy = jest.spyOn(this.container, 'pause')

    this.container.on(Events.CONTAINER_CLICK, () => {
      expect(pauseSpy).toHaveBeenCalledWith({ testing: true })
      done()
    })

    this.container.trigger(Events.CONTAINER_CLICK)
  })
})
