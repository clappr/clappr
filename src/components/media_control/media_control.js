// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The MediaControl is responsible for displaying the Player controls.
 */

import {Config, Fullscreen, formatTime, extend} from 'base/utils'
import {Kibo} from 'vendor'

import Events from 'base/events'
import Styler from 'base/styler'
import UIObject from 'base/ui_object'
import Browser from 'components/browser'
import Mediator from 'components/mediator'
import template from 'base/template'
import Playback from 'base/playback'

import $ from 'clappr-zepto'

import mediaControlStyle from './public/media-control.scss'
import mediaControlHTML from './public/media-control.html'

import playIcon from 'icons/01-play.svg'
import pauseIcon from 'icons/02-pause.svg'
import stopIcon from 'icons/03-stop.svg'
import volumeIcon from 'icons/04-volume.svg'
import volumeMuteIcon from 'icons/05-mute.svg'
import fullscreenIcon from 'icons/06-expand.svg'
import exitFullscreenIcon from 'icons/07-shrink.svg'
import hdIcon from 'icons/08-hd.svg'

export default class MediaControl extends UIObject {
  get name() { return 'MediaControl' }

  get attributes() {
    return {
      'class': 'media-control',
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
      'click .bar-container[data-volume]': 'onVolumeClick',
      'click .drawer-icon[data-volume]': 'toggleMute',
      'mouseenter .drawer-container[data-volume]': 'showVolumeBar',
      'mouseleave .drawer-container[data-volume]': 'hideVolumeBar',
      'mousedown .bar-container[data-volume]': 'startVolumeDrag',
      'mousemove .bar-container[data-volume]': 'mousemoveOnVolumeBar',
      'mousedown .bar-scrubber[data-seekbar]': 'startSeekDrag',
      'mousemove .bar-container[data-seekbar]': 'mousemoveOnSeekBar',
      'mouseleave .bar-container[data-seekbar]': 'mouseleaveOnSeekBar',
      'mouseenter .media-control-layer[data-controls]': 'setUserKeepVisible',
      'mouseleave .media-control-layer[data-controls]': 'resetUserKeepVisible'
    }
  }

  get template() { return template(mediaControlHTML) }

  get stylesheet() { return Styler.getStyleFor(mediaControlStyle, {baseUrl: this.options.baseUrl}) }

  get volume() { return (this.container && this.container.isReady) ? this.container.volume : this.intendedVolume }
  get muted() { return this.volume === 0 }

  constructor(options) {
    super(options)
    this.options = options
    this.persistConfig = this.options.persistConfig
    this.container = options.container
    this.currentPositionValue = null
    this.currentDurationValue = null
    var initialVolume = (this.persistConfig) ? Config.restore('volume') : 100
    this.setVolume(this.options.mute ? 0 : initialVolume)
    this.keepVisible = false
    this.addEventListeners()
    this.settings = {
      left: ['play', 'stop', 'pause'],
      right: ['volume'],
      default: ['position', 'seekbar', 'duration']
    }

    if (this.container) {
      if (!$.isEmptyObject(this.container.settings)) {
        this.settings = $.extend({}, this.container.settings)
      }
    } else {
      this.settings = {}
    }

    this.disabled = false
    if ((this.container && this.container.mediaControlDisabled) || this.options.chromeless) {
      this.disable()
    }
    this.stopDragHandler = (event) => this.stopDrag(event)
    this.updateDragHandler = (event) => this.updateDrag(event)
    $(document).bind('mouseup', this.stopDragHandler)
    $(document).bind('mousemove', this.updateDragHandler)
  }

