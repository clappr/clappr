/**
 * The Core is responsible to manage Containers, the mediator, MediaControl
 * and the player state.
 */

var BaseObject = require('../base/base_object');
var PlaybackHandler = require('./playback_handler');
var MediaControl = require('./playback_handler');

var Core = BaseObject.extend({
  initialize: function(params) {
    this.embedParams = params;
    this.playbackHandler = new PlaybackHandler(params);
  }
});

module.exports = Core;
