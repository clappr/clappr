// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object');
var $ = require("jquery");
var _ = require('underscore');

var PipPlugin = BaseObject.extend({
  initialize: function(core) {
    this.core = core;
    this.masterContainer = core.containers[0];
    if (core.containers.length === 2) {
      this.pipContainer = core.containers[1];
      this.pipContainer.setStyle({width: "30%", height: "30%", "z-index": 20, bottom: "7px", right: "7px"});
    }
  },
  addPip: function(source) {
    this.discardPip();
    this.core.playbackHandler.createContainer(source, this.addPipCallback.bind(this));
  },
  addPipCallback: function(container) {
    this.pipContainer = container;
    this.core.$el.append(this.pipContainer.render().el);
    console.log("listened to container ready");
    this.pipContainer.setVolume(0);
    this.pipContainer.play();
    this.pipContainer.getPluginByName('watermark').disable();
    this.pipContainer.setStyle({width: "30%", height: "30%", "z-index": 20, bottom: "7px", right: "7px"});
    this.core.containers.push(this.pipContainer);
    this.core.$el.append(this.pipContainer.render().el);
  },
  discardPip: function() {
    if (this.pipContainer) {
      this.pipContainer.destroy();
      this.discardContainer(this.pipContainer);
      delete this.pipContainer;
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
    this.pipContainer.animate({width: "30%", height: "30%", "z-index": 20, bottom: "7px", right: "7px"}, 400);
    this.core.containers.splice(0, 0, this.masterContainer);
  },
  discardContainer: function(container) {
    this.core.containers = _.without(this.core.containers, _.findWhere(this.core.containers, container));
  },
  pipToMaster: function() {
    if (this.pipContainer) {
      this.pipContainer.animate({width: "100%", height: "100%", "z-index": 20, bottom: "0px", right: "0px"}, 400);
      setTimeout(function() {
        this.pipContainer.setVolume(100);
        this.pipContainer.getPluginByName('watermark').enable();
        this.masterContainer.destroy();
        this.discardContainer(this.masterContainer);
        delete this.masterContainer;
        this.masterContainer = this.pipContainer;
        this.masterContainer.setStyle({"z-index": 1});
        delete this.pipContainer;
      }.bind(this), 400);
    }
  }
});

module.exports = PipPlugin;
