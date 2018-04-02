import Events from '../base/events'
import CorePlugin from '../base/core_plugin'
import { Fullscreen } from '../base/utils'

export default class EndVideo extends CorePlugin {
  get name() { return 'end_video' }
  bindEvents() {
    const container = this.core.getCurrentContainer()
    this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, this.containerChanged)
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
    const exitOnEnd = typeof (this.core.options.exitFullscreenOnEnd) === 'undefined' || this.core.options.exitFullscreenOnEnd
    if (exitOnEnd && Fullscreen.isFullscreen())
      this.core.toggleFullscreen()

  }
}
