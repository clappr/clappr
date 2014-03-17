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
var GlobalPluginsHandler = require('../global_plugins_handler');
var Loader = require('../loader');
var Styler = require('../../base/styler');
var MediaControl = require('../media_control');

var Core = UIObject.extend({
  events: {
    'webkitfullscreenchange': 'exit',
    'mouseover[data-controls]': 'showMediaControl',
    'mouseleave[data-controls]': 'hideMediaControl',
    'mousemove': 'mediaControlTimeout'
  },
  attributes: {
    'data-player': ''
  },
  initialize: function(params) {
    this.params = params;
    this.parentElement = params.parentElement;
    this.loader = new Loader(params);
    this.playbackHandler = new PlaybackHandler(params, this.loader);
    this.playbackHandler.createContainers(this.onContainersCreated.bind(this));
  },
  load: function(params) {
    _(this.containers).each(function(container) {
      container.destroy();
    });
    this.playbackHandler.params = _(this.params).extend(params);
    this.playbackHandler.createContainers(this.onContainersCreated.bind(this));
  },
  exit: function() {
    if(!document.webkitIsFullScreen) {
      this.$el.removeClass('fullscreen');
    }
  },
  onContainersCreated: function(containers) {
    this.containers = containers;
    this.createMediaControl(this.getCurrentContainer());
    this.render();
    this.$el.appendTo(this.parentElement);
    this.globalPluginsHandler = new GlobalPluginsHandler(this);
    this.globalPluginsHandler.loadPlugins();
  },
  createMediaControl: function(container) {
    this.mediaControl = new MediaControl({container: container});
    this.listenTo(this.mediaControl, 'mediacontrol:fullscreen', this.toggleFullscreen);
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
      this.$el.removeClass('fullscreen nocursor');
    }
    setTimeout(this.hideMediaControl.bind(this), 1000);
  },
  showMediaControl: function() {
    if(this.hideId) {
      clearTimeout(this.hideId);
    }
    this.mediaControl.fadeIn();
    this.$el.removeClass('nocursor');
  },
  hideMediaControl: function() {
    if(this.hideId) {
      clearTimeout(this.hideId);
    }
    this.hideId = setTimeout(function() {
      this.mediaControl.fadeOut();
      this.$el.addClass('nocursor');
    }.bind(this), 1000);
  },
  mediaControlTimeout: function() {
    if(this.hideId) {
      clearTimeout(this.hideId);
      this.showMediaControl();
    }
    if (this.$el.find('[data-controls]:hover').length === 0) {
      this.hideId = setTimeout(function() {
        this.hideMediaControl();
      }.bind(this), 1200);
    }
  },
  render: function() {
    var style = Styler.getStyleFor('core');
    this.$el.html('');
    this.$el.append(style);

    _.each(this.containers, function(container) {
      this.$el.append(container.render().el);
    }, this);

    this.$el.append(this.mediaControl.render().el);
    return this;
  }
});

module.exports = Core;
