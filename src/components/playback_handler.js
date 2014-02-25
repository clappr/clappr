// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The PlaybackHandler is responsible for manage playback bootstrap and swapping sources.
 */

var BaseObject = require('../base/base_object');
var Container = require('../components/container');
var PosterPlugin = require('../plugins/poster');

var HTML5VideoPlaybackPlugin = require('../plugins/html5_video_playback');
var HTML5AudioPlaybackPlugin = require('../plugins/html5_audio_playback');
var HLSVideoPlaybackPlugin = require('../plugins/hls_video_playback');
var SpinnerThreeBouncePlugin = require('../plugins/spinner_three_bounce');

var PlaybackHandler = BaseObject.extend({
  initialize: function(params) {
    this.params = params;
  },

  createContainers: function(callback) {
    var containers = [];
    if ('src' in this.params && this.params.src.match(/(.*).mp4/)) {
      containers.push(this.createHTML5VideoContainer());

    } else if ('src' in this.params && this.params.src.match(/(.*).mp3/)) {
      containers.push(this.createHTML5AudioContainer());

    } else if ('src' in this.params && this.params.src.match(/(.*).m3u8/)) {
      containers.push(this.createHLSVideoContainer());
    }

    callback(containers);
  },
  createHTML5VideoContainer: function() {
    var container = new Container({className: 'html5-video-container'});
    var poster = new PosterPlugin({container: container, src: 'image.png'});
    var playback = new HTML5VideoPlaybackPlugin({container: container, src: this.params.src});
    return container;
  },
  createHTML5AudioContainer: function() {
    var container = new Container({className: 'html5-audio-container'});
    var playback = new HTML5AudioPlaybackPlugin({container: container, src: this.params.src});
    return container;
  },
  createHLSVideoContainer: function() {
    var container = new Container({className: 'hls-video-container'});
    var poster = new PosterPlugin({container: container, src: 'image.png'});
    var spinner = new SpinnerThreeBouncePlugin({container: container});
    var playback = new HLSVideoPlaybackPlugin({container: container, src: this.params.src});
    return container;
  }
});

module.exports = PlaybackHandler;
