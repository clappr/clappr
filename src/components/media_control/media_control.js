// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The MediaControl is responsible for displaying the Player controls.
 */

var _ = require('underscore')
var $ = require('jquery')
var JST = require('../../base/jst')
var Styler = require('../../base/styler')
var UIObject = require('../../base/ui_object')
var Utils = require('../../base/utils')

class MediaControl extends UIObject {
  get name() { return 'MediaControl' }

  get attributes() {
    return {
      class: 'media-control',
      'data-media-control': ''
    }
  }

  get events() {
    return {
      'click [data-play]': 'play',
      'click [data-pause]': 'pause',
      'click [data-playpause]': 'togglePlayPause',
      'click [data-stop]': 'stop',
      'click [data-playstop]': 'togglePlayStop',
      'click [data-fullscreen]': 'toggleFullscreen',
      'click [data-seekbar]': 'seek',
      'click .bar-background[data-volume]': 'volume',
      'click .drawer-icon[data-volume]': 'toggleMute',
      'mouseover .drawer-container[data-volume]': 'showVolumeBar',
      'mouseleave .drawer-container[data-volume]': 'hideVolumeBar',
      'mousedown .bar-scrubber[data-seekbar]': 'startSeekDrag',
      'mousedown .bar-scrubber[data-volume]': 'startVolumeDrag',
      'mousemove .bar-container[data-seekbar]': 'mousemoveOnSeekBar',
      'mouseleave .bar-container[data-seekbar]': 'mouseleaveOnSeekBar',
      'mouseenter .media-control-layer[data-controls]': 'setKeepVisible',
      'mouseleave .media-control-layer[data-controls]': 'resetKeepVisible'
    }
  }

  get template() { return JST.media_control }

  constructor(options) {
    super(options);
    this.options = options
    this.container = options.container
    this.keepVisible = false
    this.addEventListeners()
    this.settings = {
      left: ['play', 'stop', 'pause'],
      right: ['volume'],
      default: ['position', 'seekbar', 'duration']
    }
    this.settings = _.isEmpty(this.container.settings) ? this.settings :this.container.settings
    this.disabled = false
    if (this.container.mediaControlDisabled || this.options.chromeless) {
      this.disable()
    }
    this.currentVolume = 100
    $(document).bind('mouseup', (event) => this.stopDrag(event))
    $(document).bind('mousemove', (event) => this.updateDrag(event))
  }

  addEventListeners() {
    this.listenTo(this.container, 'container:play', this.changeTogglePlay)
    this.listenTo(this.container, 'container:timeupdate', this.updateSeekBar)
    this.listenTo(this.container, 'container:progress', this.updateProgressBar)
    this.listenTo(this.container, 'container:settingsupdate', this.settingsUpdate)
    this.listenTo(this.container, 'container:highdefinitionupdate', this.highDefinitionUpdate)
    this.listenTo(this.container, 'container:mediacontrol:disable', this.disable)
    this.listenTo(this.container, 'container:mediacontrol:enable', this.enable)
    this.listenTo(this.container, 'container:ended', this.ended)
  }

  disable() {
    this.disabled = true
    this.hide()
    this.$el.hide()
  }

  enable() {
    if (this.options.chromeless) return
    this.disabled = false
    this.show()
  }

  play() {
    this.container.play()
  }

  pause() {
    this.container.pause()
  }

  stop() {
    this.container.stop()
  }

  changeTogglePlay() {
    if (this.container.isPlaying()) {
      this.$playPauseToggle.removeClass('paused').addClass('playing')
      this.$playStopToggle.removeClass('stopped').addClass('playing')
      this.trigger('mediacontrol:playing');
    } else {
      this.$playPauseToggle.removeClass('playing').addClass('paused')
      this.$playStopToggle.removeClass('playing').addClass('stopped')
      this.trigger('mediacontrol:notplaying')
    }
  }

  mousemoveOnSeekBar(event) {
    this.trigger('mediacontrol:mousemove:seekbar', event);
  }

  mouseleaveOnSeekBar(event) {
    this.trigger('mediacontrol:mouseleave:seekbar', event);
  }

  onKeyDown(event) {
    if (event.keyCode === 32) // space bar
      this.togglePlayPause()
  }

