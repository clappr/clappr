// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The MediaControl is responsible for displaying the Player controls.
 */

var _ = require('underscore');
var UIObject = require('../../base/ui_object');

module.exports = MediaControl = UIObject.extend({
  events: {
    'click [data-play]': 'play',
    'click [data-pause]': 'pause',
    'click [data-stop]': 'stop',
    'click [data-fullscreen]': 'toggleFullscreen',
    'click [data-seekbar]': 'seek',
    'click [data-volume]': 'volume'
  },
  //should we use a default template? if so, should it be an external file or inline?
  template: _.template('<% _.each(settings, function(setting) { %> <% if(setting === "seekbar" || setting === "volume") { %> <input type="range" value="0" data-<%= setting %> /><% } else { %> <button data-<%= setting %>><%= setting %></button> <% }}) %>'),
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
    this.container.setVolume(this.$('[data-volume]').val());
  },
  toggleFullscreen: function() {
    this.trigger('mediacontrol:fullscreen');
  },
  setContainer: function(container) {
    this.stopListening(this.container);
    this.container = container;
    this.listenTo(this.container, 'container:timeupdate', this.updateSeekBar);
  },
  updateSeekBar: function(time) {
    this.$('[data-seekbar]').val(time);
  },
  seek: function() {
    this.container.setCurrentTime(this.$('[data-seekbar]').val());
  },
  render: function() {
    var settings = this.container.settings || this.defaultSettings;
    this.$el.html(this.template({settings: settings}));
    this.$('[data-volume]').val(100);
    return this;
  }
});
