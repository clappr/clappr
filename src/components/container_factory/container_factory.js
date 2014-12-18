// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The ContainerFactory is responsible for manage playback bootstrap and create containers.
 */

var _ = require('underscore');
var BaseObject = require('base_object');
var Container = require('container');
var $ = require('zepto');
var Events = require('../../base/events');

class ContainerFactory extends BaseObject {
  constructor(options, loader) {
    super(options);
    this.options = options;
    this.loader = loader;
  }

  createContainers() {
    return $.Deferred((promise) => {
      promise.resolve( _.map(this.options.sources, (source) => {
        return this.createContainer(source);
      }, this));
    });
  }

  findPlaybackPlugin(source) {
    return _.find(this.loader.playbackPlugins, (p) => { return p.canPlay(source.toString()) }, this);
  }

  createContainer(source) {
    var playbackPlugin = this.findPlaybackPlugin(source);
    var options = _.extend({}, this.options, {src: source, autoPlay: !!this.options.autoPlay});
    var playback = new playbackPlugin(options);
    var container = new Container({playback: playback});
    var defer = $.Deferred();
    defer.promise(container);
    this.addContainerPlugins(container, source);
    this.listenToOnce(container, Events.CONTAINER_READY, () => defer.resolve(container) );
    return container;
  }

  addContainerPlugins(container, source) {
    _.each(this.loader.containerPlugins, function(Plugin) {
      var options = _.extend(this.options, {container: container, src: source});
      container.addPlugin(new Plugin(options));
    }, this);
  }
}

module.exports = ContainerFactory;
