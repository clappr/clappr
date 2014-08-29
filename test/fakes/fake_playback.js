var Events = require('../../src/base/events');

class FakePlayback extends Events {
  constructor() {
    this.settings = {
      left: ['playpause', 'volume'],
      right: ['fullscreen'],
      default: ['position', 'seekbar', 'duration']
    };
  }

  getPlaybackType() {
    return 'fake';
  }
}

module.exports = FakePlayback;
