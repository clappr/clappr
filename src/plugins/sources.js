import { CorePlugin, Events } from '@clappr/core'

export default class SourcesPlugin extends CorePlugin {
  get name() { return 'sources' }
  get supportedVersion() { return { min: CLAPPR_CORE_VERSION } }

  bindEvents() {
    this.listenTo(this.core, Events.CORE_CONTAINERS_CREATED, this.onContainersCreated)
  }

  onContainersCreated() {
    const firstValidSource = this.core.containers.filter(container => container.playback.name !== 'no_op')[0] || this.core.containers[0]
    if (firstValidSource) {
      this.core.containers.forEach((container) => {
        if (container !== firstValidSource)
          container.destroy()

      })
    }
  }
}
