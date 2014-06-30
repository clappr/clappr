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

class ContainerFactory extends BaseObject {
  initialize(params, loader) {
    this.params = params;
    this.loader = loader;
  }

  createContainers() {
    return $.Deferred(function(promise) {
      promise.resolve( _.map(this.params.sources, function(source) {
        return this.createContainer(source);
      }, this));
    }.bind(this));
  }

  findPlaybackPlugin(source) {
    return _.find(this.loader.playbackPlugins, (p) => { return p.canPlay("" + source) }, this);
  }

  createContainer(source) {
    var playbackPlugin = this.findPlaybackPlugin(source);
    var params = _.extend({}, this.params, {src: source, autoPlay: !!this.params.autoPlay});
    var playback = new playbackPlugin(params);
    var container = new Container({playback: playback});
    var defer = $.Deferred();
    defer.promise(container);
    this.addContainerPlugins(container, source);
    this.listenToOnce(container, 'container:ready', () => defer.resolve(container) );
    return container;
  }

  addContainerPlugins(container, source) {
    _.each(this.loader.containerPlugins, function(plugin) {
      var params = _.extend(this.params, {container: container, src: source});
      container.addPlugin(new plugin(params));
    }, this);
  }
};

module.exports = ContainerFactory;
