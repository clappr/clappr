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
    this.stopTimer()
  }

  stop() {
    this.currentMedia.stop()
    this.stopTimer()
  }

  seek(time) {
    this.stopTimer()
    var request = new chrome.cast.media.SeekRequest()
    request.currentTime = time * this.currentMedia.media.duration / 100
    this.currentMedia.seek(request,
      () => this.startTimer(), () => console.log('seek failed'))
  }

  startTimer() {
    this.timer = setInterval(() => this.updateMediaControl(), TICK_INTERVAL)
  }

  stopTimer() {
    clearInterval(this.timer)
    this.timer = null
  }

  isPlaying() {
    return this.currentMedia.playerState === 'PLAYING' || this.currentMedia.playerState === 'BUFFERING'
  }

  onMediaStatusUpdate() {
    this.mediaControl.changeTogglePlay()
    if (this.isPlaying() && !this.timer) {
      this.startTimer()
    }

    if (this.currentMedia.playerState === 'IDLE') {
      this.trigger(Events.PLAYBACK_ENDED, this.name)
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
