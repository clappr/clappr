/**
 * Container is responsible for the video rendering and state
 */

var BaseObject = require('../base/base_object');

var Container = BaseObject.extend({
  events: {
    'click': 'clicked'
  },
  initialize: function() {
    this.trigger('container:ready');
  },
  timeUpdated: function(time) {
    this.trigger('container:timeupdate', time);
  },
  play: function() {
    this.trigger('container:play');
  },
  pause: function() {
    this.trigger('container:pause');
  },
  clicked: function() {
    this.trigger('container:click', this);
  },
  setCurrentTime: function(time) {
    this.trigger('container:seek', time);
  },
  getCurrentTime: function() {
  },
  requestFullscreen: function() {
    this.trigger('container:fullscreen');
  }
});

module.exports = Container;
