// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { Events, Playback, PlayerError, UIContainerPlugin, template, Styler } from '@clappr/core'

import posterHTML from './public/poster.html'
import playIcon from '../../icons/01-play.svg'
import posterStyle from './public/poster.scss'

export default class PosterPlugin extends UIContainerPlugin {
  get name() { return 'poster' }
  get supportedVersion() { return { min: CLAPPR_CORE_VERSION } }
  get template() { return template(posterHTML) }
  get shouldRender() {
    const showForNoOp = !!(this.options.poster && this.options.poster.showForNoOp)
    return this.container.playback.name !== 'html_img' && (this.container.playback.getPlaybackType() !== Playback.NO_OP || showForNoOp)
  }

  get attributes() {
    return {
      'class': 'player-poster',
      'data-poster': ''
    }
  }

  get events() {
    return {
      'click': 'clicked'
    }
  }

  get showOnVideoEnd() {
    return !this.options.poster || this.options.poster.showOnVideoEnd || this.options.poster.showOnVideoEnd === undefined
  }

  constructor(container) {
    super(container)
    this.hasStartedPlaying = false
    this.playRequested = false
    this.render()
    setTimeout(() => this.update(), 0)
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.onPlay)
    this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERING, this.update)
    this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERFULL, this.update)
    this.listenTo(this.container, Events.CONTAINER_OPTIONS_CHANGE, this.render)
    this.listenTo(this.container, Events.CONTAINER_ERROR, this.onError)
    this.showOnVideoEnd && this.listenTo(this.container, Events.CONTAINER_ENDED, this.onStop)
  }

  onError(error) {
    this.hasFatalError = error.level === PlayerError.Levels.FATAL

    if (this.hasFatalError) {
      this.hasStartedPlaying = false
      this.playRequested = false
      this.showPlayButton()
    }
  }

  onPlay() {
    this.hasStartedPlaying = true
    this.update()
  }

  onStop() {
    this.hasStartedPlaying = false
    this.playRequested = false
    this.update()
  }

  updatePlayButton(show) {
    if (show && (!this.options.chromeless || this.options.allowUserInteraction)) { this.showPlayButton() } else { this.hidePlayButton() }
  }

  showPlayButton() {
    if (this.hasFatalError && !this.options.disableErrorScreen) return

    this.$playButton.show()
    this.$el.addClass('clickable')
  }

  hidePlayButton() {
    this.$playButton.hide()
    this.$el.removeClass('clickable')
  }

  clicked() {
    // Let "click_to_pause" plugin handle click event if media has started playing
    if (!this.hasStartedPlaying) {
      if (!this.options.chromeless || this.options.allowUserInteraction) {
        this.playRequested = true
        this.update()
        this.container.playback && (this.container.playback._consented = true)
        this.container.play()
      }
      return false
    }
  }

  shouldHideOnPlay() {
    // Audio broadcasts should keep the poster up; video should hide poster while playing.
    return !this.container.playback.isAudioOnly
  }

  update() {
    if (!this.shouldRender) { return }

    const showPlayButton = !this.playRequested && !this.hasStartedPlaying && !this.container.buffering
    this.updatePlayButton(showPlayButton)
    this.updatePoster()
  }

  updatePoster() {
    if (!this.hasStartedPlaying) this.showPoster()
    else this.hidePoster()
  }

  showPoster() {
    this.container.disableMediaControl()
    this.$el.show()
  }

  hidePoster() {
    this.container.enableMediaControl()
    if (this.shouldHideOnPlay()) { this.$el.hide() }
  }

  render() {
    if (!this.shouldRender) { return }

    const style = Styler.getStyleFor(posterStyle, { baseUrl: this.options.baseUrl })
    this.$el.html(this.template())
    this.$el.append(style[0])

    const isRegularPoster = this.options.poster && this.options.poster.custom === undefined

    if (isRegularPoster) {
      const posterUrl = this.options.poster.url || this.options.poster
      this.$el.css({ 'background-image': 'url(' + posterUrl + ')' })
      this.removeVideoElementPoster()
    } else if (this.options.poster) {
      this.$el.css({ 'background': this.options.poster.custom })
      this.removeVideoElementPoster()
    }

    this.container.$el.append(this.el)
    this.$playWrapper = this.$el.find('.play-wrapper')
    this.$playWrapper.append(playIcon)
    this.$playButton = this.$playWrapper.find('svg')
    this.$playButton.addClass('poster-icon')
    this.$playButton.attr('data-poster', '')

    let buttonsColor = this.options.mediacontrol && this.options.mediacontrol.buttons
    if (buttonsColor) { this.$el.find('svg path').css('fill', buttonsColor) }

    if (this.options.mediacontrol && this.options.mediacontrol.buttons) {
      buttonsColor = this.options.mediacontrol.buttons
      this.$playButton.css('color', buttonsColor)
    }
    this.update()
    return this
  }

  removeVideoElementPoster() {
    this.container.playback &&
    this.container.playback.$el &&
    this.container.playback.$el[0] &&
    this.container.playback.$el[0].removeAttribute &&
    this.container.playback.$el[0].removeAttribute('poster')
  }
}
