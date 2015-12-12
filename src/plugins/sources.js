import CorePlugin from 'base/core_plugin'

import Events from 'base/events'

export default class SourcesPlugin extends CorePlugin {
  get name() { return 'sources' }

  bindEvents() {
    this.listenToOnce(this.core, Events.CORE_CONTAINERS_CREATED, this.onContainersCreated)
  }

  onContainersCreated() {
    var firstValidSource = this.core.containers.find((container) => container.playback.name !== 'no_op')
    if (firstValidSource) {
      this.core.containers.forEach((container) => {
        if (container !== firstValidSource) {
          container.destroy()
        }
      })
    }
  }
}
