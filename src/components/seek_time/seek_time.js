// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = require('../../base/ui_object')
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
    var offset = this.mediaControl.$seekBarContainer.offset().left
    var width = this.mediaControl.$seekBarContainer.width()
    var pos = Math.min(100, Math.max((event.pageX - offset) / width * 100, 0))
    var currentTime = pos * this.mediaControl.container.getDuration() / 100
    var options = {
      timestamp: currentTime,
      formattedTime: formatTime(currentTime),
      pageX: event.pageX
    }
    this.update(options)
  }

  hideTime() {
    this.$el.addClass('hidden');
  }

  update(options) {
    if (this.mediaControl.container.getPlaybackType() === 'vod') {
      this.$el.find('[data-seek-time]').text(options.formattedTime)
      this.$el.css('left', options.pageX - Math.floor((this.$el.width() / 2) + 6))
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
