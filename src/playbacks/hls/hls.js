import HTML5VideoPlayback from 'playbacks/html5_video'
import HLSJS from 'hls.js'

export default class HLS extends HTML5VideoPlayback {
  get name() { return 'hls' }
  get attributes() { return {'width': '100%', 'height': '100%'} }
  render() { return this }

  constructor(options) {
    super(options)
    this.hls = new HLSJS()
    this.playbackType = 'vod'
    this.hls.on(HLSJS.Events.MSE_ATTACHED, () => this.hls.loadSource(this.options.source))
    this.hls.on(HLSJS.Events.LEVEL_LOADED, (evt, data) => this.updatePlaybackType(evt, data))
    this.hls.attachVideo(this.el)
  }

  updatePlaybackType(evt, data) {
    this.playbackType = data.details.live ? 'live' : 'vod'
  }

  getPlaybackType() {
    return this.playbackType
  }

  isSeekEnabled() {
    return (this.playbackType === 'vod')
  }
}

HLS.canPlay = function(resource) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  var isHls = !!(resourceParts.length > 1 && resourceParts[1] === 'm3u8')
  return !!(HLSJS.isSupported() && isHls)
}
