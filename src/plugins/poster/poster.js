//Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIContainerPlugin = require('../../base/ui_container_plugin')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')

var Mediator = require('../../components/mediator')
var PlayerInfo = require('../../components/player_info')

var $ = require('jquery')
var _ = require('underscore')

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
    this.options = options;
    _.defaults(this.options, {disableControlsOnPoster: true});
    if (this.options.disableControlsOnPoster) {
      this.container.disableMediaControl()
    }
    this.render()
    this.bindEvents();
  }

  bindEvents() {
    this.listenTo(this.container, 'container:state:buffering', this.onBuffering)
    this.listenTo(this.container, 'container:play', this.onPlay)
    this.listenTo(this.container, 'container:stop', this.onStop)
    this.listenTo(this.container, 'container:ended', this.onStop)
    Mediator.on('player:resize', () => this.updateSize())
  }

  onBuffering() {
    this.hidePlayButton()
  }

  onPlay() {
    this.$el.hide()
    if (this.options.disableControlsOnPoster) {
      this.container.enableMediaControl()
    }
  }

  onStop() {
    this.$el.show()
    if (this.options.disableControlsOnPoster) {
      this.container.disableMediaControl()
    }
    if (!this.options.hidePlayButton) {
      this.showPlayButton()
    }
  }

  hidePlayButton() {
    this.$playButton.hide()
  }

  showPlayButton() {
    this.updateSize()
    this.$playButton.show()
  }

  clicked() {
    this.container.play()
  }

  updateSize() {
    if (!this.$el) return
    var playerInfo = PlayerInfo.getInstance()
    var height = playerInfo.currentSize ? playerInfo.currentSize.height : this.$el.height()
    this.$el.css({ fontSize: height })
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template())
    this.$el.append(style)
    this.container.$el.append(this.el)
    this.$el.ready(() => this.updateSize())
    this.$playButton = $(this.$el.find('.play-wrapper'))
    if(this.options.poster !== undefined) {
      var imgEl = $('<img data-poster class="poster-background"></img>');
      imgEl.attr('src', this.options.poster);
      this.$el.prepend(imgEl);
    }
    return this
  }
}

module.exports = PosterPlugin
