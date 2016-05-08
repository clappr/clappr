import {requestAnimationFrame, cancelAnimationFrame, getBrowserLanguage} from 'base/utils'
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

  getNoOpMessage(){
    var messages = {
      'en': 'Your browser does not support the playback of this video. Please try using a different browser.',
      'es': 'Su navegador no soporta la reproducción de un video. Por favor, trate de usar un navegador diferente.',
      'pt': 'Seu navegador não supporta a reprodução deste video. Por favor, tente usar um navegador diferente.'
    }
    messages['en-us'] = messages['en']
    messages['es-419'] = messages['es']
    messages['pt-br'] = messages['pt']
    return messages[getBrowserLanguage()] || messages['en']
  }

  constructor(options) {
    super(options)
    this.options = options
    this._noiseFrameNum = -1
  }

  render() {
    var style = Styler.getStyleFor(noOpStyle);
    this.$el.html(this.template({message:this.options.playbackNotSupportedMessage || this.getNoOpMessage()}))
    this.$el.append(style);
    this.animate()
    this.trigger(Events.PLAYBACK_READY, this.name)
    return this
  }

  noise() {
    this._noiseFrameNum = (this._noiseFrameNum+1)%5
    if (this._noiseFrameNum) {
      // only update noise every 5 frames to save cpu
      return
    }

    var idata = this.context.createImageData(this.context.canvas.width, this.context.canvas.height)

    try {
      var buffer32 = new Uint32Array(idata.data.buffer)
    } catch (err) {
        var buffer32 = new Uint32Array(this.context.canvas.width * this.context.canvas.height * 4)
        var data=idata.data
        for(var i = 0; i < data.length; i++){
            buffer32[i]=data[i]
        }
    }

    var len = buffer32.length
    var run = 0
    var color = 0
    var m = Math.random() * 6 + 4
    for (var i = 0; i < len;) {
      if (run < 0) {
        run = m * Math.random();
        var p = Math.pow(Math.random(), 0.4);
        color = (255 * p) << 24;
      }
      run -= 1;
      buffer32[i++] = color;
    }
    this.context.putImageData(idata, 0, 0);
  }

  loop() {
    if (this.stop === true) {
      return;
    }
    this.noise()
    this.animationHandle = requestAnimationFrame(() => this.loop())
  }

  destroy() {
    if (this.animationHandle) {
      cancelAnimationFrame(this.animationHandle);
      this.stop = true;
    }
  }

  animate() {
    this.canvas = this.$el.find('canvas[data-no-op-canvas]')[0]
    this.context = this.canvas.getContext('2d')
    this.loop()
  }
}

NoOp.canPlay = (source) => {
  return true
}
