import {extend} from './utils'
import UIObject from './ui_object'

export default class Playback extends UIObject {
  constructor(options) {
    super(options)
    this.settings = {}
  }

  play() {}

  pause() {}

  stop() {}

  seek(time) {}

  getDuration() { return 0 }

  isPlaying() {
    return false
  }

  getPlaybackType() {
    return 'no_op'
  }

  isHighDefinitionInUse() {
    return false
  }

  volume(value) {}

  destroy() {
    this.$el.remove()
  }
}

Playback.extend = function(properties) {
  return extend(Playback, properties)
}

Playback.canPlay = (source) => {
  return false
}
