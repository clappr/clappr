// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Core is responsible to manage Containers, the mediator, MediaControl
 * and the player state.
 */

var _ = require('underscore');
var $ = require('jquery');

var UIObject = require('../../base/ui_object');
var ContainerFactory = require('../container_factory');
var Fullscreen = require('../../base/utils').Fullscreen;
var GlobalPluginsHandler = require('../global_plugins_handler');
var Loader = require('../loader');
var Styler = require('../../base/styler');
var MediaControl = require('../media_control');

var Core = UIObject.extend({
  events: {
    'webkitfullscreenchange': 'exit',
    'mousemove': 'showMediaControl'
  },
  attributes: {
    'data-player': ''
  },
  initialize: function(params) {
    this.params = params;
    this.setupExternalInterface();
    this.params.displayType || (this.params.displayType = 'pip');
    this.parentElement = params.parentElement;
    this.loader = new Loader(params);
    this.containerFactory = new ContainerFactory(params, this.loader);
    this.containerFactory.createContainers(this.onContainersCreated.bind(this));
    if (this.params.width) {
      this.$el.css({ width: this.params.width });
    }
    if (this.params.height) {
      this.$el.css({ height: this.params.height });
    }
    //FIXME fullscreen api sucks
    window['document'].addEventListener('mozfullscreenchange', this.exit.bind(this));
  },
  setupExternalInterface: function() {
    this.params.player.destroy = this.destroy.bind(this);
  },
  load: function(params) {
    _(this.containers).each(function(container) {
      container.destroy();
    });
    this.containerFactory.params = _(this.params).extend(params);
    this.containerFactory.createContainers(this.onContainersCreated.bind(this));
  },
  destroy: function() {
    _(this.containers).each(function(container) {
      container.destroy();
    });
    this.$el.remove();
  },
  exit: function() {
    if(!Fullscreen.isFullscreen()) {
      this.$el.removeClass('fullscreen');
    }
    this.mediaControl.show();
  },
  onContainersCreated: function(containers) {
    this.containers = containers;
    this.getCurrentContainer().on('container:ready', function() {
      this.globalPluginsHandler = new GlobalPluginsHandler(this);
      this.globalPluginsHandler.loadPlugins();
    }.bind(this));
    this.createMediaControl(this.getCurrentContainer());
    this.render();
    this.$el.appendTo(this.parentElement);
  },
  createMediaControl: function(container) {
    var params = _.extend({container: container}, this.params);
    this.mediaControl = new MediaControl(_.extend({container: container}, this.params));
    this.listenTo(this.mediaControl, 'mediacontrol:fullscreen', this.toggleFullscreen);
    this.listenTo(this.mediaControl, 'mediacontrol:show', this.onMediaControlShow.bind(this, true));
    this.listenTo(this.mediaControl, 'mediacontrol:hide', this.onMediaControlShow.bind(this, false));
  },
  getCurrentContainer: function() {
    return this.containers[0];
  },
  toggleFullscreen: function() {
    if (!Fullscreen.isFullscreen()) {
      Fullscreen.requestFullscreen(this.el);
      this.$el.addClass('fullscreen');
    } else {
      Fullscreen.cancelFullscreen();

      this.$el.removeClass('fullscreen nocursor');
    }
    this.mediaControl.show();
  },
  showMediaControl: function(event) {
    this.mediaControl.show(event);
  },
  onMediaControlShow: function(showing) {
    if (showing)
      this.$el.removeClass('nocursor');
    else if (!this.mediaControl.disabled)
      this.$el.addClass('nocursor');
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