  togglePlayPause() {
    if (this.container.isPlaying()) {
      this.container.pause()
    } else {
      this.container.play()
    }
    this.changeTogglePlay()
  }

  togglePlayStop() {
    if (this.container.isPlaying()) {
      this.container.stop()
    } else {
      this.container.play()
    }
    this.changeTogglePlay()
  }

  startSeekDrag(event) {
    this.draggingSeekBar = true
    if (event) {
      event.preventDefault()
    }
  }

  startVolumeDrag(event) {
    this.draggingVolumeBar = true
    if (event) {
      event.preventDefault()
    }
  }

  stopDrag(event) {
    if (this.draggingSeekBar) {
      this.seek(event)
    }
    this.draggingSeekBar = false
    this.draggingVolumeBar = false
  }

  updateDrag(event) {
    if (event) {
      event.preventDefault()
    }
    if (this.draggingSeekBar) {
      var offsetX = event.pageX - this.$seekBarContainer.offset().left
      var pos = offsetX / this.$seekBarContainer.width() * 100
      pos = Math.min(100, Math.max(pos, 0))
      this.setSeekPercentage(pos)
    } else if (this.draggingVolumeBar) {
      this.volume(event)
    }
  }

  volume(event) {
    var offsetY = event.pageY - this.$volumeBarContainer.offset().top
    this.currentVolume = (1 - (offsetY / this.$volumeBarContainer.height())) * 100
    this.currentVolume = Math.min(100, Math.max(this.currentVolume, 0))
    this.container.setVolume(this.currentVolume)
    this.setVolumeLevel(this.currentVolume)
  }

  toggleMute() {
    if (!!this.mute) {
      this.container.setVolume(this.currentVolume)
      this.setVolumeLevel(this.currentVolume)
      this.mute = false
    } else {
      this.container.setVolume(0)
      this.setVolumeLevel(0)
      this.mute = true
    }
  }

  toggleFullscreen() {
    this.trigger('mediacontrol:fullscreen', this.name)
  }

  setContainer(container) {
    this.stopListening(this.container)
    this.container = container
    this.changeTogglePlay()
    this.addEventListeners()
    this.settingsUpdate()
    this.container.setVolume(this.currentVolume)
    if (this.container.mediaControlDisabled)
      this.disable()
  }

  showVolumeBar() {
    if (this.hideVolumeId) {
      clearTimeout(this.hideVolumeId)
    }
    this.$volumeBarContainer.show()
    this.$volumeBarContainer.removeClass('volume-bar-hide')
  }

