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

module.exports = MediaControl = UIObject.extend({
  attributes: {
    'data-media-control': ''
  },
  events: {
    'click [data-play]': 'play',
    'click [data-pause]': 'pause',
    'click [data-stop]': 'stop',
    'click [data-fullscreen]': 'toggleFullscreen',
    'click [data-seekbar]': 'seek',
    'click input[data-volume]': 'volume',
    'mouseover span[data-volume]': 'showVolumeBar',
    'mouseover input[data-volume]': 'keepVolumeBar',
    'mouseleave [data-volume]': 'hideVolumeBar'
  },
  template: JST.media_control,
  initialize: function() {
    this.listenTo(this.container, 'container:timeupdate', this.updateSeekBar);
    this.defaultSettings = ['play', 'stop', 'pause', 'seekbar', 'volume'];
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
  volume: function() {
    this.container.setVolume(this.$el.find('input[data-volume]').val());
  },
  toggleFullscreen: function() {
    this.trigger('mediacontrol:fullscreen');
  },
  setContainer: function(container) {
    this.stopListening(this.container);
    this.container = container;
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
    console.log('hover');
    if(this.hideId) {
      clearTimeout(this.hideId);
    }
  },
  updateSeekBar: function(time) {
    this.$('[data-seekbar]').val(time);
  },
  seek: function() {
    this.container.setCurrentTime(this.$('[data-seekbar]').val());
  },
  fadeIn: function() {
    this.$el.fadeIn();
  },
  fadeOut: function() {
    this.$el.fadeOut();
  },
  render: function() {
    var style = Styler.getStyleFor('media_control');
    var settings = this.container.settings || this.defaultSettings;
    this.$el.html(this.template({settings: settings}));
    this.$el.append(style);
    this.$el.find('input[data-volume]').val(100);
    this.$el.find('input[data-volume]').hide();
    return this;
  }
});
