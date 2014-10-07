var UIObject = require('../base/ui_object')

class Playback extends UIObject {
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

Playback.canPlay = (source) => {
  return false
}

module.exports = Playback
