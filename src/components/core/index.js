// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Core is responsible to manage Containers, the mediator, MediaControl
 * and the player state.
 */

var UIObject = require('../../base/ui_object');
var PlaybackHandler = require('../playback_handler');
var Styler = require('../../base/styler');
var MediaControl = require('../media_control');

var Core = UIObject.extend({
  events: {
    'webkitfullscreenchange': 'exit',
    'mouseover': 'showMediaControl',
    'mouseleave': 'hideMediaControl',
    'mousemove': 'mediaControlTimeout'
  },
  attributes: {
    'data-player': ''
  },
  initialize: function(params) {
    this.parentElement = params.parentElement;
    this.playbackHandler = new PlaybackHandler(params);
    this.playbackHandler.createContainers(this.onContainersCreated.bind(this));
  },
  exit: function() {
    if(!document.webkitIsFullScreen) {
      this.$el.css({height: '360px', width: '640px'});
    }
  },
  onContainersCreated: function(containers) {
    this.containers = containers;
    this.createMediaControl(this.getCurrentContainer());
    this.render();
    this.$el.appendTo(this.parentElement);
  },
  createMediaControl: function(container) {
    this.mediaControl = new MediaControl({container: container});
    this.listenTo(this.mediaControl, 'mediacontrol:fullscreen', this.fullscreen);
  },
  getCurrentContainer: function() {
    return this.containers[0];
  },
  fullscreen: function() {
    this.el.webkitRequestFullscreen();
    this.$el.css({height: '100%', width: '100%'});
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
    this.$el.append(this.getCurrentContainer().render().el);
    this.$el.append(this.mediaControl.render().el);
    return this;
  }
});

module.exports = Core;
