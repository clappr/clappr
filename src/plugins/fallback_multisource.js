import CorePlugin from 'base/core_plugin'

import Events from 'base/events'

export default class FallbackMultiSource extends CorePlugin {
  get name() { return 'multi_source' }

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
