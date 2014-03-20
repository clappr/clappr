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
    container.setStyle({width: "30%", height: "30%", "z-index": 2, bottom: "7px", right: "7px"});
  },
  addPip: function(source) {
    this.discardPip();
    this.pipContainer = this.core.playbackHandler.createContainer(source);
    this.setPipStyle(this.pipContainer);
    this.core.containers.push(this.pipContainer);
  },
  addMaster: function(source) {
    this.discardPip();
    this.pipContainer = this.masterContainer;
    this.setPipStyle(this.pipContainer);
    this.masterContainer = this.core.playbackHandler.createContainer(source);
    this.core.containers.push(this.masterContainer);
  },
  discardPip: function() {
    if (this.pipContainer) {
      if (this.core.containers.length === 2) {
        this.core.containers = _.without(this.core.containers, _.findWhere(this.core.containers, this.pipContainer));
      }
      this.pipContainer.destroy();
      delete this.pipContainer;
    }
  },
});

module.exports = PipPlugin;
