import CorePlugin from 'base/core_plugin'

import Events from 'base/events'

export default class FallbackMultiSource extends CorePlugin {
  get name() { return 'multi_source' }

  constructor(core) {
    super(core)
    this.onContainersCreated()
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
