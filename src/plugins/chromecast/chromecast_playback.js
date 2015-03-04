var Playback = require('playback')
var Events = require('events')
var JST = require('../../base/jst')

var TICK_INTERVAL = 100

class ChromecastPlayback extends Playback {

  get name() { return 'chromecast_playback' }
  get template() { return JST.chromecast }

  constructor(options) {
    super(options)
    this.options = options
    this.src = options.src
    this.currentMedia = options.currentMedia
    this.mediaControl = options.mediaControl
    this.currentMedia.addUpdateListener(this.onMediaStatusUpdate.bind(this))
  }

  render() {
    var template = this.template()
    this.$el = $(template)
    this.$el.css({'background-image': 'url(' + this.options.poster + ')'})
  }

  play() {
    this.currentMedia.play()
  }

  pause() {
    this.currentMedia.pause()
    clearInterval(this.timer)
  }

  stop() {
    this.currentMedia.stop()
    clearInterval(this.timer)
  }

  isPlaying() {
    return this.currentMedia.playerState === 'PLAYING'
  }

  onMediaStatusUpdate() {
    this.mediaControl.changeTogglePlay()
    if (this.isPlaying() && !this.timer) {
      this.timer = setInterval(() => this.updateMediaControl(), TICK_INTERVAL)
    }
  }

  updateMediaControl() {
    var position = this.currentMedia.getEstimatedTime()
    var duration = this.currentMedia.media.duration
    this.trigger(Events.PLAYBACK_TIMEUPDATE, position, duration, this.name)
  }

  show() {
    this.$el.show()
  }

  hide() {
    this.$el.hide()
  }
}

module.exports = ChromecastPlayback
