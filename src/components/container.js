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
  stop: function() {
    this.trigger('container:stop');
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
  setVolume: function(value) {
    this.trigger('container:volume', value);
  },
  requestFullscreen: function() {
    this.trigger('container:fullscreen');
  },
  buffering: function() {
    this.trigger('container:state:buffering');
  },
  playing: function() {
    this.trigger('container:state:playing');
  }
});

module.exports = Container;
