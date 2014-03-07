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
var WaterMarkPlugin = require('../../plugins/watermark');

var PlaybackHandler = BaseObject.extend({
  initialize: function(params) {
    this.params = params;
  },

  createContainers: function(callback) {
    var containers = [];
    _.each(this.params, function(value, key) {
      if (key === "src" || key === "pip") {
        if (value.match(/(.*).mp4/)) {
          containers.push(this.createHTML5VideoContainer());
        } else if (value.match(/(.*).mp3/)) {
          containers.push(this.createHTML5AudioContainer());
        } else if (value.match(/(.*).m3u8/)) {
          containers.push(this.createHLSVideoContainer(value));
        }
      }
    }, this);

    callback(containers);
  },
  createHTML5VideoContainer: function() {
    var container = new Container();
    var poster = new PosterPlugin({container: container, src: "image2.png"});
    var playback = new HTML5VideoPlaybackPlugin({container: container, src: this.params.src, autoPlay: !!this.params.autoPlay});
    return container;
  },
  createHTML5AudioContainer: function() {
    var container = new Container();
    var playback = new HTML5AudioPlaybackPlugin({container: container, src: this.params.src, autoPlay: !!this.params.autoPlay});
    return container;
  },
  createHLSVideoContainer: function(src) {
    var container = new Container();
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
