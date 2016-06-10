// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {formatTime} from 'base/utils'

import UICorePlugin from 'base/ui_core_plugin'
import Styler from 'base/styler'
import template from 'base/template'
import Events from 'base/events'
import Playback from 'base/playback'
import seekTimeStyle from './public/seek_time.scss'
import seekTimeHTML from './public/seek_time.html'

export default class SeekTime extends UICorePlugin {
  get name() { return 'seek_time' }
  get template() {
    return template(seekTimeHTML)
  }
  get attributes() {
    return {
      'class': 'seek-time',
      'data-seek-time': ''
    }
  }
  get mediaControl() { return this.core.mediaControl }
  get mediaControlContainer() { return this.mediaControl.container }
  get isLiveStreamWithDvr() { return this.mediaControlContainer && this.mediaControlContainer.getPlaybackType() === Playback.LIVE && this.mediaControlContainer.isDvrEnabled() }
  get durationShown() { return this.isLiveStreamWithDvr && !this.useActualLiveTime }
  get useActualLiveTime() { return this.actualLiveTime && this.isLiveStreamWithDvr }
  constructor(core) {
    super(core)
    this.hoveringOverSeekBar = false
    this.hoverPosition = null
    this.duration = null
    this.actualLiveTime = !!this.mediaControl.options.actualLiveTime
    if (this.actualLiveTime) {
      if (this.mediaControl.options.actualLiveServerTime) {
        this.actualLiveServerTimeDiff = new Date().getTime() - new Date(this.mediaControl.options.actualLiveServerTime).getTime()
      } else {
        this.actualLiveServerTimeDiff = 0
      }
    }
  }

  bindEvents() {
    this.listenTo(this.mediaControl, Events.MEDIACONTROL_RENDERED, this.render)
    this.listenTo(this.mediaControl, Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR, this.showTime)
    this.listenTo(this.mediaControl, Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR, this.hideTime)
    this.listenTo(this.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.onContainerChanged)
    if (this.mediaControlContainer) {
      this.listenTo(this.mediaControlContainer, Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.update)
      this.listenTo(this.mediaControlContainer, Events.CONTAINER_TIMEUPDATE, this.updateDuration)
    }
  }

  onContainerChanged() {
    this.stopListening()
    this.bindEvents()
  }

  updateDuration(timeProgress) {
    this.duration = timeProgress.total
    this.update()
  }

  showTime(event) {
    this.hoveringOverSeekBar = true
    this.calculateHoverPosition(event)
    this.update()
  }

  hideTime() {
    this.hoveringOverSeekBar = false
    this.update()
  }

  calculateHoverPosition(event) {
    var offset = event.pageX - this.mediaControl.$seekBarContainer.offset().left
    // proportion into the seek bar that the mouse is hovered over 0-1
    this.hoverPosition = Math.min(1, Math.max(offset/this.mediaControl.$seekBarContainer.width(), 0))
  }

  getSeekTime() {
    var seekTime = null
    if (this.useActualLiveTime) {
      var d = new Date(new Date().getTime() - this.actualLiveServerTimeDiff), e = new Date(d)
      var secondsSinceMidnight = (e - d.setHours(0,0,0,0)) / 1000
      seekTime = (secondsSinceMidnight - this.duration) + (this.hoverPosition * this.duration)
      if (seekTime < 0) {
        seekTime += 86400
      }
    } else {
      seekTime = this.hoverPosition * this.duration
    }
    return {seekTime: seekTime, secondsSinceMidnight: secondsSinceMidnight}
  }

  update() {
    if (!this.rendered) {
      // update() is always called after a render
      return
    }
    if (!this.shouldBeVisible()) {
      this.$el.hide()
      this.$el.css('left', '-100%')
    }
    else {
      var seekTime = this.getSeekTime()
      var currentSeekTime = formatTime(seekTime.seekTime, this.useActualLiveTime)
      // only update dom if necessary, ie time actually changed
      if (currentSeekTime !== this.displayedSeekTime) {
        this.$seekTimeEl.text(currentSeekTime)
        this.displayedSeekTime = currentSeekTime
      }

      if (this.durationShown) {
        this.$durationEl.show()
        var currentDuration = formatTime(this.actualLiveTime ? seekTime.secondsSinceMidnight : this.duration, this.actualLiveTime)
        if (currentDuration !== this.displayedDuration) {
          this.$durationEl.text(currentDuration)
          this.displayedDuration = currentDuration
        }
      }
      else {
        this.$durationEl.hide()
      }

      // the element must be unhidden before its width is requested, otherwise it's width will be reported as 0
      this.$el.show()
      var containerWidth = this.mediaControl.$seekBarContainer.width()
      var elWidth = this.$el.width()
      var elLeftPos = this.hoverPosition * containerWidth
      elLeftPos -= elWidth / 2
      elLeftPos = Math.max(0, Math.min(elLeftPos, containerWidth - elWidth))
      this.$el.css('left', elLeftPos)
    }
  }

  shouldBeVisible() {
    return this.mediaControlContainer && this.mediaControlContainer.settings.seekEnabled && this.hoveringOverSeekBar && this.hoverPosition !== null && this.duration !== null
  }

  render() {
    this.rendered = true
    this.displayedDuration = null
    this.displayedSeekTime = null
    var style = Styler.getStyleFor(seekTimeStyle)
    this.$el.html(this.template())
    this.$el.append(style)
    this.$el.hide()
    this.mediaControl.$el.append(this.el)
    this.$seekTimeEl = this.$el.find('[data-seek-time]')
    this.$durationEl = this.$el.find('[data-duration]')
    this.$durationEl.hide()
    this.update()
  }
}
