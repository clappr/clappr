/**
 * The PlaybackHandler is responsible for manage playback bootstrap and swapping sources.
 */

var BaseObject = require('../base/base_object');
var HTML5VideoPlaybackPlugin = require('../plugins/html5_video_playback');
var Container = require('../components/container');

var PlaybackHandler = BaseObject.extend({
  initialize: function(params) {
    this.params = params;
  },

  createContainers: function() {
    var containers = [];
    if ('src' in this.params) {
      var HTML5VideoContainer = new Container({className: 'HTML5VideoContainer'});
      var HTML5VideoPlayback = new HTML5VideoPlaybackPlugin({container: HTML5VideoContainer, src: this.params['src']});
      containers.push(HTML5VideoContainer);
    }
    return containers;
  }

});

module.exports = PlaybackHandler;
