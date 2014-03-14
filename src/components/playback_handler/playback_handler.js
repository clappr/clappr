// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The PlaybackHandler is responsible for manage playback bootstrap and swapping sources.
 */

var _ = require('underscore');
var BaseObject = require('../../base/base_object');
var Container = require('../container');

var PlaybackHandler = BaseObject.extend({
  initialize: function(params, loader) {
    this.params = params;
    this.loader = loader;
  },
  createContainers: function(callback) {
    var containers = [];
    _.each(this.params.sources, function(source) {
      var playbackPlugin = this.findPlaybackPlugin(source);
      containers.push(this.createContainer(playbackPlugin, source));
    }, this);

    callback(containers);
  },
  findPlaybackPlugin: function(source) {
    return _.find(this.loader.playbackPlugins, function(p) { return p.canPlay(source) }, this);
  },
  createContainer: function(playbackPlugin, source) {
    var container = new Container();
    new playbackPlugin({container: container, src: source, autoPlay: !!this.params.autoPlay});
    this.addContainerPlugins(container);
    return container;
  },
  addContainerPlugins: function(container) {
    _.each(this.loader.containerPlugins, function(plugin) {
      new plugin(_.extend(this.params, {container: container}));
    }, this);
  }
});

module.exports = PlaybackHandler;
