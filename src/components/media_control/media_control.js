// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The MediaControl is responsible for displaying the Player controls.
 */

var $ = require('zepto')
var JST = require('../../base/jst')
var Styler = require('../../base/styler')
var UIObject = require('ui_object')
var Utils = require('../../base/utils')
var SeekTime = require('../seek_time')
var Mediator = require('mediator')
var PlayerInfo = require('player_info')
var Events = require('events')
require('mousetrap')

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
      'click .bar-container[data-seekbar]': 'seek',
      'click .bar-container[data-volume]': 'volume',
      'click .drawer-icon[data-volume]': 'toggleMute',
      'mouseenter .drawer-container[data-volume]': 'showVolumeBar',
      'mouseleave .drawer-container[data-volume]': 'hideVolumeBar',
      'mousedown .bar-scrubber[data-volume]': 'startVolumeDrag',
      'mousedown .bar-scrubber[data-seekbar]': 'startSeekDrag',
      'mousemove .bar-container[data-seekbar]': 'mousemoveOnSeekBar',
      'mouseleave .bar-container[data-seekbar]': 'mouseleaveOnSeekBar',
      'mouseenter .media-control-layer[data-controls]': 'setKeepVisible',
      'mouseleave .media-control-layer[data-controls]': 'resetKeepVisible'
    }
  }

  get template() { return JST.media_control }

  constructor(options) {
    super(options);
    this.seekTime = new SeekTime(this)
    this.options = options
    this.mute = this.options.mute
    this.persistConfig = this.options.persistConfig
    this.container = options.container
    var initialVolume = (this.persistConfig) ? Utils.Config.restore("volume") : 100;
    this.setVolume(this.mute ? 0 : initialVolume)
    this.keepVisible = false
    this.addEventListeners()
    this.settings = {
      left: ['play', 'stop', 'pause'],
      right: ['volume'],
      default: ['position', 'seekbar', 'duration']
    }
    this.settings = Object.keys(this.container.settings).length === 0 ? this.settings : this.container.settings
    this.disabled = false
    if (this.container.mediaControlDisabled || this.options.chromeless) {
      this.disable()
    }
    $(document).bind('mouseup', (event) => this.stopDrag(event))
    $(document).bind('mousemove', (event) => this.updateDrag(event))
    Mediator.on(Events.PLAYER_RESIZE, () => this.playerResize())
  }

  addEventListeners() {
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.changeTogglePlay)
    this.listenTo(this.container, Events.CONTAINER_TIMEUPDATE, this.updateSeekBar)
    this.listenTo(this.container, Events.CONTAINER_PROGRESS, this.updateProgressBar)
    this.listenTo(this.container, Events.CONTAINER_SETTINGSUPDATE, this.settingsUpdate)
    this.listenTo(this.container, Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.settingsUpdate)
    this.listenTo(this.container, Events.CONTAINER_HIGHDEFINITIONUPDATE, this.highDefinitionUpdate)
    this.listenTo(this.container, Events.CONTAINER_MEDIACONTROL_DISABLE, this.disable)
    this.listenTo(this.container, Events.CONTAINER_MEDIACONTROL_ENABLE, this.enable)
    this.listenTo(this.container, Events.CONTAINER_ENDED, this.ended)
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
      this.trigger(Events.MEDIACONTROL_PLAYING);
    } else {
      this.$playPauseToggle.removeClass('playing').addClass('paused')
      this.$playStopToggle.removeClass('playing').addClass('stopped')
      this.trigger(Events.MEDIACONTROL_NOTPLAYING);
    }
  }

  mousemoveOnSeekBar(event) {
    if (this.container.settings.seekEnabled) {
      var offsetX = event.pageX - this.$seekBarContainer.offset().left - (this.$seekBarHover.width() / 2)
      this.$seekBarHover.css({left: offsetX})
    }
    this.trigger(Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR, event);
  }

  mouseleaveOnSeekBar(event) {
    this.trigger(Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR, event);
  }

  playerResize() {
    if (Utils.Fullscreen.isFullscreen()) {
      this.$fullscreenToggle.addClass('shrink')
    } else {
      this.$fullscreenToggle.removeClass('shrink')
    }
    this.$el.removeClass('w320')
    if (PlayerInfo.currentSize.width <= 320 || this.options.hideVolumeBar) {
      this.$el.addClass('w320')
    }
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
    if (!this.container.settings.seekEnabled) return
    this.draggingSeekBar = true
    this.$el.addClass('dragging')
    this.$seekBarLoaded.addClass('media-control-notransition')
    this.$seekBarPosition.addClass('media-control-notransition')
    this.$seekBarScrubber.addClass('media-control-notransition')
    if (event) {
      event.preventDefault()
    }
  }

  startVolumeDrag(event) {
    this.draggingVolumeBar = true
    this.$el.addClass('dragging')
    if (event) {
      event.preventDefault()
    }
  }

  stopDrag(event) {
    if (this.draggingSeekBar) {
      this.seek(event)
    }
    this.$el.removeClass('dragging')
    this.$seekBarLoaded.removeClass('media-control-notransition')
    this.$seekBarPosition.removeClass('media-control-notransition')
    this.$seekBarScrubber.removeClass('media-control-notransition dragging')
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
    var offsetY = event.pageX - this.$volumeBarContainer.offset().left
    var volumeFromUI = (offsetY / this.$volumeBarContainer.width()) * 100
    this.setVolume(volumeFromUI)
  }

  toggleMute() {
    if (this.mute) {
      if (this.currentVolume <= 0) {
        this.currentVolume = 100
      }
      this.setVolume(this.currentVolume)
    } else {
      this.setVolume(0)
    }
  }

  setVolume(value) {
    this.currentVolume = Math.min(100, Math.max(value, 0))
    this.container.setVolume(this.currentVolume)
    this.setVolumeLevel(this.currentVolume)
    this.mute = this.currentVolume === 0
    this.persistConfig && Utils.Config.persist("volume", this.currentVolume)
  }

  toggleFullscreen() {
    this.trigger(Events.MEDIACONTROL_FULLSCREEN, this.name)
    this.container.fullscreen()
    this.resetKeepVisible()
  }

  setContainer(container) {
    this.stopListening(this.container)
    this.container = container
    this.changeTogglePlay()
    this.addEventListeners()
    this.settingsUpdate()
    this.container.trigger(Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.container.isDvrInUse())
    this.setVolume(this.currentVolume)
    if (this.container.mediaControlDisabled) {
      this.disable()
    }
    this.trigger(Events.MEDIACONTROL_CONTAINERCHANGED)
  }

  showVolumeBar() {
    if (this.hideVolumeId) {
      clearTimeout(this.hideVolumeId)
    }
    this.$volumeBarContainer.removeClass('volume-bar-hide')
  }

  hideVolumeBar() {
    var timeout = 400
    if (!this.$volumeBarContainer) return
    if (this.draggingVolumeBar) {
      this.hideVolumeId = setTimeout(() => this.hideVolumeBar(), timeout)
    } else {
      if (this.hideVolumeId) {
        clearTimeout(this.hideVolumeId)
      }
      this.hideVolumeId = setTimeout(() => this.$volumeBarContainer.addClass('volume-bar-hide'), timeout)
    }
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
    if (position < 0) position = duration
    this.$seekBarPosition.removeClass('media-control-notransition')
    this.$seekBarScrubber.removeClass('media-control-notransition')
    var seekbarValue = (100 / duration) * position
    this.setSeekPercentage(seekbarValue)
    this.$('[data-position]').html(Utils.formatTime(position))
    this.$('[data-duration]').html(Utils.formatTime(duration))
  }

  seek(event) {
    if (!this.container.settings.seekEnabled) return
    var offsetX = event.pageX - this.$seekBarContainer.offset().left
    var pos = offsetX / this.$seekBarContainer.width() * 100
    pos = Math.min(100, Math.max(pos, 0))
    this.container.setCurrentTime(pos)
    this.setSeekPercentage(pos)
    return false
  }

  setKeepVisible() {
    this.keepVisible = true
  }

  resetKeepVisible() {
    this.keepVisible = false
  }

  isVisible() {
    return !this.$el.hasClass('media-control-hide')
  }

  show(event) {
    if (this.disabled) return
    var timeout = 2000
    if (!event || (event.clientX !== this.lastMouseX && event.clientY !== this.lastMouseY) || navigator.userAgent.match(/firefox/i)) {
      clearTimeout(this.hideId)
      this.$el.show()
      this.trigger(Events.MEDIACONTROL_SHOW, this.name)
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
    clearTimeout(this.hideId)
    if (!this.isVisible() || this.options.hideMediaControl === false) return
    if (this.keepVisible || this.draggingSeekBar || this.draggingVolumeBar) {
      this.hideId = setTimeout(() => this.hide(), timeout)
    } else {
      this.trigger(Events.MEDIACONTROL_HIDE, this.name)
      this.$el.addClass('media-control-hide')
      this.hideVolumeBar()
    }
  }

  settingsUpdate() {
    if (this.container.getPlaybackType() !== null && Object.keys(this.container.settings).length !== 0) {
      this.settings = this.container.settings
      this.render()
    } else {
      this.disable()
    }
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
    this.$fullscreenToggle = this.$el.find('button.media-control-button[data-fullscreen]')
    this.$seekBarContainer = this.$el.find('.bar-container[data-seekbar]')
    this.$seekBarLoaded = this.$el.find('.bar-fill-1[data-seekbar]')
    this.$seekBarPosition = this.$el.find('.bar-fill-2[data-seekbar]')
    this.$seekBarScrubber = this.$el.find('.bar-scrubber[data-seekbar]')
    this.$seekBarHover = this.$el.find('.bar-hover[data-seekbar]')
    this.$volumeBarContainer = this.$el.find('.bar-container[data-volume]')
    this.$volumeIcon = this.$el.find('.drawer-icon[data-volume]')
  }

  setVolumeLevel(value) {
    if (!this.container.isReady || !this.$volumeBarContainer) {
      this.listenToOnce(this.container, Events.CONTAINER_READY, () => this.setVolumeLevel(value))
    } else {
      this.$volumeBarContainer.find('.segmented-bar-element').removeClass('fill')
      var item = Math.ceil(value / 10.0)
      this.$volumeBarContainer.find('.segmented-bar-element').slice(0, item).addClass('fill')
      if (value > 0) {
        this.$volumeIcon.removeClass('muted')
      } else {
        this.$volumeIcon.addClass('muted')
      }
    }
  }

  setSeekPercentage(value) {
    if (value > 100) return
    var pos = this.$seekBarContainer.width() * value / 100.0 - (this.$seekBarScrubber.width() / 2.0)
    this.currentSeekPercentage = value;
    this.$seekBarPosition.css({ width: value + '%' })
    this.$seekBarScrubber.css({ left: pos })
  }

  bindKeyEvents() {
    Mousetrap.bind(['space'], () => this.togglePlayPause())
  }

  unbindKeyEvents() {
    Mousetrap.unbind('space')
  }

  parseColors() {
    if (this.options.mediacontrol) {
      var buttonsColor = this.options.mediacontrol.buttons;
      var seekbarColor = this.options.mediacontrol.seekbar;
      this.$el.find('.bar-fill-2[data-seekbar]').css('background-color', seekbarColor)
      this.$el.find('[data-media-control] > .media-control-icon, .drawer-icon').css('color', buttonsColor)
      this.$el.find('.segmented-bar-element[data-volume]').css('boxShadow', "inset 2px 0 0 " + buttonsColor)
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

    this.changeTogglePlay()
    this.hideId = setTimeout(() => this.hide(), timeout)
    if (this.disabled) {
      this.hide()
    }

    this.$seekBarPosition.addClass('media-control-notransition')
    this.$seekBarScrubber.addClass('media-control-notransition')

    if (!this.currentSeekPercentage) {
      this.currentSeekPercentage = 0
    }
    this.setSeekPercentage(this.currentSeekPercentage)

    this.$el.ready(() => {
      if (!this.container.settings.seekEnabled) {
        this.$seekBarContainer.addClass('seek-disabled')
      }

      this.setVolume(this.currentVolume)
      this.bindKeyEvents()
      this.hideVolumeBar()
    })

    this.parseColors()
    this.seekTime.render()
    this.highDefinitionUpdate()

    this.trigger(Events.MEDIACONTROL_RENDERED)
    return this
  }

  destroy() {
    $(document).unbind('mouseup')
    $(document).unbind('mousemove')
    this.unbindKeyEvents()
  }
}

module.exports = MediaControl
