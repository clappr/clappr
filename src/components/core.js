// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Core is responsible to manage Containers, the mediator, MediaControl
 * and the player state.
 */

var UIObject = require('../base/ui_object');
var PlaybackHandler = require('./playback_handler');
var MediaControl = require('./media_control');

var Core = UIObject.extend({
  initialize: function(params) {
    this.parentElement = params.parentElement;
    this.playbackHandler = new PlaybackHandler(params);
    this.playbackHandler.createContainers(this.onContainersCreated.bind(this));
  },
  onContainersCreated: function(containers) {
    this.containers = containers;
    this.createMediaControl(this.getCurrentContainer());
    this.render();
    this.$el.appendTo(this.parentElement);
  },
  createMediaControl: function(container) {
    this.mediaControl = new MediaControl({container: container, className: 'media-control'});
  },
  getCurrentContainer: function() {
    return this.containers[0];
  },
  render: function() {
    this.$el.append(this.getCurrentContainer().render().el);
    this.$el.append(this.mediaControl.render().el);
    return this;
  }
});

module.exports = Core;
