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
      this.setPipStyle(this.pipContainer);
    }
  },
  setPipStyle: function(container) {
    container.setStyle({width: "30%", height: "30%", "z-index": 20, bottom: "7px", right: "7px"});
  },
  setMasterStyle: function(container) {
    container.setStyle({width: "100%", height: "100%", "z-index": 1, bottom: "0px", right: "0px"});
  },
  addPip: function(source) {
    this.discardPip();
    this.pipContainer = this.core.playbackHandler.createContainer(source);
    this.setPipStyle(this.pipContainer);
    this.core.containers.push(this.pipContainer);
    this.core.$el.append(this.pipContainer.render().el);
  },
  addMaster: function(source) {
    if (this.pipContainer) {
      this.discardPip();
    }
    if (this.masterContainer) {
      this.pipContainer = this.masterContainer;
      this.setPipStyle(this.pipContainer);
    }
    this.masterContainer = this.core.playbackHandler.createContainer(source);
    this.core.containers.push(this.masterContainer);
    this.core.$el.append(this.masterContainer.render().el);
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
  discardContainer: function(container) {
    this.core.containers = _.without(this.core.containers, _.findWhere(this.core.containers, container));
    container.destroy();
  },
  masterToPip: function() {
    this.discardPip();
    this.pipContainer = this.masterContainer;
    this.setPipStyle(this.pipContainer);
    delete this.masterContainer;
  },
  pipToMaster: function() {
    this.discardMaster();
    this.masterContainer = this.pipContainer;
    this.setMasterStyle(this.masterContainer);
    delete this.pipContainer;
  }

});

module.exports = PipPlugin;
