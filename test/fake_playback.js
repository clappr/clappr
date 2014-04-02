var Events = require('../src/base/events');
var _ = require('underscore');

module.exports = FakePlayback = function() {
  var noop = function() {};
  this.play = this.stop = this.pause = this.isPlaying = this.seek = this.volume = noop;
  this.settings = {
    left: ['playpause']
  }

  this.render = function() {
    return this;
  }
};

_.extend(FakePlayback.prototype, Events);
