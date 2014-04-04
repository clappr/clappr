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

module.exports = MediaControl = UIObject.extend({
  attributes: {
    'data-media-control': ''
  },
  events: {
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
  },
  template: JST.media_control,
  initialize: function(params) {
    console.log('mediacontrol :: initialize');
    this.params = params;
    this.container = params.container;
    this.addEventListeners();
    this.defaultSettings = {
      left: ['play', 'stop', 'pause'],
      right: ['volume'],
      default: ['position', 'seekbar', 'duration']
    };
    this.disabled = false;
    if (this.container.mediaControlDisabled)
      this.disable();
    this.currentVolume = 100;
    $(document).bind('mouseup', this.stopDrag.bind(this));
    $(document).bind('mousemove', this.updateDrag.bind(this));
  },

  addEventListeners: function() {
    console.log('mediacontrol :: addEventListeners');
    this.listenTo(this.container, 'container:play', this.changeTogglePlay);
    this.listenTo(this.container, 'container:playing', this.changeTogglePlay);
    this.listenTo(this.container, 'container:timeupdate', this.updateSeekBar);
    this.listenTo(this.container, 'container:progress', this.updateProgressBar);
    this.listenTo(this.container, 'container:settingsupdate', this.settingsUpdate);
    this.listenTo(this.container, 'container:mediacontrol:disable', this.disable);
    this.listenTo(this.container, 'container:mediacontrol:enable', this.enable);
  },

  disable: function() {
    console.log('mediacontrol -> disabled');
    this.disabled = true;
    this.hide();
  },

  enable: function() {
    console.log('mediacontrol -> enabled');
    this.disabled = false;
    this.show();
  },

  play: function() {
    this.container.play();
  },
  pause: function() {
    this.container.pause();
  },
  stop: function() {
    this.container.stop();
  },
  changeTogglePlay: function() {
    console.log('mediacontrol :: changeTogglePlay');
    var playPauseButton = this.$el.find('button[data-playpause]');
    var playStopButton = this.$el.find('button[data-playstop]');
    if (this.container.isPlaying()) {
      playPauseButton.removeClass('paused');
      playPauseButton.addClass('playing');
      playStopButton.removeClass('stopped');
      playStopButton.addClass('playing');
    } else {
      playPauseButton.addClass('paused');
      playPauseButton.removeClass('playing');
      playStopButton.addClass('stopped');
      playStopButton.removeClass('playing');
    }
  },
  togglePlayPause: function() {
    var playPauseButton = this.$el.find('button[data-playpause]');
    if (this.container.isPlaying()) {
      this.container.pause();
      playPauseButton.addClass('paused');
      playPauseButton.removeClass('playing');
    } else {
      this.container.play();
      playPauseButton.removeClass('paused');
      playPauseButton.addClass('playing');
    }
  },
  togglePlayStop: function() {
    var playStopButton = this.$el.find('button[data-playstop]');
    if (this.container.isPlaying()) {
      this.container.stop();
      playStopButton.addClass('stopped');
      playStopButton.removeClass('playing');
    } else {
      this.container.play();
      playStopButton.removeClass('stopped');
      playStopButton.addClass('playing');
    }
  },
  startSeekDrag: function(event) {
    this.draggingSeekBar = true;
    event.preventDefault();
  },
  startVolumeDrag: function(event) {
    this.draggingVolumeBar = true;
    event.preventDefault();
  },
  stopDrag: function(event) {
    if (this.draggingSeekBar) {
      this.seek(event);
    }
    this.draggingSeekBar = false;
    this.draggingVolumeBar = false;
  },
  updateDrag: function(event) {
    event.preventDefault();
    if (this.draggingSeekBar) {
      var $element = this.$el.find('div.seekbar[data-seekbar]');
      var offsetX = event.pageX - $element.offset().left;
      var pos = offsetX / $element.width() * 100;
      pos = Math.min(100, Math.max(pos, 0));
      var $overlayEl = this.$el.find('div.seekbar-position[data-seekbar]');
      $overlayEl.css({width: pos + '%'});
    } else if (this.draggingVolumeBar) {
      var $element = this.$el.find('div.volume-bar[data-volume]');
      var offsetY = event.pageY - $element.offset().top;
      var pos = (1 - (offsetY / $element.height())) * 100;
      pos = Math.min(100, Math.max(pos, 0));
      var $overlayEl = this.$el.find('div.volume-current[data-volume]');
      $overlayEl.css({height: pos + '%'});
      this.volume(event);
    }
  },
  volume: function(event) {
    var $element = this.$el.find('div.volume-bar[data-volume]');
    var offsetY = event.pageY - $element.offset().top;
    this.currentVolume = (1 - (offsetY / $element.height())) * 100;
    this.currentVolume = Math.min(100, Math.max(this.currentVolume, 0));
    this.$el.find('div.volume-current[data-volume]').css({height: this.currentVolume + '%'});
    this.container.setVolume(this.currentVolume);
    var $iconEl = this.$el.find('.media-control-icon[data-volume]');
    if (this.currentVolume) {
      $iconEl.removeClass('muted');
    } else {
      $iconEl.addClass('muted');
    }
  },
  toggleMute: function() {
    var $iconEl = this.$el.find('.media-control-icon[data-volume]');
    var $overlayEl = this.$el.find('div.volume-current[data-volume]');
    if (!!this.mute) {
      $iconEl.removeClass('muted');
      $overlayEl.css({height: this.currentVolume + '%'});
      this.container.setVolume(this.currentVolume);
      this.mute = false;
    } else {
      var $element = this.$el.find('div.volume-bar[data-volume]');
      $overlayEl.css({height: 0});
      this.container.setVolume(0);
      $iconEl.addClass('muted');
      this.mute = true;
    }
  },
  toggleFullscreen: function() {
    this.trigger('mediacontrol:fullscreen');
  },
  setContainer: function(container) {
    this.stopListening(this.container);
    this.container = container;
    this.changeTogglePlay();
    this.listenTo(this.container, 'container:timeupdate', this.updateSeekBar);
    this.listenTo(this.container, 'container:progress', this.updateProgressBar);
    this.listenTo(this.container, 'container:settingsupdate', this.settingsUpdate);
  },
  showVolumeBar: function() {
    if(this.hideVolumeId) {
      clearTimeout(this.hideVolumeId);
    }
    this.$el.find('.volume-bar-wrapper[data-volume]').fadeIn('fast');
  },
  hideVolumeBar: function() {
    if(this.hideVolumeId) {
      clearTimeout(this.hideVolumeId);
    }
    this.hideVolumeId = setTimeout(function() {
      this.$el.find('.volume-bar-wrapper[data-volume]').fadeOut('fast');
    }.bind(this), 750);
  },
  keepVolumeBar: function() {
    if(this.hideVolumeId) {
      clearTimeout(this.hideVolumeId);
    }
  },
  ended: function() {
    this.togglePlayStop();
    this.togglePlayPause();
  },
  updateProgressBar: function(startPosition, endPosition, duration) {
    var loadedStart = startPosition / duration * 100;
    var loadedEnd = endPosition / duration * 100;
    this.$el.find('div.seekbar-loaded[data-seekbar]').css({ left: loadedStart + '%', width: (loadedEnd - loadedStart) + '%' });
  },
  updateSeekBar: function(position, duration) {
    if (this.draggingSeekBar) return;
    var seekbarValue = (100 / duration) * position;
    this.$('div.seekbar-position[data-seekbar]').css({ width: seekbarValue + '%' });
    this.$('[data-position]').html(Utils.formatTime(position));
    this.$('[data-duration]').html(Utils.formatTime(duration));
  },
  seek: function(event) {
    var $element = this.$el.find('div.seekbar[data-seekbar]');
    var offsetX = event.pageX - $element.offset().left;
    var pos = offsetX / $element.width() * 100;
    pos = Math.min(100, Math.max(pos, 0));
    this.container.setCurrentTime(pos);
  },
  show: function(event) {
    var timeout = 2000;
    if (event.clientX !== this.lastMouseX && event.clientY !== this.lastMouseY) {
      if (this.hideId) {
        clearTimeout(this.hideId);
      }
      this.trigger('mediacontrol:show');
      this.$el.fadeIn();
      this.hideId = setTimeout(function() {
        this.hide();
      }.bind(this), timeout);
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    }
  },
  hide: function() {
    var timeout = 2000;
    if (this.hideId) {
      clearTimeout(this.hideId);
    }
    if (!this.draggingVolumeBar && !this.draggingSeekBar && this.$el.find('[data-controls]:hover').length === 0) {
      this.trigger('mediacontrol:hide');
      this.$el.fadeOut();
    } else {
      this.hideId = setTimeout(function() {
        this.hide();
      }.bind(this), timeout);
    }
  },
  settingsUpdate: function() {
    console.log('settings update!');
    this.render();
  },
  render: function() {
    var timeout = 1000;
    var style = Styler.getStyleFor('media_control');
    var settings = this.container.settings || this.defaultSettings;
    this.$el.html(this.template({settings: settings}));
    this.$el.append(style);
    this.$el.find('.volume-bar-wrapper[data-volume]').hide();
    this.$el.find('button[data-playpause]').addClass('paused');
    this.$el.find('button[data-playstop]').addClass('stopped');
    this.$el.find('div.volume-current[data-volume]').css({height: 100 + '%'});
    this.$el.find('div.seekbar-position[data-seekbar]').css({width: 0});
    this.$el.find('div.seekbar-loaded[data-seekbar]').css({width: 0});
    if (this.params.autoPlay) {
      this.togglePlayPause();
      this.togglePlayStop();
    }
    this.changeTogglePlay();
    this.hideId = setTimeout(function() {
      this.hide();
    }.bind(this), timeout);
    return this;
  }
});
