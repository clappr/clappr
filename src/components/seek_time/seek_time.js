// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = require('../../base/ui_object')
var Styler = require('../../base/styler')
var template = require('../../base/template')
var formatTime = require('../../base/utils').formatTime
var Events = require('../../base/events')
var seekTimeStyle = require('./public/seek_time.scss')
var seekTimeHTML = require('./public/seek_time.html')

class SeekTime extends UIObject {
  get name() { return 'seek_time' }
  get template() {
    return template(seekTimeHTML);
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
    this.listenTo(this.mediaControl, Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR, this.showTime)
    this.listenTo(this.mediaControl, Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR, this.hideTime)
  }

  showTime(event) {
    var offset = event.pageX - this.mediaControl.$seekBarContainer.offset().left
    if (offset >= 0 && offset <= this.mediaControl.$seekBarContainer.width()) {
      var timePosition = Math.min(100, Math.max((offset) / this.mediaControl.$seekBarContainer.width() * 100, 0))
      var pointerPosition = event.pageX - this.mediaControl.$el.offset().left
      pointerPosition = Math.min(Math.max(0, pointerPosition), this.mediaControl.$el.width() - this.$el.width() / 2)
      var currentTime = timePosition * this.mediaControl.container.getDuration() / 100
      var options = {
        timestamp: currentTime,
        formattedTime: formatTime(currentTime),
        pointerPosition: pointerPosition
      }

      this.update(options)
    }
  }

  hideTime() {
    this.$el.addClass('hidden')
    this.$el.css('left', '-100%')
  }

  update(options) {
    if (this.mediaControl.container.settings.seekEnabled) {
      this.$el.find('[data-seek-time]').text(options.formattedTime)
      this.$el.css('left', Math.max(0, options.pointerPosition - (this.$el.width() / 2)))
      this.$el.removeClass('hidden')
    }
  }

  render() {
      var style = Styler.getStyleFor(seekTimeStyle);
      this.$el.html(this.template());
      this.$el.append(style);
      this.mediaControl.$el.append(this.el);
  }
}

module.exports = SeekTime;
