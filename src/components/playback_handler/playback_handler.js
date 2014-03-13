// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The PlaybackHandler is responsible for manage playback bootstrap and swapping sources.
 */

var _ = require('underscore');
var BaseObject = require('../../base/base_object');
var Container = require('../container');
var PosterPlugin = require('../../plugins/poster');

var HTML5VideoPlaybackPlugin = require('../../plugins/html5_video_playback');
var HTML5AudioPlaybackPlugin = require('../../plugins/html5_audio_playback');
var HLSVideoPlaybackPlugin = require('../../plugins/hls_playback');
var SpinnerThreeBouncePlugin = require('../../plugins/spinner_three_bounce');
var StatsPlugin = require('../../plugins/stats');
var StatsEvents = require('../../plugins/stats/stats_events');
var WaterMarkPlugin = require('../../plugins/watermark');

var PlaybackHandler = BaseObject.extend({
  initialize: function(params) {
    this.params = params;
  },
  createContainers: function(callback) {
    var containers = [];
    _.each(this.params.sources, function(value) {
        if (HTML5VideoPlaybackPlugin.canPlay(value)) {
          containers.push(this.createHTML5VideoContainer(value));
        } else if (HTML5AudioPlaybackPlugin.canPlay(value)) {
          containers.push(this.createHTML5AudioContainer(value));
        } else if (HLSVideoPlaybackPlugin.canPlay(value)) {
          containers.push(this.createHLSVideoContainer(value));
        }
    }, this);

    callback(containers);
  },
  createHTML5VideoContainer: function(src) {
    var container = new Container();
    var poster = new PosterPlugin({container: container});
    var playback = new HTML5VideoPlaybackPlugin({container: container, src: src, autoPlay: !!this.params.autoPlay});
    return container;
  },
  createHTML5AudioContainer: function(src) {
    var container = new Container();
    var playback = new HTML5AudioPlaybackPlugin({container: container, src: src, autoPlay: !!this.params.autoPlay});
    return container;
  },
  createHLSVideoContainer: function(src) {
    var container = new (Container.extend(StatsEvents))();
    var poster = new PosterPlugin({container: container, src: this.params.poster});
    var spinner = new SpinnerThreeBouncePlugin({container: container});

    // position can be "top-left", "top-right", "bottom-right" or  "bottom-left".
    var watermark = new WaterMarkPlugin({container: container, position: "bottom-right"});
    var stats = new StatsPlugin({container: container, reportInterval: 10000});
    var playback = new HLSVideoPlaybackPlugin({container: container, src: src, autoPlay: !!this.params.autoPlay});
    return container;
  }
});

module.exports = PlaybackHandler;
