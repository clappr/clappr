// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object');
var $ = require("jquery");

var PipPlugin = BaseObject.extend({
  initialize: function(core) {
    this.core = core;
    this.masterContainer = this.core.containers[0];
    this.pipContainer = this.core.containers[1];
    this.pipContainer.setStyle({width: "30%", height: "30%", "z-index": 4, bottom: "7px", right: "7px"});
    this.listenTo(this.pipContainer, 'container:click', this.onClick);
    this.listenTo(this.masterContainer, 'container:hover', this.masterHover);
    this.listenTo(this.pipContainer, 'container:hover', this.pipHover);
    this.pipState = 'idle';
  },
  masterHover: function() {
    console.log("master hover");
    this.pipContainer.setVolume(0);
    this.masterContainer.setVolume(100);
  },
  pipHover: function() {
    this.masterContainer.setVolume(0);
    this.pipContainer.setVolume(100);
  },
  onClick: function() {
    if (this.pipState === 'idle') {
      this.pipContainer.play();
      this.pipState = 'playing';
    } else if (this.pipState === 'playing') {
      this.switchContainers();
    }
  },
  switchContainers: function() {
    this.pipContainer.animate({width: "100%", height: "100%", bottom: "0px", right: "0px"}, 500);
    setTimeout(this.endAnimation.bind(this), 500);

  },
  endAnimation: function() {
    this.masterContainer.setStyle({width: "30%", height: "30%", "z-index": 4, bottom: "7px", right: "7px"});
    this.pipContainer.setStyle({"z-index": 1});

    this.stopListening(this.pipContainer, 'container:click', this.onClick);
    this.stopListening(this.masterContainer, 'container:hover', this.masterHover);
    this.stopListening(this.pipContainer, 'container:click', this.pipHover);

    var tmp = this.pipContainer;
    this.pipContainer = this.masterContainer;
    this.masterContainer = tmp;

    this.listenTo(this.pipContainer, 'container:click', this.onClick);
    this.listenTo(this.masterContainer, 'container:hover', this.masterHover);
    this.listenTo(this.pipContainer, 'container:hover', this.pipHover);

  }
});

module.exports = PipPlugin;
