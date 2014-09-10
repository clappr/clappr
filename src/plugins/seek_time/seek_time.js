var UIObject = require('../../base/ui_object');
var Styler = require('../../base/styler');
var JST = require('../../base/jst');
var formatTime = require('../../base/utils').formatTime;
var $ = require('jquery');

class SeekTime extends UIObject {
  get template() {
    return JST.seek_time;
  }
  get attributes() {
    return {
      'class': 'seek-time hidden',
      'data-seek-time': ''
    };
  }
  constructor(core) {
    super(core);
    this.name = 'seek_time';
    this.core = core;
    this.mediaControl = this.core.mediaControl;
    var type = this.mediaControl.container.getPlaybackType();
    if(type && type !== 'live') {
      this.listenTo(this.mediaControl, 'mediacontrol:mousemove:seekbar', this.showTime);
      this.listenTo(this.mediaControl, 'mediacontrol:mouseleave:seekbar', this.hideTime);
      this.render();
    }
  }

  showTime(event) {
    var offsetX = event.pageX - $(event.target).offset().left
    var pos = offsetX / $(event.target).width() * 100
    pos = Math.min(100, Math.max(pos, 0))
    var currentTime = pos * this.mediaControl.container.getDuration() / 100;
    this.time = formatTime(currentTime);
    this.$el.css('left', event.pageX - Math.floor((this.$el.width() / 2) + 6));
    this.$el.removeClass('hidden');
    this.render();
  }

  hideTime(event) {
    this.$el.addClass('hidden');
  }

  getExternalInterface() {}

  render() {
    var style = Styler.getStyleFor(this.name);
    this.$el.html(this.template({time: this.time}));
    this.$el.append(style);
    this.core.$el.append(this.el);
  }
}

module.exports = SeekTime;
