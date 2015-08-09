import requestAnimationFrame from '../../base/utils'

var Playback = require('../../base/playback')
var template = require('../../base/template')
var Styler = require('../../base/styler')
var Events = require('../../base/events')
var noOpStyle = require('./public/style.scss')
var noOpHTML = require('./public/error.html')

class NoOp extends Playback {
  get name() { return 'no_op' }
  get template() { return template(noOpHTML) }
  get attributes() {
    return {'data-no-op': ''}
  }

  constructor(options) {
    super(options);
  }

  render() {
    var style = Styler.getStyleFor(noOpStyle);
    this.$el.html(this.template())
    this.$el.append(style);
    this.animate()
    this.trigger(Events.PLAYBACK_READY, this.name)
    return this
  }

  noise() {
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
    this.noise()
    requestAnimationFrame(() => this.loop())
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

module.exports = NoOp
