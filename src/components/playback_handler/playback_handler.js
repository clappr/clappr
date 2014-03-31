// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The PlaybackHandler is responsible for manage playback bootstrap and swapping sources.
 */

var _ = require('underscore');
var BaseObject = require('../../base/base_object');
var Container = require('../container');
var RSVP = require('rsvp');

var PlaybackHandler = BaseObject.extend({
  initialize: function(params, loader) {
    this.params = params;
    this.loader = loader;
  },
  createContainers: function() {
    var promise = new RSVP.Promise(function(resolve, reject) {
      var promises = [];
      _.each(this.params.sources, function(source) {
        promises.push(this.createContainer(source));
      }, this);

      RSVP.all(promises).then(function(containers) {
        _.each(containers, this.addContainerPlugins, this);
        resolve(containers);
      }.bind(this));
    }.bind(this));

    return promise;
  },
  findPlaybackPlugin: function(source) {
    return _.find(this.loader.playbackPlugins, function(p) { return p.canPlay(source) }, this);
  },
  createContainer: function(source) {
    var playbackPlugin = this.findPlaybackPlugin(source);
    var playback = new playbackPlugin({src: source, autoPlay: !!this.params.autoPlay});
    var promise = Container.create(playback);
    return promise;
  },
  addContainerPlugins: function(container) {
    _.each(this.loader.containerPlugins, function(plugin) {
      container.addPlugin(new plugin(_.extend(this.params, {container: container})));
    }, this);
  }
});

module.exports = PlaybackHandler;
