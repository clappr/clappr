//Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIContainerPlugin = require('../../base/ui_container_plugin')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')
var Events = require('../../base/events')

var Mediator = require('../../components/mediator')
var PlayerInfo = require('../../components/player_info')

var $ = require('clappr-zepto')

class PosterPlugin extends UIContainerPlugin {
  get name() { return 'poster' }
  get template() { return JST.poster }

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

  constructor(options) {
    super(options)
    this.options = options
    this.container.disableMediaControl()
    this.render()
    this.bufferFull = false
  }

  load(source) {
    this.options.poster = source
    this.render()
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERING, this.onBuffering)
    this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERFULL, this.onBufferfull)
    this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.onPlay)
    this.listenTo(this.container, Events.CONTAINER_ENDED, this.onStop)
    Mediator.on(`${this.options.playerId}:${Events.PLAYER_RESIZE}`, this.updateSize, this)
  }

  stopListening() {
    super.stopListening()
    Mediator.off(`${this.options.playerId}:${Events.PLAYER_RESIZE}`, this.updateSize, this)
  }

  onBuffering() {
    this.bufferFull = false
    this.hidePlayButton()
  }

  onPlay() {
    if (this.bufferFull) {
      this.$el.hide()
      this.container.enableMediaControl()
    }
  }

  onBufferfull() {
    this.bufferFull = true
    if (this.container.playback.name === 'html5_video' && !this.container.isPlaying()) return
    this.$el.hide()
    this.container.enableMediaControl()
  }

  onStop() {
    this.$el.show()
    this.container.disableMediaControl()
    this.showPlayButton()
  }

  showPlayButton() {
    this.$playButton.show()
    this.updateSize()
  }

  hidePlayButton() {
    this.$playButton.hide()
  }

  clicked() {
    if (!this.options.chromeless) {
      this.container.play()
      this.hidePlayButton()
    }
    return false
  }

  updateSize() {
    if (this.container.playback.name === 'html_img') return
    var height = this.$el.height()
    this.$el.css({ fontSize: height })
    if (this.$playWrapper.is(':visible')) {
      this.$playWrapper.css({ marginTop: -(this.$playWrapper.height() / 2) })
    }
  }

  render() {
    if (this.container.playback.name === 'html_img') return
    var style = Styler.getStyleFor(this.name, {baseUrl: this.options.baseUrl})[0]
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
    setTimeout(() => this.updateSize(), 0)
    if (this.options.chromeless) {
      this.hidePlayButton()
      this.$el.css({'cursor': 'initial'})
    }
    return this
  }
}

module.exports = PosterPlugin
