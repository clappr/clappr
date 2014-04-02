// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The MediaControl is responsible for displaying the Player controls.
 */

var _ = require('underscore');
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
    'click input[data-volume]': 'volume',
    'mouseover span[data-volume]': 'showVolumeBar',
    'mouseover input[data-volume]': 'keepVolumeBar',
    'mouseleave [data-volume]': 'hideVolumeBar'
  },
  template: JST.media_control,
  initialize: function(params) {
    this.params = params;
    this.container = params.container;
    this.listenTo(this.container, 'container:timeupdate', this.updateSeekBar);
    this.listenTo(this.container, 'container:play', this.changeTogglePlay);
    this.defaultSettings = {
      left: ['play', 'stop', 'pause'],
      right: ['volume'],
      default: ['position', 'seekbar', 'duration']
    };
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
    var playPauseButton = this.$el.find('button[data-playpause]');
    playPauseButton.toggleClass('playing paused');
    var playStopButton = this.$el.find('button[data-playstop]');
    playStopButton.toggleClass('playing stopped');
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
  volume: function() {
    this.container.setVolume(this.$el.find('input[data-volume]').val());
  },
  toggleFullscreen: function() {
    this.trigger('mediacontrol:fullscreen');
  },
  setContainer: function(container) {
    this.stopListening(this.container);
    this.container = container;
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
    this.listenTo(this.container, 'container:timeupdate', this.updateSeekBar);
  },
  showVolumeBar: function() {
    if(this.hideId) {
      clearTimeout(this.hideId);
    }
    this.$el.find('input[data-volume]').show();
  },
  hideVolumeBar: function() {
    if(this.hideId) {
      clearTimeout(this.hideId);
    }
    this.hideId = setTimeout(function() {
      this.$el.find('input[data-volume]').hide();
    }.bind(this), 1500);
  },
  keepVolumeBar: function() {
    if(this.hideId) {
      clearTimeout(this.hideId);
    }
  },
  ended: function() {
    this.togglePlayStop();
    this.togglePlayPause();
  },
  updateSeekBar: function(position, duration) {
    var seekbarValue = (100 / duration) * position;
    this.$('div.seekbar-position[data-seekbar]').css({ width: seekbarValue + '%' });
    this.$('[data-position]').html(Utils.formatTime(position));
    this.$('[data-duration]').html(Utils.formatTime(duration));
  },
  seek: function() {
    var $element = this.$el.find('div.seekbar[data-seekbar]');
    var offsetX = event.pageX - $element.offset().left;
    var pos = offsetX / $element.width() * 100;
    pos = Math.min(100, Math.max(pos, 0));
    this.container.setCurrentTime(pos);
  },
  fadeIn: function() {
    this.trigger('mediacontrol:show');
    this.$el.fadeIn();
  },
  fadeOut: function() {
    this.trigger('mediacontrol:hide');
    this.$el.fadeOut();
  },
  render: function() {
    var style = Styler.getStyleFor('media_control');
    var settings = this.container.settings || this.defaultSettings;
    this.$el.html(this.template({settings: settings}));
    this.$el.append(style);
    this.$el.find('input[data-volume]').val(100);
    this.$el.find('input[data-volume]').hide();
    this.$el.find('button[data-playpause]').addClass('paused');
    this.$el.find('button[data-playstop]').addClass('stopped');
    this.$el.find('div.seekbar-position[data-seekbar]').css({width: 0});
    this.$el.find('div.seekbar-loaded[data-seekbar]').css({width: 0});
    if (this.params.autoPlay) {
      this.togglePlayPause();
      this.togglePlayStop();
    }
    return this;
  }
});