  addEventListeners() {
    if (this.container) {
      Mediator.on(`${this.options.playerId}:${Events.PLAYER_RESIZE}`, this.playerResize, this)
      this.listenTo(this.container, Events.CONTAINER_PLAY, this.changeTogglePlay)
      this.listenTo(this.container, Events.CONTAINER_PAUSE, this.changeTogglePlay)
      this.listenTo(this.container, Events.CONTAINER_DBLCLICK, this.toggleFullscreen)
      this.listenTo(this.container, Events.CONTAINER_TIMEUPDATE, this.onTimeUpdate)
      this.listenTo(this.container, Events.CONTAINER_PROGRESS, this.updateProgressBar)
      this.listenTo(this.container, Events.CONTAINER_SETTINGSUPDATE, this.settingsUpdate)
      this.listenTo(this.container, Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.settingsUpdate)
      this.listenTo(this.container, Events.CONTAINER_HIGHDEFINITIONUPDATE, this.highDefinitionUpdate)
      this.listenTo(this.container, Events.CONTAINER_MEDIACONTROL_DISABLE, this.disable)
      this.listenTo(this.container, Events.CONTAINER_MEDIACONTROL_ENABLE, this.enable)
      this.listenTo(this.container, Events.CONTAINER_ENDED, this.ended)
      this.listenTo(this.container, Events.CONTAINER_VOLUME, this.onVolumeChanged)
    }
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

  onVolumeChanged() {
    this.updateVolumeUI()
  }

  updateVolumeUI() {
    if (!this.rendered) {
      // this will be called after a render
      return
    }
    // update volume bar scrubber/fill on bar mode
    this.$volumeBarContainer.find('.bar-fill-2').css({})
    var containerWidth = this.$volumeBarContainer.width()
    var barWidth = this.$volumeBarBackground.width()
    var offset = (containerWidth - barWidth) / 2.0
    var pos = barWidth * this.volume / 100.0 + offset
    this.$volumeBarFill.css({ width: `${this.volume}%` })
    this.$volumeBarScrubber.css({ left: pos })

    // update volume bar segments on segmented bar mode
    this.$volumeBarContainer.find('.segmented-bar-element').removeClass('fill')
    var item = Math.ceil(this.volume / 10.0)
    this.$volumeBarContainer.find('.segmented-bar-element').slice(0, item).addClass('fill')
    this.$volumeIcon.html('')
    this.$volumeIcon.removeClass('muted')
    if (!this.muted) {
      this.$volumeIcon.append(volumeIcon)
    } else {
      this.$volumeIcon.append(volumeMuteIcon)
      this.$volumeIcon.addClass('muted')
    }
    this.applyButtonStyle(this.$volumeIcon)
  }

  changeTogglePlay() {
    this.$playPauseToggle.html('')
    this.$playStopToggle.html('')
    if (this.container && this.container.isPlaying()) {
      this.$playPauseToggle.append(pauseIcon)
      this.$playStopToggle.append(stopIcon)
      this.trigger(Events.MEDIACONTROL_PLAYING)
    } else {
      this.$playPauseToggle.append(playIcon)
      this.$playStopToggle.append(playIcon)
      this.trigger(Events.MEDIACONTROL_NOTPLAYING)
    }
    this.applyButtonStyle(this.$playPauseToggle)
    this.applyButtonStyle(this.$playStopToggle)
  }

  mousemoveOnSeekBar(event) {
    if (this.container.settings.seekEnabled) {
      var offsetX = event.pageX - this.$seekBarContainer.offset().left - (this.$seekBarHover.width() / 2)
      this.$seekBarHover.css({left: offsetX})
    }
    this.trigger(Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR, event)
  }

  mouseleaveOnSeekBar(event) {
    this.trigger(Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR, event)
  }

  onVolumeClick(event) {
    this.setVolume(this.getVolumeFromUIEvent(event))
  }

  mousemoveOnVolumeBar(event) {
    if(this.draggingVolumeBar) {
      this.setVolume(this.getVolumeFromUIEvent(event))
    }
  }

  playerResize(size) {
    this.$fullscreenToggle.html('')
    if (Fullscreen.isFullscreen()) {
      this.$fullscreenToggle.append(exitFullscreenIcon)
    } else {
      this.$fullscreenToggle.append(fullscreenIcon)
    }
    this.applyButtonStyle(this.$fullscreenToggle)
    this.$el.removeClass('w320')
    if (size.width <= 320 || this.options.hideVolumeBar) {
      this.$el.addClass('w320')
    }
  }

  togglePlayPause() {
    if (this.container.isPlaying()) {
      this.container.pause()
    } else {
      this.container.play()
    }
    return false
  }

  togglePlayStop() {
    if (this.container.isPlaying()) {
      this.container.stop()
    } else {
      this.container.play()
    }
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
    if (this.draggingSeekBar) {
      event.preventDefault()
      var offsetX = event.pageX - this.$seekBarContainer.offset().left
      var pos = offsetX / this.$seekBarContainer.width() * 100
      pos = Math.min(100, Math.max(pos, 0))
      this.setSeekPercentage(pos)
    } else if (this.draggingVolumeBar) {
      event.preventDefault()
      this.setVolume(this.getVolumeFromUIEvent(event))
    }
  }

  getVolumeFromUIEvent(event) {
    var offsetY = event.pageX - this.$volumeBarContainer.offset().left
    var volumeFromUI = (offsetY / this.$volumeBarContainer.width()) * 100
    return volumeFromUI
  }

  toggleMute() {
    this.setVolume(this.muted ? 100 : 0)
  }

  setVolume(value) {
    value = Math.min(100, Math.max(value, 0))
    // this will hold the intended volume
    // it may not actually get set to this straight away
    // if the container is not ready etc
    this.intendedVolume = value
    this.persistConfig && Config.persist('volume', value)
    var setWhenContainerReady = () => {
      if (this.container.isReady) {
        this.container.setVolume(value)
      } else {
        this.listenToOnce(this.container, Events.CONTAINER_READY, () => {
          this.container.setVolume(value)
        })
      }
    }

    if (!this.container) {
      this.listenToOnce(this, Events.MEDIACONTROL_CONTAINERCHANGED, () => {
        setWhenContainerReady()
      })
    } else {
      setWhenContainerReady()
    }
  }

  toggleFullscreen() {
    this.trigger(Events.MEDIACONTROL_FULLSCREEN, this.name)
    this.container.fullscreen()
    this.resetUserKeepVisible()
  }

  setContainer(container) {
    if (this.container) {
      this.stopListening(this.container)
    }
    Mediator.off(`${this.options.playerId}:${Events.PLAYER_RESIZE}`, this.playerResize, this)
    this.container = container
    // set the new container to match the volume of the last one
    this.setVolume(this.intendedVolume)
    this.changeTogglePlay()
    this.addEventListeners()
    this.settingsUpdate()
    this.container.trigger(Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.container.isDvrInUse())
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

  hideVolumeBar(timeout = 400) {
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

  updateProgressBar(progress) {
    var loadedStart = progress.start / progress.total * 100
    var loadedEnd = progress.current / progress.total * 100
    this.$seekBarLoaded.css({ left: `${loadedStart}%`, width: `${loadedEnd - loadedStart}%` })
  }

  onTimeUpdate(timeProgress) {
    if (this.draggingSeekBar) return
    // TODO why should current time ever be negative?
    var position = (timeProgress.current < 0) ? timeProgress.total : timeProgress.current

    this.currentPositionValue = position
    this.currentDurationValue = timeProgress.total
    this.renderSeekBar()
  }

  renderSeekBar() {
    if (this.currentPositionValue === null || this.currentDurationValue === null) {
      // this will be triggered as soon as these beocome available
      return
    }

    // default to 100%
    this.currentSeekBarPercentage = 100
    if (this.container.getPlaybackType() !== Playback.LIVE || this.container.isDvrInUse()) {
      this.currentSeekBarPercentage = (this.currentPositionValue / this.currentDurationValue) * 100
    }
    this.setSeekPercentage(this.currentSeekBarPercentage)

    var newPosition = formatTime(this.currentPositionValue)
    var newDuration = formatTime(this.currentDurationValue)
    if (newPosition !== this.displayedPosition) {
      this.$position.text(newPosition)
      this.displayedPosition = newPosition
    }
    if (newDuration !== this.displayedDuration) {
      this.$duration.text(newDuration)
      this.displayedDuration = newDuration
    }
  }

  seek(event) {
    if (!this.container.settings.seekEnabled) return
    var offsetX = event.pageX - this.$seekBarContainer.offset().left
    var pos = offsetX / this.$seekBarContainer.width() * 100
    pos = Math.min(100, Math.max(pos, 0))
    this.container.seekPercentage(pos)
    this.setSeekPercentage(pos)
    return false
  }

  setKeepVisible() {
    this.keepVisible = true
  }

  resetKeepVisible() {
    this.keepVisible = false
  }

  setUserKeepVisible() {
    this.userKeepVisible = true
  }

  resetUserKeepVisible() {
    this.userKeepVisible = false
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

  hide(delay = 0) {
    var timeout = delay || 2000
    clearTimeout(this.hideId)
    if (!this.isVisible() || this.options.hideMediaControl === false) return
    if (delay || this.userKeepVisible || this.keepVisible || this.draggingSeekBar || this.draggingVolumeBar) {
      this.hideId = setTimeout(() => this.hide(), timeout)
    } else {
      this.trigger(Events.MEDIACONTROL_HIDE, this.name)
      this.$el.addClass('media-control-hide')
      this.hideVolumeBar(0)
    }
  }

  settingsUpdate() {
    var settingsChanged = (JSON.stringify(this.settings) !== JSON.stringify(this.container.settings))
    if (this.container.getPlaybackType() && settingsChanged) {
      this.settings = $.extend({}, this.container.settings)
      this.render()
    }
  }

  highDefinitionUpdate(isHD) {
    var method = isHD ? 'addClass' : 'removeClass'
    this.$hdIndicator[method]('enabled')
  }

  createCachedElements() {
    var $layer = this.$el.find('.media-control-layer')
    this.$duration = $layer.find('.media-control-indicator[data-duration]')
    this.$fullscreenToggle = $layer.find('button.media-control-button[data-fullscreen]')
    this.$playPauseToggle = $layer.find('button.media-control-button[data-playpause]')
    this.$playStopToggle = $layer.find('button.media-control-button[data-playstop]')
    this.$position = $layer.find('.media-control-indicator[data-position]')
    this.$seekBarContainer = $layer.find('.bar-container[data-seekbar]')
    this.$seekBarHover = $layer.find('.bar-hover[data-seekbar]')
    this.$seekBarLoaded = $layer.find('.bar-fill-1[data-seekbar]')
    this.$seekBarPosition = $layer.find('.bar-fill-2[data-seekbar]')
    this.$seekBarScrubber = $layer.find('.bar-scrubber[data-seekbar]')
    this.$volumeBarContainer = $layer.find('.bar-container[data-volume]')
    this.$volumeContainer = $layer.find('.drawer-container[data-volume]')
    this.$volumeIcon = $layer.find('.drawer-icon[data-volume]')
    this.$volumeBarBackground = this.$el.find('.bar-background[data-volume]')
    this.$volumeBarFill = this.$el.find('.bar-fill-1[data-volume]')
    this.$volumeBarScrubber = this.$el.find('.bar-scrubber[data-volume]')
    this.$hdIndicator = this.$el.find('button.media-control-button[data-hd-indicator]')
    this.resetIndicators()
    this.initializeIcons()
  }

  resetIndicators() {
    this.displayedPosition = this.$position.text()
    this.displayedDuration = this.$duration.text()
  }

  initializeIcons() {
    var $layer = this.$el.find('.media-control-layer')
    $layer.find('button.media-control-button[data-play]').append(playIcon)
    $layer.find('button.media-control-button[data-pause]').append(pauseIcon)
    $layer.find('button.media-control-button[data-stop]').append(stopIcon)
    this.$playPauseToggle.append(playIcon)
    this.$playStopToggle.append(playIcon)
    this.$volumeIcon.append(volumeIcon)
    this.$fullscreenToggle.append(fullscreenIcon)
    this.$hdIndicator.append(hdIcon)
  }

  setSeekPercentage(value) {
    value = Math.max(Math.min(value, 100.0), 0)
    if (this.displayedSeekBarPercentage === value) {
      // not changed since last update
      return
    }
    this.displayedSeekBarPercentage = value

    this.$seekBarPosition.removeClass('media-control-notransition')
    this.$seekBarScrubber.removeClass('media-control-notransition')
    this.$seekBarPosition.css({ width: `${value}%` })
    this.$seekBarScrubber.css({ left: `${value}%` })
  }

  seekRelative(delta) {
    if (!this.container.settings.seekEnabled) return
    var currentTime = this.container.getCurrentTime()
    var duration = this.container.getDuration()
    var position = Math.min(Math.max(currentTime + delta, 0), duration)
    position = Math.min(position * 100 / duration, 100)
    this.container.seekPercentage(position)
  }

  bindKeyEvents() {
    this.unbindKeyEvents()
    this.kibo = new Kibo(this.options.focusElement)
    this.kibo.down(['space'], () => this.togglePlayPause())
    this.kibo.down(['left'], () => this.seekRelative(-15))
    this.kibo.down(['right'], () => this.seekRelative(15))
    var keys = [1,2,3,4,5,6,7,8,9,0]
    keys.forEach((i) => { this.kibo.down(i.toString(), () => this.container.settings.seekEnabled && this.container.seekPercentage(i * 10)) })
  }

  unbindKeyEvents() {
    if (this.kibo) {
      this.kibo.off('space')
      this.kibo.off('left')
      this.kibo.off('right')
      this.kibo.off([1,2,3,4,5,6,7,8,9,0])
    }
  }

  parseColors() {
    if (this.options.mediacontrol) {
      this.buttonsColor = this.options.mediacontrol.buttons
      var seekbarColor = this.options.mediacontrol.seekbar
      this.$el.find('.bar-fill-2[data-seekbar]').css('background-color', seekbarColor)
      this.$el.find('.media-control-icon svg path').css('fill', this.buttonsColor)
      this.$el.find('.segmented-bar-element[data-volume]').css('boxShadow', 'inset 2px 0 0 ' + this.buttonsColor)
    }
  }

  applyButtonStyle(element) {
    if (this.buttonsColor && element) {
      $(element).find('svg path').css('fill', this.buttonsColor)
    }
  }

  destroy() {
    this.remove()
    $(document).unbind('mouseup', this.stopDragHandler)
    $(document).unbind('mousemove', this.updateDragHandler)
    this.unbindKeyEvents()
  }

  render() {
    var timeout = 1000
    this.$el.html(this.template({ settings: this.settings }))
    this.$el.append(this.stylesheet)
    this.createCachedElements()
    this.$playPauseToggle.addClass('paused')
    this.$playStopToggle.addClass('stopped')

    this.changeTogglePlay()
    this.hideId = setTimeout(() => this.hide(), timeout)
    if (this.disabled) {
      this.hide()
    }

    if(Browser.isSafari && Browser.isMobile) {
      this.$volumeContainer.css('display','none')
    }

    this.$seekBarPosition.addClass('media-control-notransition')
    this.$seekBarScrubber.addClass('media-control-notransition')

    var previousSeekPercentage = 0
    if (this.displayedSeekBarPercentage) {
      previousSeekPercentage = this.displayedSeekBarPercentage
    }
    this.displayedSeekBarPercentage = null
    this.setSeekPercentage(previousSeekPercentage)

    process.nextTick(() => {
      if (!this.container.settings.seekEnabled) {
        this.$seekBarContainer.addClass('seek-disabled')
      }
      if (!this.options.disableKeyboardShortcuts) {
        this.bindKeyEvents()
      }
      this.playerResize({width: this.options.width, height: this.options.height})
      this.hideVolumeBar(0)
    })

    this.parseColors()
    this.highDefinitionUpdate()

    this.rendered = true
    this.updateVolumeUI()
    this.trigger(Events.MEDIACONTROL_RENDERED)
    return this
  }
}

MediaControl.extend = function(properties) {
  return extend(MediaControl, properties)
}
