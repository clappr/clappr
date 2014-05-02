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
      this.pipContainer.play();
      this.pipContainer.setVolume(0);
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
      addMasterContainer: this.addMasterContainer,
      pipToMaster: this.pipToMaster,
      hasPip: this.hasPip
    };
  },
  hasPip: function() {
    return !!this.pipContainer;
  },
  addPip: function(source) {
    this.discardPip();
    this.core.createContainer(source).then(this.addPipCallback.bind(this));
  },
  addPipCallback: function(container) {
    this.pipContainer = _(container).isArray() ? container[0] : container;
    if (this.pipContainer.hasPlugin('hls_playback')) {
      // html5 players dispatches on:ready instantly, causing this style to be set after addPipCallback.
      // For flash players, we need to put it behind everything until flash dispatch on:ready.
      this.pipContainer.setStyle({'z-index': -1});
    }
    this.onContainerReady();
  },
  onContainerReady: function() {
    this.pipContainer.setVolume(0);
    this.pipContainer.play();
    this.pipContainer.setStyle(this.pipStyle);
    this.stopListening(this.pipContainer);
    this.listenToPipClick();
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
      this.tmpContainer.setStyle({'z-index': 2000});
      this.core.createContainer(source).then(this.addMasterCallback.bind(this));
    }
  },
  addMasterContainer: function(container) {
    if (this.masterContainer) {
      this.tmpContainer = this.masterContainer;
      this.tmpContainer.setStyle({'z-index': 2000});
      this.addMasterCallback(container);
    }
  },
  addMasterCallback: function(container) {
    this.masterContainer = container;
    if(this.pipContainer) {
      this.discardPip();
    }
    this.masterContainer.play();
    this.pipContainer = this.tmpContainer;
    this.tmpContainer = undefined;
    this.pipContainer.setVolume(0);
    this.pipContainer.trigger("container:pip", true);
    if (this.pipContainer.hasPlugin('hls_playback')) { //flash breaks on animate
      this.pipContainer.setStyle(this.pipStyle);
    } else {
      this.pipContainer.animate(this.pipStyle, {
        complete: function() {
          if(this.pipContainer) {
            this.pipContainer.setStyle(this.pipStyle);
          }
        }.bind(this)
      });
    }
    this.core.mediaControl.setContainer(this.masterContainer);
    this.core.mediaControl.render();
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
  },
  pipToMaster: function() {
    if (this.pipContainer) {
      this.pipContainer.animate(this.masterStyle, {complete: this.pipToMasterCallback.bind(this)});
    }
    return this;
  },
  pipToMasterCallback: function() {
    this.discardMaster();
    this.pipContainer.setVolume(100);
    this.pipContainer.trigger("container:pip", false);
    this.pipContainer.trigger('container:play');
    this.masterContainer = this.pipContainer;
    this.masterContainer.setStyle({"z-index": 20});
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
