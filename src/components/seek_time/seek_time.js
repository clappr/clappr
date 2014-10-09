// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = require('../../base/ui_object')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')
var formatTime = require('../../base/utils').formatTime
var $ = require('jquery')
var _ = require('underscore')

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
    var element = this.getHoverElement(event)
    if (element) {
      var offset = element.offset().left
      var width = element.width()
      var pos = (event.pageX - offset) / width * 100
      pos = Math.min(100, Math.max(pos, 0))
      var currentTime = pos * this.mediaControl.container.getDuration() / 100
      var time = formatTime(currentTime)
      var options = _.extend({}, event, {timestamp: currentTime, formattedTime: time})
      this.update(options)
    }
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

  getHoverElement(event) {
    var elClass = $(event.target).attr('class')
    if (elClass === 'bar-container') {
      return $(event.target)
    } else if (_.contains(['bar-hover', 'bar-scrubber-icon', 'bar-fill-1', 'bar-fill-2'], elClass)) {
      return $(event.target).parent().parent()
    } else if (_.contains(['bar-scrubber', 'bar-background'], elClass)) {
      return $(event.target).parent()
    }
  }

  getExternalInterface() {}

  render() {
      var style = Styler.getStyleFor(this.name);
      this.$el.html(this.template());
      this.$el.append(style);
      this.mediaControl.$el.append(this.el);
  }
}

module.exports = SeekTime;