  hideVolumeBar() {
    if (!this.$volumeBarContainer) return
    if (this.hideVolumeId) {
      clearTimeout(this.hideVolumeId)
    }
    this.hideVolumeId = setTimeout(
      () => {
        this.$volumeBarContainer.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => {
          this.$volumeBarContainer.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend')
          this.$volumeBarContainer.hide()
        })
        this.$volumeBarContainer.addClass('volume-bar-hide')
      }, 750)
  }

  ended() {
    this.changeTogglePlay()
  }

  updateProgressBar(startPosition, endPosition, duration) {
    var loadedStart = startPosition / duration * 100
    var loadedEnd = endPosition / duration * 100
    this.$seekBarLoaded.css({ left: loadedStart + '%', width: (loadedEnd - loadedStart) + '%' })
  }

  updateSeekBar(position, duration) {
    if (this.draggingSeekBar) return
    var seekbarValue = (100 / duration) * position
    this.setSeekPercentage(seekbarValue)
    this.$('[data-position]').html(Utils.formatTime(position))
    this.$('[data-duration]').html(Utils.formatTime(duration))
  }

  seek(event) {
    var offsetX = event.pageX - this.$seekBarContainer.offset().left
    var pos = offsetX / this.$seekBarContainer.width() * 100
    pos = Math.min(100, Math.max(pos, 0))
    this.container.setCurrentTime(pos)
  }

  setKeepVisible() {
    this.keepVisible = true
  }

  resetKeepVisible() {
    this.keepVisible = false
  }

  show(event) {
    if (this.disabled) return
    var timeout = 2000
    if (!event || (event.clientX !== this.lastMouseX && event.clientY !== this.lastMouseY) || navigator.userAgent.match(/firefox/i)) {
      if (this.hideId) {
        clearTimeout(this.hideId)
      }
      this.$el.show()
      this.trigger('mediacontrol:show', this.name)
      this.$el.removeClass('media-control-hide')
      this.hideId = setTimeout(() => this.hide(), timeout)
      if (event) {
        this.lastMouseX = event.clientX
        this.lastMouseY = event.clientY
      }
    }
  }

  hide() {
    var timeout = 2000
    if (this.hideId) {
      clearTimeout(this.hideId)
    }
    if (this.keepVisible || this.draggingVolumeBar || this.draggingSeekBar) {
      this.hideId = setTimeout(() => this.hide(), timeout)
    } else {
      if (this.$volumeBarContainer) {
        this.$volumeBarContainer.hide()
      }
      this.trigger('mediacontrol:hide', this.name)
      this.$el.addClass('media-control-hide')
    }
  }

  settingsUpdate() {
    this.render()
  }

  highDefinitionUpdate() {
    if (this.container.isHighDefinitionInUse()) {
      this.$el.find('button[data-hd-indicator]').addClass("enabled")
    } else {
      this.$el.find('button[data-hd-indicator]').removeClass("enabled")
    }
  }

  createCachedElements() {
    this.$playPauseToggle = this.$el.find('button.media-control-button[data-playpause]')
    this.$playStopToggle = this.$el.find('button.media-control-button[data-playstop]')
    this.$seekBarContainer = this.$el.find('.bar-container[data-seekbar]')
    this.$seekBarLoaded = this.$el.find('.bar-fill-1[data-seekbar]')
    this.$seekBarPosition = this.$el.find('.bar-fill-2[data-seekbar]')
    this.$seekBarScrubber = this.$el.find('.bar-scrubber[data-seekbar]')
    this.$volumeBarContainer = this.$el.find('.bar-container[data-volume]')
    this.$volumeBarBackground = this.$el.find('.bar-background[data-volume]')
    this.$volumeBarFill = this.$el.find('.bar-fill-1[data-volume]')
    this.$volumeBarScrubber = this.$el.find('.bar-scrubber[data-volume]')
    this.$volumeIcon = this.$el.find('.drawer-icon[data-volume]')
  }

  setVolumeLevel(value) {
    var containerHeight = this.$volumeBarContainer.height()
    var barHeight = this.$volumeBarBackground.height()
    var offset = (containerHeight - barHeight) / 2.0
    var pos = barHeight * value / 100.0 - this.$volumeBarScrubber.height() / 2.0 + offset
    this.$volumeBarFill.css({ height: value + '%' })
    this.$volumeBarScrubber.css({ bottom: pos })
    if (value > 0) {
      this.$volumeIcon.removeClass('muted')
    } else {
      this.$volumeIcon.addClass('muted')
    }
  }

  setSeekPercentage(value) {
    var pos = this.$seekBarContainer.width() * value / 100.0 - this.$seekBarScrubber.width() / 2.0
    this.$seekBarPosition.css({ width: value + '%' })
    this.$seekBarScrubber.css({ left: pos })
  }

  bindKeyEvents() {
    if (this.keydownHandlerFn) {
      $(document).unbind('keydown', this.keydownHandlerFn)
    } else {
      this.keydownHandlerFn = (event) => this.onKeyDown(event)
    }
    if (this.$playPauseToggle.length > 0) {
      $(document).bind('keydown', this.keydownHandlerFn)
    }
  }

  render() {
    var timeout = 1000
    var style = Styler.getStyleFor('media_control')
    this.$el.html(this.template({ settings: this.settings }))
    this.$el.append(style)
    this.createCachedElements()
    this.$playPauseToggle.addClass('paused')
    this.$playStopToggle.addClass('stopped')
    this.currentVolume = this.currentVolume || 100

    this.$volumeBarContainer.hide()

    this.changeTogglePlay()
    this.hideId = setTimeout(() => this.hide(), timeout)
    if (this.disabled) {
      this.hide()
    }

    if(this.options.mediacontrol && this.options.mediacontrol.style) {
      this.$el.css(this.options.mediacontrol.style)
    }

    this.$el.ready(() => {
      this.setVolumeLevel(this.currentVolume)
      this.setSeekPercentage(0)
      this.bindKeyEvents()
      this.highDefinitionUpdate()
    })

    return this
  }
}

module.exports = MediaControl
