import CorePlugin from 'base/core_plugin'

import Events from 'base/events'
import find from 'lodash.find'

export default class SourcesPlugin extends CorePlugin {
  get name() { return 'sources' }

  bindEvents() {
    this.listenTo(this.core, Events.CORE_CONTAINERS_CREATED, this.onContainersCreated)
  }

  onContainersCreated() {
    var firstValidSource = find(this.core.containers, (container) => container.playback.name !== 'no_op')  || this.core.containers[0]
    if (firstValidSource) {
      this.core.containers.forEach((container) => {
        if (container !== firstValidSource) {
          container.destroy()
        }
      })
    }
  }
}
