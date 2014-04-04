// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object');
var $ = require("jquery");
var _ = require('underscore');

var PipPlugin = BaseObject.extend({
  initialize: function(core) {
    this.core = core;
    this.pipStyle = {width: "24%", height: "24%", "z-index": 20, bottom: "7px", right: "7px",
                     "border-width": "3px", "border-style": "solid", "border-color": "rgba(255,255,255, .3)",
                     "background-clip": "padding-box", "-webkit-background-clip": "padding-box", "cursor": "pointer"};
    this.masterStyle = {width: "100%", height: "100%", bottom: "0px", right: "0px", border: "none", "cursor" : "default"};
    this.masterContainer = core.containers[0];
    if (core.containers.length === 2) {
      this.pipContainer = core.containers[1];
      this.pipContainer.setStyle(this.pipStyle);
      if (!this.pipContainer.isReady) {
        this.pipContainer.on('container:ready', function() {
          this.pipContainer.play();
          this.pipContainer.setVolume(0);
        }.bind(this));
      } else {
        this.pipContainer.play();
        this.pipContainer.setVolume(0);
      }
      this.listenToPipClick();
      this.core.mediaControl.setContainer(this.masterContainer);
      this.core.mediaControl.render();
    }
    this.listenTo(this.core.mediaControl, 'mediacontrol:show', this.onMediaControlShow);
    this.listenTo(this.core.mediaControl, 'mediacontrol:hide', this.onMediaControlHide);
  },
  getExternalInterface: function() {
    return {
      addPip: this.addPip,
      discardPip: this.discardPip,
      addMaster: this.addMaster,
      pipToMaster: this.pipToMaster
    };
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
    this.pipContainer = container;
    this.pipContainer.on('container:ready', function() {
      this.pipContainer.setVolume(0);
      this.pipContainer.getPluginByName('watermark').disable();
      this.pipContainer.play();
      this.pipContainer.setStyle(this.pipStyle);
      this.core.containers[1] = this.pipContainer;
      this.stopListening(this.pipContainer);
      this.listenToPipClick();
    }.bind(this));
  },
  discardPip: function() {
    if (this.pipContainer) {
      this.stopListening(this.pipContainer);
      this.discardContainer(this.pipContainer);
      this.pipContainer = undefined;
    }
  },
  discardMaster: function() {
    if (this.masterContainer) {
      this.discardContainer(this.masterContainer);
      this.masterContainer = undefined;
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
    this.masterContainer.on('container:ready', function() {
      this.discardPip();
      this.masterContainer.play();
      this.pipContainer = this.tmpContainer;
      this.tmpContainer = undefined;
      this.pipContainer.setVolume(0);
      this.pipContainer.getPluginByName('watermark').disable();
      if (this.pipContainer.hasPlugin('hls_playback')) { //flash breaks on animate
        this.pipContainer.setStyle(this.pipStyle);
      } else {
        this.pipContainer.animate(this.pipStyle, {complete: function() { this.pipContainer.setStyle(this.pipStyle); }.bind(this)});
      }
      this.core.mediaControl.setContainer(this.masterContainer);
      this.core.mediaControl.render();
      this.listenToPipClick();
    }.bind(this));
    this.core.$el.append(this.masterContainer.render().el);
    this.core.containers.splice(0, 0, this.masterContainer);
    this.listenToPipClick();
  },
  listenToPipClick: function() {
    if (this.pipContainer) {
      this.stopListening(this.pipContainer);
      this.listenTo(this.pipContainer, "container:click", this.pipToMaster.bind(this));
    }
  },
  discardContainer: function(container) {
    container.destroy();
    this.core.containers = _.without(this.core.containers, _.findWhere(this.core.containers, container));
  },
  pipToMaster: function() {
    if (this.pipContainer) {
      this.pipContainer.animate(this.masterStyle, {complete: this.pipToMasterCallback.bind(this)});
    }
  },
  pipToMasterCallback: function() {
    this.discardMaster();
    this.pipContainer.setVolume(100);
    this.pipContainer.getPluginByName('watermark').enable();
    this.masterContainer = this.pipContainer;
    this.masterContainer.setStyle({"z-index": 1});
    this.pipContainer = undefined;
    this.core.mediaControl.setContainer(this.masterContainer);
    this.core.mediaControl.render();
  },
  onMediaControlShow: function () {
    if (!this.pipContainer || this.pipContainer.$el.is(':animated')) return;
    this.pipContainer.animate({ bottom: 47 }, 400);
  },
  onMediaControlHide: function () {
    if (!this.pipContainer || this.pipContainer.$el.is(':animated')) return;
    this.pipContainer.animate({ bottom: 7 }, 400);
  }
});

module.exports = PipPlugin;
