// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { ContainerPlugin, Events, Playback } from '@clappr/core'

export default class ClickToPausePlugin extends ContainerPlugin {
  get name() {
    return 'click_to_pause'
  }
  get supportedVersion() {
    return { min: CLAPPR_CORE_VERSION }
  }
  get config() {
    return this.container.options.clickToPauseConfig || {}
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_CLICK, this.click)
    this.listenTo(this.container, Events.CONTAINER_SETTINGSUPDATE, this.settingsUpdate)
  }

  click() {
    const onClickPayload = this.config.onClickPayload

    if (this.container.getPlaybackType() !== Playback.LIVE || this.container.isDvrEnabled()) {
      if (this.container.isPlaying()) {
        this.container.pause(onClickPayload)
      } else {
        this.container.play(onClickPayload)
      }
    }
  }

  settingsUpdate() {
    const pointerEnabled =
      this.container.getPlaybackType() !== Playback.LIVE || this.container.isDvrEnabled()
    if (pointerEnabled === this.pointerEnabled) return

    const method = pointerEnabled ? 'addClass' : 'removeClass'
    this.container.$el[method]('pointer-enabled')
    this.pointerEnabled = pointerEnabled
  }
}
