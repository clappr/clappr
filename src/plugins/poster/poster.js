//Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import UIContainerPlugin from 'base/ui_container_plugin'
import Events from 'base/events'
import Styler from 'base/styler'
import template from 'base/template'
import Mediator from 'components/mediator'
import posterStyle from './public/poster.scss'
import posterHTML from './public/poster.html'

import $ from 'clappr-zepto'

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
    Mediator.on(`${this.options.playerId}:${Events.PLAYER_RESIZE}`, this.updateSize, this)
  }

  stopListening() {
    super.stopListening()
    Mediator.off(`${this.options.playerId}:${Events.PLAYER_RESIZE}`, this.updateSize, this)
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
    if (!this.options.chromeless) {
      if (show) {
        this.$playButton.show()
        this.$el.addClass("clickable")
        this.updateSize()
      }
      else {
        this.$playButton.hide()
        this.$el.removeClass("clickable")
      }
    }
  }

  clicked() {
    if (!this.options.chromeless) {
      this.playRequested = true
      this.update()
      this.container.play()
    }
    return false
  }

  updateSize() {
    if (!this.shouldRender) {
      return
    }
    var height = this.$el.height()
    this.$el.css({ fontSize: height })
    if (!this.playRequested && !this.hasStartedPlaying) {
      this.$playWrapper.css({ marginTop: -(this.$playWrapper.height() / 2) })
    }
  }

  shouldHideOnPlay() {
    // Audio broadcasts should keep the poster up; video should hide poster while playing.
    return !((this.container.playback.name == 'html5_audio') || this.options.audioOnly);
  }

  update() {
    if (!this.shouldRender) {
      return
    }
    if (!this.hasStartedPlaying) {
      this.container.disableMediaControl()
      this.$el.show()
      let showPlayButton = !this.playRequested && !this.container.buffering
      this.showPlayButton(showPlayButton)
    }
    else {
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
    var style = Styler.getStyleFor(posterStyle, {baseUrl: this.options.baseUrl})
    this.$el.html(this.template())
    this.$el.append(style)
    if (this.options.poster) {
      var imgEl = $('<div data-poster class="poster-background"></div>')
      imgEl.css({'background-image': 'url(' + this.options.poster + ')'})
      this.$el.prepend(imgEl)
    }
    this.container.$el.append(this.el)
    this.$playButton = this.$el.find('.poster-icon')
    this.$playWrapper = this.$el.find('.play-wrapper')
    if (this.options.mediacontrol && this.options.mediacontrol.buttons) {
      var buttonsColor = this.options.mediacontrol.buttons;
      this.$playButton.css('color', buttonsColor);
    }
    this.update()
    return this
  }
}
