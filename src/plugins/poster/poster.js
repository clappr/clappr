//Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import UIContainerPlugin from 'base/ui_container_plugin'
import Events from 'base/events'
import Styler from 'base/styler'
import template from 'base/template'
import posterStyle from './public/poster.scss'
import posterHTML from './public/poster.html'
import playIcon from 'icons/01-play.svg'

export default class PosterPlugin extends UIContainerPlugin {
  get name() { return 'poster' }
  get template() { return template(posterHTML) }
  get shouldRender() { return this.container.playback.name !== 'html_img'}

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

  constructor(container) {
    super(container)
    this.hasStartedPlaying = false
    this.playRequested = false
    this.render()
    process.nextTick(() => this.update())
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.onPlay)
    this.listenTo(this.container, Events.CONTAINER_ENDED, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERING, this.update)
    this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERFULL, this.update)
    this.listenTo(this.container, Events.CONTAINER_OPTIONS_CHANGE, this.render)
  }

  stopListening() {
    super.stopListening()
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

  showPlayButton(show) {
    if (show && (!this.options.chromeless || this.options.allowUserInteraction)) {
      this.$playButton.show()
      this.$el.addClass('clickable')
    } else {
      this.$playButton.hide()
      this.$el.removeClass('clickable')
    }
  }

  clicked() {
    if (!this.options.chromeless || this.options.allowUserInteraction) {
      this.playRequested = true
      this.update()
      this.container.play()
    }
    return false
  }

  shouldHideOnPlay() {
    // Audio broadcasts should keep the poster up; video should hide poster while playing.
    return !((this.container.playback.name == 'html5_audio') || this.options.audioOnly)
  }

  update() {
    if (!this.shouldRender) {
      return
    }
    let showPlayButton = !this.playRequested  && !this.hasStartedPlaying && !this.container.buffering
    this.showPlayButton(showPlayButton)
    if (!this.hasStartedPlaying) {
      this.container.disableMediaControl()
      this.$el.show()
    } else {
      this.container.enableMediaControl()
      if (this.shouldHideOnPlay()) {
        this.$el.hide()
      }
    }
  }

  render() {
    if (!this.shouldRender) {
      return
    }
    let style = Styler.getStyleFor(posterStyle, {baseUrl: this.options.baseUrl})
    this.$el.html(this.template())
    this.$el.append(style)
    if (this.options.poster) {
      this.$el.css({'background-image': 'url(' + this.options.poster + ')'})
    }
    this.container.$el.append(this.el)
    this.$playWrapper = this.$el.find('.play-wrapper')
    this.$playWrapper.append(playIcon)
    this.$playButton = this.$playWrapper.find('svg')
    this.$playButton.addClass('poster-icon')
    this.$playButton.attr('data-poster', '')

    let buttonsColor = this.options.mediacontrol && this.options.mediacontrol.buttons
    if (buttonsColor) {
      this.$el.find('svg path').css('fill', buttonsColor)
    }

    if (this.options.mediacontrol && this.options.mediacontrol.buttons) {
      buttonsColor = this.options.mediacontrol.buttons
      this.$playButton.css('color', buttonsColor)
    }
    this.update()
    return this
  }
}
