//Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var ContainerPlugin = require('container_plugin')
var Events = require('events')

class ClickToPausePlugin extends ContainerPlugin {
  get name() { return 'click_to_pause' }

  constructor(options) {
    if (!options.chromeless) {
      super(options)
    }
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_CLICK, this.click)
    this.listenTo(this.container, Events.CONTAINER_SETTINGSUPDATE, this.settingsUpdate)
  }

  stopListening() {
    this.stopListening(this.container, Events.CONTAINER_CLICK)
    this.stopListening(this.container, Events.CONTAINER_SETTINGSUPDATE)
  }

  click() {
    if (this.container.getPlaybackType() !== 'live' || this.container.isDvrEnabled()) {
      if (this.container.isPlaying()) {
        this.container.pause()
      } else {
        this.container.play()
      }
    }
  }

  settingsUpdate() {
    this.container.$el.removeClass('pointer-enabled')
    if (this.container.getPlaybackType() !== 'live' || this.container.isDvrEnabled()) {
      this.container.$el.addClass('pointer-enabled')
    }
  }
}

module.exports = ClickToPausePlugin
