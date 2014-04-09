var BaseObject = require('../../base/base_object');
var _ = require('underscore');

var SequenceContainer = BaseObject.extend({
  name: 'SequenceContainer',
  initialize: function(containers) {
    this.containers = containers;
    this.plugins = [];
    this.currentContainer = 0;
    this.checkpoint = 0;
    this.duration = 0;
    _.each(this.containers, this._setupContainers, this);
    this.listenTo(this.getCurrentContainer(), 'container:ended', this.playNextContainer);
    this.listenTo(this.getCurrentContainer(), 'container:timeupdate', this.timeUpdateProxy);
    this.getCurrentContainer().$el.show();
    this.settings = this.getCurrentContainer().settings;
  },
  _setupContainers: function(container) {
    container.$el.hide();
    this.listenTo(container, 'container:loadedmetadata', this._setupDuration);
  },
  _setupDuration: function(duration) {
    this.duration += duration;
    this.trigger('container:timeupdate', 0, this.duration);
  },
  playNextContainer: function() {
    this.getCurrentContainer().$el.hide();
    this.stopListening(this.getCurrentContainer());
    var nextContainer = this.getNextContainer();
    this.listenTo(nextContainer, 'container:ended', this.playNextContainer);
    this.listenTo(nextContainer, 'container:timeupdate', this.timeUpdateProxy);
    this.listenTo(nextContainer, 'container:progress', this.progressProxy);
    this.sequencePosition = 0;
    if(this.currentContainer !== 0) {
      nextContainer.play();
      this.trigger('container:play');
      nextContainer.$el.show();
    } else {
      this.checkpoint = 0;
      this.stop();
      nextContainer.$el.show();
      this.trigger('container:ended');
    }
  },
  timeUpdateProxy: function(position, duration) {
    this.trigger('container:timeupdate', position + this.checkpoint, this.duration, this.name);
  },
  progressProxy: function(startPosition, endPosition, duration) {
    this.trigger('container:progress', startPosition, endPosition, this.duration, this.name);
  },
  getCurrentContainer: function() {
    return this.containers[this.currentContainer];
  },
  getNextContainer: function() {
    this.checkpoint = this.getCurrentContainer().playback.getDuration();
    this.currentContainer = ++this.currentContainer % this.containers.length;
    var nextContainer = this.containers[this.currentContainer];
    this.settings = nextContainer.settings;
    this.trigger('container:settingsupdate');
    return nextContainer;
  },
  play: function() {
    this.getCurrentContainer().playback.play();
    this.trigger('container:play', this.name);
  },
  pause: function() {
    this.getCurrentContainer().pause();
    this.trigger('container:pause', this.name);
  },
  stop: function() {
    this.getCurrentContainer().stop();
    this.trigger('container:stop', this.name);
  },
  playing: function() {
    this.trigger('container:playing', this.name);
  },
//  timeUpdated: function(position, duration) {
//    var sequencePosition = (position * this.duration) / duration
//    this.trigger('container:timeupdate', sequencePosition, this.duration, this.name);
//  },
  progress: function(startPosition, endPosition, duration) {
    console.log('container progress?');
    this.trigger('container:progress', startPosition, endPosition, duration);
  },
  settingsUpdate: function() {
    this.settings = this.getCurrentContainer().settings;
    this.trigger('container:settingsupdate');
  },
  isPlaying: function() {
    return this.getCurrentContainer().isPlaying();
  },
  render: function() {
    this.el = _.map(this.containers, function(container) {
      return container.render().el;
    });
    return this;
  }
});

module.exports = SequenceContainer;

