var PlaybackPlugin = require('../base/playback_plugin');

var MP4PlaybackPlugin = PlaybackPlugin.extend({
  events: {
    'timeupdate': 'timeUpdated',
    'ended': 'ended'
  },
  tagName: 'video',
  className: 'container',
  initialize: function(args) {
    this.container = args.container;
    this.el.src = args.src;

    this.listenTo(this.container, 'container:play', this.play);
    this.listenTo(this.container, 'container:pause', this.pause);
    this.listenTo(this.container, 'container:seek', this.seek);
    this.listenTo(this.container, 'container:fullscreen', this.fullscreen);
    this.render(); // it should render when the container trigger 'ready'
  },
  play: function() {
    this.el.play();
  },
  pause: function() {
    this.el.pause();
  },
  fullscreen: function() {
    this.el.webkitRequestFullscreen();
  },
  mute: function() {
    this.el.volume = 0;
  },
  unmute: function() {
    this.el.volume = 1;
  },
  isMuted: function() {
    return !!this.el.volume
  },
  ended: function() {
    this.trigger('container:timeupdate', 0);
  },
  seek: function(seekBarValue) {
    var time = this.el.duration * (seekBarValue / 100);
    this.el.currentTime = time;
  },
  getCurrentTime: function() {
    return this.el.currentTime;
  },
  getDuration: function() {
    return this.el.duration;
  },
  timeUpdated: function() {
    var time = (100 / this.el.duration) * this.el.currentTime;
    this.container.timeUpdated(time);
  },
  render: function() {
    this.container.$el.append(this.el);
    return this;
  }
});

module.exports = MP4PlaybackPlugin;
