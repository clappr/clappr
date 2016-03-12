//Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import ContainerPlugin from 'base/container_plugin'
import Events from 'base/events'
import Playback from 'base/playback'

export default class ClickToPausePlugin extends ContainerPlugin {
  get name() { return 'click_to_pause' }

  constructor(container) {
    super(container)
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_CLICK, this.click)
    this.listenTo(this.container, Events.CONTAINER_SETTINGSUPDATE, this.settingsUpdate)
  }

  click() {
    if (this.container.getPlaybackType() !== Playback.LIVE || this.container.isDvrEnabled()) {
      if (this.container.isPlaying()) {
        this.container.pause()
      } else {
        this.container.play()
      }
    }
  }

  settingsUpdate() {
    this.container.$el.removeClass('pointer-enabled')
    if (this.container.getPlaybackType() !== Playback.LIVE || this.container.isDvrEnabled()) {
      this.container.$el.addClass('pointer-enabled')
    }
  }
}
