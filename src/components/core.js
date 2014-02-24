/**
 * The Core is responsible to manage Containers, the mediator, MediaControl
 * and the player state.
 */

var BaseObject = require('../base/base_object');
var PlaybackHandler = require('./playback_handler');
var MediaControl = require('./media_control');

var Core = BaseObject.extend({
  initialize: function(params) {
    this.playbackHandler = new PlaybackHandler(params);
    this.containers = this.playbackHandler.createContainers();
    this.createMediaControl(this.getCurrentContainer());
  },

  createMediaControl: function(container) {
    this.mediaControl = new MediaControl({container: container, className: "media-control"});
  },

  getCurrentContainer: function() {
    return this.containers[0];
  },

  render: function() {
    this.$el.append(this.mediaControl.render().el);
    this.$el.append(this.getCurrentContainer().render().el);
    return this;
  }
});

module.exports = Core;
