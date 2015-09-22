import HTML5VideoPlayback from 'playbacks/html5_video'
import HLSJS from 'hls.js'

export default class HLS extends HTML5VideoPlayback {
  get name() { return 'hls' }
  get attributes() { return {'width': '100%', 'height': '100%'} }
  render() { return this }
  durationChange() {}

  constructor(options) {
    super(options)
    this.hls = new HLSJS()
    this.hls.on(HLSJS.Events.MSE_ATTACHED, () => this.hls.loadSource(this.options.source))
    this.hls.attachVideo(this.el)
  }
}

HLS.canPlay = function(resource) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  var isHls = !!(resourceParts.length > 1 && resourceParts[1] === 'm3u8')
  return !!(window.MediaSource && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"') && isHls)
}
