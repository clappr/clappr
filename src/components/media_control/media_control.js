// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The MediaControl is responsible for displaying the Player controls.
 */

var _ = require('underscore');
var $ = require('jquery');
var JST = require('../../base/jst');
var Styler = require('../../base/styler');
var UIObject = require('../../base/ui_object');
var Utils = require('../../base/utils');

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
      'click .volume-bar[data-volume]': 'volume',
      'click .volume-mute-toggle[data-volume]': 'toggleMute',
      'mouseover .volume-wrapper[data-volume]': 'showVolumeBar',
      'mouseover .volume-bar[data-volume]': 'keepVolumeBar',
      'mouseleave [data-volume]': 'hideVolumeBar',
      'mousedown .media-control-icon[data-seekbar]': 'startSeekDrag',
      'mousedown .volume-scrubber[data-volume]': 'startVolumeDrag',
      'mouseover[data-controls]': 'show'
    }
  }
  get template() { return JST.media_control }
  initialize(params) {
    this.params = params
    this.container = params.container
    this.addEventListeners()
    this.defaultSettings = {
      left: ['play', 'stop', 'pause'],
      right: ['volume'],
      default: ['position', 'seekbar', 'duration']
    }
    this.disabled = false
    if (this.container.mediaControlDisabled || this.params.chromeless)
      this.disable()
    this.currentVolume = 100
    $(document).bind('mouseup', () => this.stopDrag())
    $(document).bind('mousemove', () => this.updateDrag())
  }

  addEventListeners() {
    this.listenTo(this.container, 'container:play', this.changeTogglePlay)
    this.listenTo(this.container, 'container:playing', this.changeTogglePlay)
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
    if (this.params.chromeless) return
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
    var playPauseButton = this.$el.find('button[data-playpause]')
    var playStopButton = this.$el.find('button[data-playstop]')
    if (this.container.isPlaying()) {
      playPauseButton.removeClass('paused')
      playPauseButton.addClass('playing')
      playStopButton.removeClass('stopped')
      playStopButton.addClass('playing')
    } else {
      playPauseButton.addClass('paused')
      playPauseButton.removeClass('playing')
      playStopButton.addClass('stopped')
      playStopButton.removeClass('playing')
    }
  }

  togglePlayPause() {
    var playPauseButton = this.$el.find('button[data-playpause]')
    if (this.container.isPlaying()) {
      this.container.pause()
      playPauseButton.addClass('paused')
      playPauseButton.removeClass('playing')
    } else {
      this.container.play()
      playPauseButton.removeClass('paused')
      playPauseButton.addClass('playing')
    }
  }

  togglePlayStop() {
    var playStopButton = this.$el.find('button[data-playstop]')
    if (this.container.isPlaying()) {
      this.container.stop()
      playStopButton.addClass('stopped')
      playStopButton.removeClass('playing')
    } else {
      this.container.play()
      playStopButton.removeClass('stopped')
      playStopButton.addClass('playing')
    }
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
      var $element = this.$el.find('div.seekbar[data-seekbar]')
      var offsetX = event.pageX - $element.offset().left
      var pos = offsetX / $element.width() * 100
      pos = Math.min(100, Math.max(pos, 0))
      var $overlayEl = this.$el.find('div.seekbar-position[data-seekbar]')
      $overlayEl.css({width: pos + '%'})
    } else if (this.draggingVolumeBar) {
      var $element = this.$el.find('div.volume-bar[data-volume]')
      var offsetY = event.pageY - $element.offset().top
      var pos = (1 - (offsetY / $element.height())) * 100
      pos = Math.min(100, Math.max(pos, 0))
      var $overlayEl = this.$el.find('div.volume-current[data-volume]')
      $overlayEl.css({height: pos + '%'})
      this.volume(event)
    }
  }

  volume(event) {
    var $element = this.$el.find('div.volume-bar[data-volume]')
    var offsetY = event.pageY - $element.offset().top
    this.currentVolume = (1 - (offsetY / $element.height())) * 100
    this.currentVolume = Math.min(100, Math.max(this.currentVolume, 0))
    this.$el.find('div.volume-current[data-volume]').css({height: this.currentVolume + '%'})
    this.container.setVolume(this.currentVolume)
    var $iconEl = this.$el.find('.media-control-icon[data-volume]')
    if (this.currentVolume) {
      $iconEl.removeClass('muted')
    } else {
      $iconEl.addClass('muted')
    }
  }

  toggleMute() {
    var $iconEl = this.$el.find('.media-control-icon[data-volume]')
    var $overlayEl = this.$el.find('div.volume-current[data-volume]')
    if (!!this.mute) {
      $iconEl.removeClass('muted')
      $overlayEl.css({height: this.currentVolume + '%'})
      this.container.setVolume(this.currentVolume)
      this.mute = false
    } else {
      var $element = this.$el.find('div.volume-bar[data-volume]')
      $overlayEl.css({height: 0})
      this.container.setVolume(0)
      $iconEl.addClass('muted')
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
    if (this.container.mediaControlDisabled)
      this.disable()
  }

  showVolumeBar() {
    if(this.hideVolumeId) {
      clearTimeout(this.hideVolumeId)
    }
    this.$el.find('.volume-bar-wrapper[data-volume]').fadeIn('fast')
  }

  hideVolumeBar() {
    if(this.hideVolumeId) {
      clearTimeout(this.hideVolumeId)
    }
    this.hideVolumeId = setTimeout(
      () => this.$el.find('.volume-bar-wrapper[data-volume]').fadeOut('fast'),
      750
    )
  }

  keepVolumeBar() {
    if(this.hideVolumeId) {
      clearTimeout(this.hideVolumeId)
    }
  }

  ended() {
    this.changeTogglePlay()
  }

  updateProgressBar(startPosition, endPosition, duration) {
    var loadedStart = startPosition / duration * 100
    var loadedEnd = endPosition / duration * 100
    this.$el.find('div.seekbar-loaded[data-seekbar]').css({ left: loadedStart + '%', width: (loadedEnd - loadedStart) + '%' })
  }

  updateSeekBar(position, duration) {
    if (this.draggingSeekBar) return
    var seekbarValue = (100 / duration) * position
    this.$('div.seekbar-position[data-seekbar]').css({ width: seekbarValue + '%' })
    this.$('[data-position]').html(Utils.formatTime(position))
    this.$('[data-duration]').html(Utils.formatTime(duration))
  }

  seek(event) {
    var $element = this.$el.find('div.seekbar[data-seekbar]')
    var offsetX = event.pageX - $element.offset().left
    var pos = offsetX / $element.width() * 100
    pos = Math.min(100, Math.max(pos, 0))
    this.container.setCurrentTime(pos)
  }

  show(event) {
    if (this.disabled) return
    var timeout = 2000
    if (!event || (event.clientX !== this.lastMouseX && event.clientY !== this.lastMouseY) || navigator.userAgent.match(/firefox/i)) {
      if (this.hideId) {
        clearTimeout(this.hideId)
      }
      this.trigger('mediacontrol:show', this.name)
      this.$el.fadeIn()
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
    if (this.disabled || (!this.draggingVolumeBar && !this.draggingSeekBar && this.$el.find('[data-controls]:hover').length === 0)) {
      this.trigger('mediacontrol:hide', this.name)
      this.$el.fadeOut()
    } else {
      this.hideId = setTimeout(() => this.hide(), timeout)
    }
  }

  settingsUpdate() {
    this.render()
  }

  highDefinitionUpdate() {
    var $element = this.$el.find('button[data-hd]')
    $element.removeClass('enabled')
    if (this.container.isHighDefinitionInUse()) {
      $element.addClass('enabled')
    }
  }

  render() {
    var timeout = 1000
    var style = Styler.getStyleFor('media_control')
    var settings = this.container.settings || this.defaultSettings
    this.$el.html(this.template({settings: settings}))
    this.$el.append(style)
    this.$el.find('.volume-bar-wrapper[data-volume]').hide()
    this.$el.find('button[data-playpause]').addClass('paused')
    this.$el.find('button[data-playstop]').addClass('stopped')
    this.$el.find('div.volume-current[data-volume]').css({height: 100 + '%'})
    this.$el.find('div.seekbar-position[data-seekbar]').css({width: 0})
    this.$el.find('div.seekbar-loaded[data-seekbar]').css({width: 0})
    if (this.params.autoPlay) {
      this.togglePlayPause()
      this.togglePlayStop()
    }
    this.changeTogglePlay()
    this.hideId = setTimeout(() => this.hide(), timeout)
    if (this.disabled)
      this.$el.hide()
    return this
  }
}

module.exports = MediaControl
