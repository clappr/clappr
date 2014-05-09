// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The ContainerFactory is responsible for manage playback bootstrap and create containers.
 */

var _ = require('underscore');
var BaseObject = require('../../base/base_object');
var Container = require('../container');
var $ = require('jquery');

var ContainerFactory = BaseObject.extend({
  initialize: function(params, loader) {
    this.params = params;
    this.loader = loader;
  },
  createContainers: function() {
    return $.Deferred(function(promise) {
      promise.resolve( _.map(this.params.sources, function(source) {
        return this.createContainer(source);
      }, this)
        );
    }.bind(this));
  },
  findPlaybackPlugin: function(source) {
    return _.find(this.loader.playbackPlugins, function(p) { return p.canPlay(source) }, this);
  },
  createContainer: function(source) {
    var playbackPlugin = this.findPlaybackPlugin(source);
    var params = _.extend({}, this.params, {src: source, autoPlay: !!this.params.autoPlay});
    var playback = new playbackPlugin(params);
    var container = new Container({playback: playback});
    var defer = $.Deferred();
    defer.promise(container);
    this.addContainerPlugins(container);
    this.listenTo(container, 'container:ready', function() {
      defer.resolve(container);
    }.bind(this));
    return container;
  },
  addContainerPlugins: function(container) {
    _.each(this.loader.containerPlugins, function(plugin) {
      container.addPlugin(new plugin(_.extend(this.params, {container: container})));
    }, this);
  }
});

module.exports = ContainerFactory;
