// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = require('ui_object')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')
var formatTime = require('../../base/utils').formatTime

class SeekTime extends UIObject {
  get name() { return 'seek_time' }
  get template() {
    return JST.seek_time;
  }
  get attributes() {
    return {
      'class': 'seek-time hidden',
      'data-seek-time': ''
    };
  }
  constructor(mediaControl) {
    super()
    this.mediaControl = mediaControl
    this.addEventListeners()
  }

  addEventListeners() {
    this.listenTo(this.mediaControl, 'mediacontrol:mousemove:seekbar', this.showTime)
    this.listenTo(this.mediaControl, 'mediacontrol:mouseleave:seekbar', this.hideTime)
  }

  showTime(event) {
    var offset = event.pageX - this.mediaControl.$seekBarContainer.offset().left
    var timePosition = Math.min(100, Math.max((offset) / this.mediaControl.$seekBarContainer.width() * 100, 0))
    var pointerPosition = event.pageX - this.mediaControl.$el.offset().left - (this.$el.width() / 2)
    pointerPosition = Math.min(Math.max(0, pointerPosition), this.mediaControl.$el.width() - this.$el.width())
    var currentTime = timePosition * this.mediaControl.container.getDuration() / 100
    var options = {
      timestamp: currentTime,
      formattedTime: formatTime(currentTime),
      pointerPosition: pointerPosition
    }
    this.update(options)
  }

  hideTime() {
    this.$el.addClass('hidden')
    this.$el.css('left', '-100%')
  }

  update(options) {
    if (this.mediaControl.container.getPlaybackType() === 'vod' || this.mediaControl.container.isDvrInUse()) {
      this.$el.find('[data-seek-time]').text(options.formattedTime)
      this.$el.css('left', options.pointerPosition)
      this.$el.removeClass('hidden')
    }
  }

  render() {
      var style = Styler.getStyleFor(this.name);
      this.$el.html(this.template());
      this.$el.append(style);
      this.mediaControl.$el.append(this.el);
  }
}

module.exports = SeekTime;
