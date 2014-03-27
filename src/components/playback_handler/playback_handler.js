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
      containers.push(this.createContainer(source));
    }, this);

    callback(containers);
  },
  findPlaybackPlugin: function(source) {
    return _.find(this.loader.playbackPlugins, function(p) { return p.canPlay(source) }, this);
  },
  createContainer: function(source, callback) {
    var playbackPlugin = this.findPlaybackPlugin(source);
    var container = new Container();
    if (callback) {
      this.listenTo(container, 'container:ready', function() { callback(container); });
    }
    this.addContainerPlugins(container);
    new playbackPlugin({container: container, src: source, autoPlay: !!this.params.autoPlay});
    return container;
  },
  addContainerPlugins: function(container) {
    _.each(this.loader.containerPlugins, function(plugin) {
      new plugin(_.extend(this.params, {container: container}));
    }, this);
  }
});

module.exports = PlaybackHandler;
