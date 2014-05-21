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
    window.$ = $;
    this.defer = $.Deferred();
    this.defer.promise(this);
    this.plugins = [];
    this.containers = [];
    this.params = params;
    //this.setupExternalInterface();
    this.params.displayType || (this.params.displayType = 'pip');
    this.parentElement = params.parentElement;
    this.loader = new Loader(params);
    this.containerFactory = new ContainerFactory(params, this.loader);
    this.containerFactory
      .createContainers()
      .then(this.setupContainers.bind(this))
      .then(this.resolveOnContainersReady.bind(this));
    this.updateSize();
    //FIXME fullscreen api sucks
    window['document'].addEventListener('mozfullscreenchange', this.exit.bind(this));
  },
  updateSize: function() {
   if(Fullscreen.isFullscreen()) {
      this.$el.addClass('fullscreen');
      this.$el.removeAttr('style');
    } else {
      if (this.params.width) {
        this.$el.css({ width: this.params.width });
      }
      if (this.params.height) {
        this.$el.css({ height: this.params.height });
      }
      this.$el.removeClass('fullscreen');
    }
  },
  resolveOnContainersReady: function(containers) {
    $.when.apply($, containers).done(function() {
      this.defer.resolve(this);
    }.bind(this));
  },
  addPlugin: function(plugin) {
    this.plugins.push(plugin);
  },
  hasPlugin: function(name) {
    return !!this.getPlugin(name);
  },
  getPlugin: function(name) {
    return _(this.plugins).find(function(plugin) { return plugin.name === name });
  },
  load: function(params) {
    _(this.containers).each(function(container) {
      container.destroy();
    });
    this.containerFactory.params = _(this.params).extend(params);
    this.containerFactory.createContainers()
      .then(this.setupContainers.bind(this));
  },
  destroy: function() {
    _(this.containers).each(function(container) {
      container.destroy();
    });
    this.$el.remove();
  },
  exit: function() {
    this.updateSize();
    this.mediaControl.show();
  },
  setMediaControlContainer: function(container) {
    this.mediaControl.setContainer(container);
    this.mediaControl.render();
  },
  disableMediaControl: function() {
    this.mediaControl.disable();
    this.$el.removeClass('nocursor');
  },
  enableMediaControl: function() {
    this.mediaControl.enable();
  },
  removeContainer: function(container) {
    console.log('container being removed');
    this.stopListening(container);
    this.containers = _.without(this.containers, container);
  },
  appendContainer: function(container) {
    this.listenTo(container, 'container:destroyed', this.removeContainer);
    this.$el.append(container.render().el);
    this.containers.push(container);
  },
  prependContainer: function(container) {
    this.listenTo(container, 'container:destroyed', this.removeContainer);
    this.$el.append(container.render().el);
    this.containers.unshift(container);
  },
  setupContainers: function(containers) {
    console.log('setupContainers');
    _.map(containers, this.appendContainer, this);
    this.createMediaControl(this.getCurrentContainer());
    this.render();
    this.$el.appendTo(this.parentElement);
    return containers;
  },
  createContainer: function(source) {
    var container = this.containerFactory.createContainer(source);
    this.appendContainer(container);
    return container;
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
    //FIXME
    //this.$el.empty();
    this.$el.append(style);

    this.$el.append(this.mediaControl.render().el);
    var div = $('<div>').css({
      position: 'absolute',
      width: '100%',
      height: '100%',
      'z-index': 998
    });
    this.$el.append(div);
    return this;
  }
});

module.exports = Core;
