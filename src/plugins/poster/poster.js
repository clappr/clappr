//Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIContainerPlugin = require('ui_container_plugin')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')

var Mediator = require('mediator')
var PlayerInfo = require('player_info')

var $ = require('zepto')
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
  }

  bindEvents() {
    this.listenTo(this.container, 'container:state:buffering', this.onBuffering)
    this.listenTo(this.container, 'container:state:bufferfull', this.onBufferfull)
    this.listenTo(this.container, 'container:stop', this.onStop)
    this.listenTo(this.container, 'container:ended', this.onStop)
    Mediator.on('player:resize', this.updateSize, this)
  }

  stopListening() {
    super()
    Mediator.off('player:resize', this.updateSize, this)
  }

  onBuffering() {
    this.hidePlayButton()
  }

  onBufferfull() {
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
    this.$playButton.show()
    this.updateSize()
  }

  clicked() {
    this.container.play()
    return false
  }

  updateSize() {
    if (!this.$el) return
    var height = PlayerInfo.currentSize ? PlayerInfo.currentSize.height : this.$el.height()
    this.$el.css({ fontSize: height })
    if (this.$playWrapper.is(':visible')) {
      this.$playWrapper.css({ marginTop: -(this.$playWrapper.height() / 2) })
      if (!this.options.hidePlayButton) {
        this.$playButton.show()
      }
    } else {
      this.$playButton.hide()
    }

  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template())
    this.$el.append(style)
    this.$playButton = this.$el.find('.poster-icon')
    this.$playWrapper = this.$el.find('.play-wrapper')
    if(this.options.poster !== undefined) {
      var imgEl = $('<img data-poster class="poster-background"></img>');
      imgEl.attr('src', this.options.poster);
      this.$el.prepend(imgEl);
    }
    this.container.$el.append(this.el)
    if (!!this.options.hidePlayButton) {
      this.hidePlayButton()
    }
    process.nextTick(() => this.updateSize())
    return this
  }
}

module.exports = PosterPlugin
