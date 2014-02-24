/**
 * The PlaybackHandler is responsible for manage playback bootstrap and swapping sources.
 */

var BaseObject = require('../base/base_object');
var HTML5VideoPlaybackPlugin = require('../plugins/html5_video_playback');
var HTML5AudioPlaybackPlugin = require('../plugins/html5_audio_playback');
var Container = require('../components/container');

var PlaybackHandler = BaseObject.extend({
  initialize: function(params) {
    this.params = params;
  },

  createContainers: function() {
    var containers = [];
    if ('src' in this.params && this.params.src.match(/(.*).mp4/)) {
      containers.push(this.createHTML5VideoContainer());
    } else if ('src' in this.params && this.params.src.match(/(.*).mp3/)) {
      containers.push(this.createHTML5AudioContainer());
    }
    return containers;
  },
  createHTML5VideoContainer: function() {
    var HTML5VideoContainer = new Container({className: 'html5-video-container'});
    var HTML5VideoPlayback = new HTML5VideoPlaybackPlugin({container: HTML5VideoContainer, src: this.params.src});
    return HTML5VideoContainer;
  },
  createHTML5AudioContainer: function() {
    var HTML5AudioContainer = new Container({className: 'html5-audio-container'});
    var HTML5AudioPlayback = new HTML5AudioPlaybackPlugin({container: HTML5AudioContainer, src: this.params.src});
    return HTML5AudioContainer;
  },

});

module.exports = PlaybackHandler;
