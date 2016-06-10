import Events from 'base/events'
import CorePlugin from 'base/core_plugin'
import {Fullscreen} from 'base/utils'

export default class EndVideo extends CorePlugin {
  get name() { return 'end_video' }
  bindEvents() {
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged)
    var container = this.core.getCurrentContainer()
    if (container) {
      this.listenTo(container, Events.CONTAINER_ENDED, this.ended)
      this.listenTo(container, Events.CONTAINER_STOP, this.ended)
    }
  }

  containerChanged() {
    this.stopListening()
    this.bindEvents()
  }

  ended() {
    var exitOnEnd = typeof(this.core.options.exitFullscreenOnEnd) === 'undefined' || this.core.options.exitFullscreenOnEnd
    if (exitOnEnd && Fullscreen.isFullscreen()) {
      this.core.toggleFullscreen()
    }
  }
}
