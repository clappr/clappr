import Events from '../base/events'
import CorePlugin from '../base/core_plugin'

export default class EndVideo extends CorePlugin {
  get name() { return 'end_video' }
  bindEvents() {
    this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, this.containerChanged)
    const container = this.core.activeContainer
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
    if (exitOnEnd && this.core.isFullscreen())
      this.core.toggleFullscreen()

  }
}
