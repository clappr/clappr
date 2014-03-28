// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object');
var $ = require("jquery");
var _ = require('underscore');

var PipPlugin = BaseObject.extend({
  initialize: function(core) {
    this.core = core;
    this.pipStyle = {width: "24%", height: "24%", "z-index": 20, bottom: "47px", right: "7px",
                     "border-width": "3px", "border-style": "solid", "border-color": "rgba(255,255,255, .3)",
                     "background-clip": "padding-box", "-webkit-background-clip": "padding-box"};
    this.masterStyle = {width: "100%", height: "100%", bottom: "0px", right: "0px", border: "none"};
    this.masterContainer = core.containers[0];
    if (core.containers.length === 2) {
      this.pipContainer = core.containers[1];
      this.pipContainer.setStyle(this.pipStyle);
    }
    this.setupApi();
  },
  setupApi: function() {
    //FIXME we need to figure out how to manage player API (issue #51)
    window.WP3.addPip = this.addPip.bind(this);
    window.WP3.discardPip = this.discardPip.bind(this);
    window.WP3.addMaster = this.addMaster.bind(this);
    window.WP3.pipToMaster = this.pipToMaster.bind(this);
  },
  addPip: function(source) {
    this.discardPip();
    this.pipContainer = this.core.playbackHandler.createContainer(source, this.addPipCallback.bind(this));
    if (this.pipContainer.hasPlugin('hls_playback')) {
      // html5 players dispatches on:ready instantly, causing this style to be set after addPipCallback.
      // For flash players, we need to put it behind everything until flash dispatch on:ready.
      this.pipContainer.setStyle({'z-index': -1});
    }
    this.core.$el.append(this.pipContainer.render().el);
  },
  addPipCallback: function(container) {
    window.pipContainer = container;
    container.setVolume(0);
    container.getPluginByName('watermark').disable();
    container.play();
    container.setStyle(this.pipStyle);
    this.core.containers.push(container);
  },
  discardPip: function() {
    if (this.pipContainer) {
      this.discardContainer(this.pipContainer);
      delete this.pipContainer;
    }
  },
  discardMaster: function() {
    if (this.masterContainer) {
      this.discardContainer(this.masterContainer);
      delete this.masterContainer;
    }
  },
  addMaster: function(source) {
    if (this.masterContainer) {
      this.tmpContainer = this.masterContainer;
      this.tmpContainer.setStyle({'z-index': 20});
      this.core.playbackHandler.createContainer(source, this.addMasterCallback.bind(this));
    }
  },
  addMasterCallback: function(container) {
    this.masterContainer = container;
    this.core.$el.append(this.masterContainer.render().el);
    this.masterContainer.play();
    this.discardPip();
    this.pipContainer = this.tmpContainer;
    delete this.tmpContainer;
    this.pipContainer.setVolume(0);
    this.pipContainer.getPluginByName('watermark').disable();
    if (this.pipContainer.hasPlugin('hls_playback')) { //flash breaks on animate
      this.pipContainer.setStyle(this.pipStyle);
    } else {
      this.pipContainer.animate(this.pipStyle, 400);
      setTimeout(function() { this.pipContainer.setStyle(this.pipStyle); }.bind(this), 400); //workaround to persist borders after the animation
    }
    this.core.containers.splice(0, 0, this.masterContainer);
  },
  discardContainer: function(container) {
    if (container.hasPlugin('html5_video_playback')) {
      container.stop();
      container.getPluginByName('html5_video_playback').el.src = '';
    }
    container.destroy();
    this.core.containers = _.without(this.core.containers, _.findWhere(this.core.containers, container));
  },
  pipToMaster: function() {
    if (this.pipContainer) {
      this.pipContainer.animate(this.masterStyle, 400);
      setTimeout(this.afterPipToMaster.bind(this), 400);
    }
  },
  afterPipToMaster: function() {
    this.pipContainer.setVolume(100);
    this.pipContainer.getPluginByName('watermark').enable();
    this.discardMaster();
    this.masterContainer = this.pipContainer;
    this.masterContainer.setStyle({"z-index": 1});
    delete this.pipContainer;
  }
});

module.exports = PipPlugin;
