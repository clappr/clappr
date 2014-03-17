// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object');
var $ = require("jquery");

var PipPlugin = BaseObject.extend({
  initialize: function(mediaControl, containers) {
    this.masterContainer = containers[0];
    this.pipContainer = containers[1];

    this.pipContainer.setStyle({width: "30%", height: "30%", zindex: 10001, bottom: "7px", right: "7px"});
    this.listenTo(this.pipContainer, 'container:click', this.onClick);
    this.listenTo(this.masterContainer, 'container:hover', this.masterHover);
    this.listenTo(this.pipContainer, 'container:hover', this.pipHover);
  },
  masterHover: function() {
    this.pipContainer.setVolume(0);
    this.masterContainer.setVolume(100);
  },
  pipHover: function() {
    this.masterContainer.setVolume(0);
    this.pipContainer.setVolume(100);
  },
  onClick: function() {
    this.pipContainer.play();
  }
});

module.exports = PipPlugin;
