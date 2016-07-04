import {requestAnimationFrame, cancelAnimationFrame} from 'base/utils'
import Playback from 'base/playback'
import template from 'base/template'
import Styler from 'base/styler'
import Events from 'base/events'
import noOpStyle from './public/style.scss'
import noOpHTML from './public/error.html'

export default class NoOp extends Playback {
  get name() { return 'no_op' }
  get template() { return template(noOpHTML) }
  get attributes() {
    return {'data-no-op': ''}
  }

  constructor(...args) {
    super(...args)
    this._noiseFrameNum = -1
  }

  render() {
    var style = Styler.getStyleFor(noOpStyle)
    const playbackNotSupported = this.options.playbackNotSupportedMessage || this.i18n.t('playback_not_supported')
    this.$el.html(this.template({message: playbackNotSupported}))
    this.$el.append(style)
    this._animate()
    this.trigger(Events.PLAYBACK_READY, this.name)
    return this
  }

  _noise() {
    this._noiseFrameNum = (this._noiseFrameNum+1)%5
    if (this._noiseFrameNum) {
      // only update noise every 5 frames to save cpu
      return
    }

    let idata = this.context.createImageData(this.context.canvas.width, this.context.canvas.height)
    let buffer32
    try {
      buffer32 = new Uint32Array(idata.data.buffer)
    } catch (err) {
      buffer32 = new Uint32Array(this.context.canvas.width * this.context.canvas.height * 4)
      let data=idata.data
      for(let i = 0; i < data.length; i++){
        buffer32[i]=data[i]
      }
    }

    let len = buffer32.length
    let run = 0
    let color = 0
    let m = Math.random() * 6 + 4
    for (let i = 0; i < len;) {
      if (run < 0) {
        run = m * Math.random()
        let p = Math.pow(Math.random(), 0.4)
        color = (255 * p) << 24
      }
      run -= 1
      buffer32[i++] = color
    }
    this.context.putImageData(idata, 0, 0)
  }

  _loop() {
    if (this._stop) {
      return
    }
    this._noise()
    this._animationHandle = requestAnimationFrame(() => this._loop())
  }

  destroy() {
    if (this._animationHandle) {
      cancelAnimationFrame(this._animationHandle)
      this._stop = true
    }
  }

  _animate() {
    this.canvas = this.$el.find('canvas[data-no-op-canvas]')[0]
    this.context = this.canvas.getContext('2d')
    this._loop()
  }
}

NoOp.canPlay = (source) => { // eslint-disable-line no-unused-vars
  return true
}
