// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Core is responsible to manage Containers, the mediator, MediaControl
 * and the player state.
 */

var _ = require('underscore');
var UIObject = require('../../base/ui_object');
var PlaybackHandler = require('../playback_handler');
var Styler = require('../../base/styler');
var MediaControl = require('../media_control');

var PipPlugin = require("../../plugins/pip");

var Core = UIObject.extend({
  events: {
    'mouseover': 'showMediaControl',
    'mouseleave': 'hideMediaControl',
    'mousemove': 'mediaControlTimeout'
  },
  attributes: {
    'data-player': ''
  },
  initialize: function(params) {
    this.params = params;
    this.parentElement = params.parentElement;
    this.playbackHandler = new PlaybackHandler(params);
    this.playbackHandler.createContainers(this.onContainersCreated.bind(this));
  },
  load: function(videoId) {
    _(this.containers).each(function(container) {
      container.destroy();
    });
    this.params.videoId = videoId;
    this.playbackHandler.createContainers(this.onContainersCreated.bind(this));
  },
  onContainersCreated: function(containers) {
    this.containers = containers;
    this.createMediaControl(this.getCurrentContainer());
    this.render();
    this.$el.appendTo(this.parentElement);
    this.loadPlayerPlugins(this.params);
  },
  createMediaControl: function(container) {
    this.mediaControl = new MediaControl({container: container});
    this.listenTo(this.mediaControl, 'mediacontrol:fullscreen', this.toggleFullscreen);
  },
  loadPlayerPlugins: function(params) {
    _.each(params, function(value, key) {
      if (key === 'pip') {
        new PipPlugin(this.mediaControl, this.containers);
      }
    }, this);
  },
  getCurrentContainer: function() {
    return this.containers[0];
  },
  toggleFullscreen: function() {
    if (!document.webkitIsFullScreen) {
      this.el.webkitRequestFullscreen();
      this.$el.addClass('fullscreen');
    } else {
      document.webkitCancelFullScreen();
      this.$el.removeClass('fullscreen');
    }
  },
  showMediaControl: function() {
    if(this.hideId) {
      clearTimeout(this.hideId);
    }
    this.mediaControl.fadeIn();
  },
  hideMediaControl: function() {
    if(this.hideId) {
      clearTimeout(this.hideId);
    }
    this.hideId = setTimeout(function() {
      this.mediaControl.fadeOut();
    }.bind(this), 2000);
  },
  mediaControlTimeout: function() {
    if(this.id) {
      clearTimeout(this.id);
      this.showMediaControl();
    }
    this.id = setTimeout(function() {
      this.hideMediaControl();
    }.bind(this), 3000);
  },
  render: function() {
    var style = Styler.getStyleFor('core');
    this.$el.append(style);

    _.each(this.containers, function(container) {
      this.$el.append(container.render().el);
    }, this);

    this.$el.append(this.mediaControl.render().el);
    return this;
  }
});

module.exports = Core;
